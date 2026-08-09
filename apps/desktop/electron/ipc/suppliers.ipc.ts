import { ipcMain } from 'electron';
import { getDatabase } from '../database/client';
import * as schema from '../database/schema';
import { eq, desc, sql, and } from 'drizzle-orm';

export interface CreateSupplierPayload {
  name: string;
  phone?: string;
  taxNumber?: string;
  address?: string;
  notes?: string;
}

export function registerSuppliersIPC() {
  // List suppliers with dynamically computed balances
  ipcMain.handle('suppliers:list', async () => {
    const db = getDatabase();

    const supplierList = db
      .select()
      .from(schema.entities)
      .where(eq(schema.entities.type, 'supplier'))
      .all();

    const result = supplierList.map((supplier) => {
      const balanceRes = db
        .select({
          totalDebit: sql<number>`COALESCE(SUM(${schema.journalItems.debit}), 0)`,
          totalCredit: sql<number>`COALESCE(SUM(${schema.journalItems.credit}), 0)`,
        })
        .from(schema.journalItems)
        .innerJoin(schema.journalEntries, eq(schema.journalItems.journalEntryId, schema.journalEntries.id))
        .where(
          and(
            eq(schema.journalItems.entityId, supplier.id),
            eq(schema.journalEntries.status, 'active')
          )
        )
        .get();

      const totalDebit = balanceRes?.totalDebit || 0;
      const totalCredit = balanceRes?.totalCredit || 0;
      const balance = totalCredit - totalDebit; // Positive = We owe supplier (Alacak Bakiyesi)

      return {
        ...supplier,
        totalDebit,
        totalCredit,
        balance,
      };
    });

    return result;
  });

  // Get Supplier statement (Satıcı Ekstresi)
  ipcMain.handle('suppliers:getStatement', async (_, supplierId: string) => {
    const db = getDatabase();

    const supplier = db
      .select()
      .from(schema.entities)
      .where(eq(schema.entities.id, supplierId))
      .get();

    if (!supplier) throw new Error('Tedarikçi bulunamadı.');

    const movements = db
      .select({
        id: schema.journalItems.id,
        date: schema.journalEntries.date,
        docNumber: schema.documents.docNumber,
        docType: schema.documents.type,
        description: schema.journalItems.description,
        debit: schema.journalItems.debit,
        credit: schema.journalItems.credit,
      })
      .from(schema.journalItems)
      .innerJoin(schema.journalEntries, eq(schema.journalItems.journalEntryId, schema.journalEntries.id))
      .leftJoin(schema.documents, eq(schema.journalEntries.documentId, schema.documents.id))
      .where(
        and(
          eq(schema.journalItems.entityId, supplierId),
          eq(schema.journalEntries.status, 'active')
        )
      )
      .orderBy(schema.journalEntries.date, schema.journalEntries.createdAt)
      .all();

    let runningBalance = 0;
    const itemsWithBalance = movements.map((item) => {
      runningBalance += item.credit - item.debit;
      return {
        ...item,
        runningBalance,
      };
    });

    return {
      supplier,
      movements: itemsWithBalance,
      currentBalance: runningBalance,
    };
  });

  // Create new supplier
  ipcMain.handle('suppliers:create', async (_, payload: CreateSupplierPayload) => {
    const db = getDatabase();

    const now = new Date().toISOString();
    const supplierId = 'supp_' + Date.now();

    const countRes = db
      .select({ count: sql<number>`count(*)` })
      .from(schema.entities)
      .where(eq(schema.entities.type, 'supplier'))
      .get();

    const seq = ((countRes?.count || 0) + 1).toString().padStart(3, '0');
    const accountCode = `320.${seq}`;
    const accountId = `acc_320_${seq}`;

    db.insert(schema.accounts)
      .values({
        id: accountId,
        code: accountCode,
        name: payload.name,
        type: 'liability',
        parentCode: '320',
        createdAt: now,
      })
      .run();

    db.insert(schema.entities)
      .values({
        id: supplierId,
        name: payload.name,
        type: 'supplier',
        accountId: accountId,
        phone: payload.phone || null,
        taxNumber: payload.taxNumber || null,
        address: payload.address || null,
        notes: payload.notes || null,
        isActive: true,
        createdAt: now,
      })
      .run();

    return { success: true, supplierId, accountCode };
  });
}
