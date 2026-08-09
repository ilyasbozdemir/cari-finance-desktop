import { ipcMain } from 'electron';
import { getDatabase } from '../database/client';
import * as schema from '../database/schema';
import { eq, desc, sql } from 'drizzle-orm';

export interface CreateProductPayload {
  name: string;
  category?: string;
  unit?: string;
  purchasePrice?: number;
  salePrice?: number;
  stockQuantity?: number;
  minStockLevel?: number;
}

export interface StockMovementPayload {
  productId: string;
  type: 'in' | 'out';
  quantity: number;
  unitPrice?: number;
  description?: string;
}

export function registerInventoryIPC() {
  // List all products
  ipcMain.handle('inventory:list', async () => {
    const db = getDatabase();
    const productList = db.select().from(schema.products).orderBy(desc(schema.products.createdAt)).all();

    return productList.map((prod) => ({
      ...prod,
      totalStockValue: prod.stockQuantity * prod.purchasePrice,
    }));
  });

  // Create Product
  ipcMain.handle('inventory:create', async (_, payload: CreateProductPayload) => {
    const db = getDatabase();
    const now = new Date().toISOString();

    const countRes = db.select({ count: sql<number>`count(*)` }).from(schema.products).get();
    const seq = ((countRes?.count || 0) + 1).toString().padStart(4, '0');
    const code = `STK-${seq}`;
    const productId = `prod_${Date.now()}`;

    db.insert(schema.products)
      .values({
        id: productId,
        code,
        name: payload.name,
        category: payload.category || 'Genel',
        unit: payload.unit || 'Adet',
        purchasePrice: payload.purchasePrice || 0,
        salePrice: payload.salePrice || 0,
        stockQuantity: payload.stockQuantity || 0,
        minStockLevel: payload.minStockLevel ?? 5,
        isActive: true,
        createdAt: now,
      })
      .run();

    // If initial stock quantity > 0, create an initial stock movement entry
    if (payload.stockQuantity && payload.stockQuantity > 0) {
      db.insert(schema.stockMovements)
        .values({
          id: `stk_mov_${Date.now()}`,
          productId,
          type: 'in',
          quantity: payload.stockQuantity,
          unitPrice: payload.purchasePrice || 0,
          totalPrice: (payload.stockQuantity) * (payload.purchasePrice || 0),
          description: 'Açılış / Devir Stok Miktarı',
          date: now.split('T')[0],
          createdAt: now,
        })
        .run();
    }

    return { success: true, productId, code };
  });

  // Add Stock Movement (Giriş / Çıkış)
  ipcMain.handle('inventory:updateStock', async (_, payload: StockMovementPayload) => {
    const db = getDatabase();
    const now = new Date().toISOString();

    const product = db.select().from(schema.products).where(eq(schema.products.id, payload.productId)).get();
    if (!product) throw new Error('Ürün bulunamadı.');

    if (payload.quantity <= 0) {
      throw new Error('Stok hareket miktarı 0\'dan büyük olmalıdır.');
    }

    const currentQty = product.stockQuantity;
    const newQty = payload.type === 'in' ? currentQty + payload.quantity : currentQty - payload.quantity;

    if (payload.type === 'out' && newQty < 0) {
      throw new Error(`Yetersiz stok! Mevcut stok: ${currentQty} ${product.unit}`);
    }

    const unitPrice = payload.unitPrice ?? (payload.type === 'in' ? product.purchasePrice : product.salePrice);
    const totalPrice = payload.quantity * unitPrice;

    db.update(schema.products)
      .set({ stockQuantity: newQty })
      .where(eq(schema.products.id, payload.productId))
      .run();

    db.insert(schema.stockMovements)
      .values({
        id: `stk_mov_${Date.now()}`,
        productId: payload.productId,
        type: payload.type,
        quantity: payload.quantity,
        unitPrice,
        totalPrice,
        description: payload.description || (payload.type === 'in' ? 'Stok Girişi' : 'Stok Çıkışı'),
        date: now.split('T')[0],
        createdAt: now,
      })
      .run();

    return { success: true, newStockQuantity: newQty };
  });

  // Get Movements for Product
  ipcMain.handle('inventory:getMovements', async (_, productId: string) => {
    const db = getDatabase();

    const product = db.select().from(schema.products).where(eq(schema.products.id, productId)).get();
    if (!product) throw new Error('Ürün bulunamadı.');

    const movements = db
      .select()
      .from(schema.stockMovements)
      .where(eq(schema.stockMovements.productId, productId))
      .orderBy(desc(schema.stockMovements.createdAt))
      .all();

    return {
      product,
      movements,
    };
  });
}
