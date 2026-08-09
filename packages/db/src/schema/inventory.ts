import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(), // e.g. STK-1001
  name: text('name').notNull(),         // e.g. 18mm Beyaz MDF Lam, Çalışma Masası
  category: text('category').default('Genel').notNull(),
  unit: text('unit').default('Adet').notNull(), // Adet, Plaka, Metre, Paket, Kg
  purchasePrice: real('purchase_price').default(0).notNull(),
  salePrice: real('sale_price').default(0).notNull(),
  stockQuantity: real('stock_quantity').default(0).notNull(),
  minStockLevel: real('min_stock_level').default(5).notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  createdAt: text('created_at').notNull(),
});

export const stockMovements = sqliteTable('stock_movements', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  documentId: text('document_id'),
  type: text('type', { enum: ['in', 'out'] }).notNull(), // 'in' = Giriş (Alım), 'out' = Çıkış (Satış)
  quantity: real('quantity').notNull(),
  unitPrice: real('unit_price').default(0).notNull(),
  totalPrice: real('total_price').default(0).notNull(),
  description: text('description'),
  date: text('date').notNull(),
  createdAt: text('created_at').notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type StockMovement = typeof stockMovements.$inferSelect;
export type NewStockMovement = typeof stockMovements.$inferInsert;
