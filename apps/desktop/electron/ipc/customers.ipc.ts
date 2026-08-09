import { ipcMain } from 'electron';
import { getDatabase } from '../database/client';
import * as schema from '../database/schema';
import { eq, desc, sql, and } from 'drizzle-orm';

export interface CreateCustomerPayload {
  name: string;
  phone?: string;
  taxNumber?: string;
  address?: string;
  notes?: string;
}

export function registerCustomersIPC() {
  // List all customers with dynamically computed balances
  ipcMain.handle('customers:list', async () => {
    const db = getDatabase();

    const customerList = db
      .select()
      .from(schema.entities)
      .where(eq(schema.entities.type, 'customer'))
      .all();

    // Compute dynamic ledger balance for each customer
    const result = customerList.map((customer) => {
      const balanceRes = db
        .select({
          totalDebit: sql<number>`COALESCE(SUM(${schema.journalItems.debit}), 0)`,
          totalCredit: sql<number>`COALESCE(SUM(${schema.journalItems.credit}), 0)`,
        })
        .from(schema.journalItems)
        .innerJoin(schema.journalEntries, eq(schema.journalItems.journalEntryId, schema.journalEntries.id))
        .where(
          and(
            eq(schema.journalItems.entityId, customer.id),
            eq(schema.journalEntries.status, 'active')
          )
        )
        .get();

      const totalDebit = balanceRes?.totalDebit || 0;
      const totalCredit = balanceRes?.totalCredit || 0;
      const balance = totalDebit - totalCredit; // Positive = Customer owes us (Borç Bakiyesi)

      return {
        ...customer,
        totalDebit,
        totalCredit,
        balance,
      };
    });

    return result;
  });

  // Get customer detail + statement ledger (Müşteri Ekstresi)
  ipcMain.handle('customers:getStatement', async (_, customerId: string) => {
    const db = getDatabase();

    const customer = db
      .select()
      .from(schema.entities)
      .where(eq(schema.entities.id, customerId))
      .get();

    if (!customer) throw new Error('Müşteri bulunamadı.');

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
          eq(schema.journalItems.entityId, customerId),
          eq(schema.journalEntries.status, 'active')
        )
      )
      .orderBy(schema.journalEntries.date, schema.journalEntries.createdAt)
      .all();

    let runningBalance = 0;
    const itemsWithBalance = movements.map((item) => {
      runningBalance += item.debit - item.credit;
      return {
        ...item,
        runningBalance,
      };
    });

    return {
      customer,
      movements: itemsWithBalance,
      currentBalance: runningBalance,
    };
  });

  // Add new customer
  ipcMain.handle('customers:create', async (_, payload: CreateCustomerPayload) => {
    const db = getDatabase();

    const now = new Date().toISOString();
    const customerId = 'cust_' + Date.now();

    // Generate next 120.xxx sub-account code
    const countRes = db
      .select({ count: sql<number>`count(*)` })
      .from(schema.entities)
      .where(eq(schema.entities.type, 'customer'))
      .get();

    const seq = ((countRes?.count || 0) + 1).toString().padStart(3, '0');
    const accountCode = `120.${seq}`;
    const accountId = `acc_120_${seq}`;

    // Create Account record
    db.insert(schema.accounts)
      .values({
        id: accountId,
        code: accountCode,
        name: payload.name,
        type: 'asset',
        parentCode: '120',
        createdAt: now,
      })
      .run();

    // Create Customer Entity record
    db.insert(schema.entities)
      .values({
        id: customerId,
        name: payload.name,
        type: 'customer',
        accountId: accountId,
        phone: payload.phone || null,
        taxNumber: payload.taxNumber || null,
        address: payload.address || null,
        notes: payload.notes || null,
        isActive: true,
        createdAt: now,
      })
      .run();

    return { success: true, customerId, accountCode };
  });
}
