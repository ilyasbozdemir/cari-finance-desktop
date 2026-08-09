import { ipcMain } from 'electron';
import { getDatabase } from '../database/client';
import * as schema from '../database/schema';
import { eq, desc, sql } from 'drizzle-orm';

export interface CreateTransactionPayload {
  type: 'sale' | 'customer_payment' | 'purchase' | 'supplier_payment' | 'partner_draw' | 'partner_deposit' | 'transfer' | 'expense';
  date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  entityId?: string;       // Customer, Supplier, Partner, Cash, or Bank entity ID
  targetEntityId?: string; // For transfers or payment destination
  categoryId?: string;     // For expense/revenue classification
}

export function registerTransactionsIPC() {
  // Create High-Level Transaction with double-entry enforcement
  ipcMain.handle('transactions:create', async (_, payload: CreateTransactionPayload) => {
    const db = getDatabase();

    if (payload.amount <= 0) {
      throw new Error('İşlem tutarı 0 veya negatif olamaz.');
    }

    const now = new Date().toISOString();
    const docId = 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const entryId = 'yev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    // Document Prefix map
    const prefixMap: Record<string, string> = {
      sale: 'SAT',
      customer_payment: 'TAH',
      purchase: 'ALIM',
      supplier_payment: 'ODE',
      partner_draw: 'ORT-CEK',
      partner_deposit: 'ORT-YAT',
      transfer: 'VIR',
      expense: 'GID',
    };

    const countRes = db.select({ count: sql<number>`count(*)` }).from(schema.documents).get();
    const docSeq = ((countRes?.count || 0) + 1).toString().padStart(5, '0');
    const year = new Date(payload.date || Date.now()).getFullYear();
    const docNumber = `${prefixMap[payload.type] || 'ISL'}-${year}-${docSeq}`;
    const entryNumber = `YEV-${year}-${docSeq}`;

    let debitAccountId = '';
    let creditAccountId = '';
    let debitEntityId: string | undefined = undefined;
    let creditEntityId: string | undefined = undefined;

    // Resolve entities & accounts based on transaction type
    if (payload.type === 'sale') {
      if (!payload.entityId) throw new Error('Satış işlemi için müşteri seçilmelidir.');
      const customer = db.select().from(schema.entities).where(eq(schema.entities.id, payload.entityId)).get();
      if (!customer) throw new Error('Müşteri bulunamadı.');

      debitAccountId = customer.accountId;
      debitEntityId = customer.id;

      const salesAccount = db.select().from(schema.accounts).where(eq(schema.accounts.code, '600')).get();
      if (!salesAccount) throw new Error('600 Satış Gelirleri hesabı bulunamadı.');
      creditAccountId = salesAccount.id;

    } else if (payload.type === 'customer_payment') {
      if (!payload.entityId) throw new Error('Tahsilat için müşteri seçilmelidir.');
      const customer = db.select().from(schema.entities).where(eq(schema.entities.id, payload.entityId)).get();
      if (!customer) throw new Error('Müşteri bulunamadı.');

      const cashAccount = db.select().from(schema.accounts).where(eq(schema.accounts.code, '100')).get();
      if (!cashAccount) throw new Error('100 Kasa hesabı bulunamadı.');

      debitAccountId = cashAccount.id;
      if (payload.targetEntityId) {
        const cashEntity = db.select().from(schema.entities).where(eq(schema.entities.id, payload.targetEntityId)).get();
        if (cashEntity) debitEntityId = cashEntity.id;
      }

      creditAccountId = customer.accountId;
      creditEntityId = customer.id;

    } else if (payload.type === 'purchase') {
      if (!payload.entityId) throw new Error('Alım için tedarikçi seçilmelidir.');
      const supplier = db.select().from(schema.entities).where(eq(schema.entities.id, payload.entityId)).get();
      if (!supplier) throw new Error('Tedarikçi bulunamadı.');

      const goodsAccount = db.select().from(schema.accounts).where(eq(schema.accounts.code, '153')).get();
      if (!goodsAccount) throw new Error('153 Ticari Mallar hesabı bulunamadı.');

      debitAccountId = goodsAccount.id;
      creditAccountId = supplier.accountId;
      creditEntityId = supplier.id;

    } else if (payload.type === 'supplier_payment') {
      if (!payload.entityId) throw new Error('Ödeme için tedarikçi seçilmelidir.');
      const supplier = db.select().from(schema.entities).where(eq(schema.entities.id, payload.entityId)).get();
      if (!supplier) throw new Error('Tedarikçi bulunamadı.');

      const cashAccount = db.select().from(schema.accounts).where(eq(schema.accounts.code, '100')).get();
      if (!cashAccount) throw new Error('100 Kasa hesabı bulunamadı.');

      debitAccountId = supplier.accountId;
      debitEntityId = supplier.id;
      creditAccountId = cashAccount.id;

    } else if (payload.type === 'partner_draw') {
      if (!payload.entityId) throw new Error('Ortak seçilmelidir.');
      const partner = db.select().from(schema.entities).where(eq(schema.entities.id, payload.entityId)).get();
      if (!partner) throw new Error('Ortak bulunamadı.');

      const cashAccount = db.select().from(schema.accounts).where(eq(schema.accounts.code, '100')).get();
      if (!cashAccount) throw new Error('100 Kasa hesabı bulunamadı.');

      debitAccountId = partner.accountId;
      debitEntityId = partner.id;
      creditAccountId = cashAccount.id;

    } else if (payload.type === 'partner_deposit') {
      if (!payload.entityId) throw new Error('Ortak seçilmelidir.');
      const partner = db.select().from(schema.entities).where(eq(schema.entities.id, payload.entityId)).get();
      if (!partner) throw new Error('Ortak bulunamadı.');

      const cashAccount = db.select().from(schema.accounts).where(eq(schema.accounts.code, '100')).get();
      if (!cashAccount) throw new Error('100 Kasa hesabı bulunamadı.');

      debitAccountId = cashAccount.id;
      creditAccountId = partner.accountId;
      creditEntityId = partner.id;

    } else if (payload.type === 'transfer') {
      if (!payload.entityId || !payload.targetEntityId) {
        throw new Error('Virman için kaynak ve hedef hesap seçilmelidir.');
      }
      const source = db.select().from(schema.entities).where(eq(schema.entities.id, payload.entityId)).get();
      const target = db.select().from(schema.entities).where(eq(schema.entities.id, payload.targetEntityId)).get();
      if (!source || !target) throw new Error('Kaynak veya hedef hesap bulunamadı.');

      debitAccountId = target.accountId;
      debitEntityId = target.id;
      creditAccountId = source.accountId;
      creditEntityId = source.id;

    } else if (payload.type === 'expense') {
      const expenseAccount = db.select().from(schema.accounts).where(eq(schema.accounts.code, '770')).get();
      if (!expenseAccount) throw new Error('770 Gider hesabı bulunamadı.');

      const cashAccount = db.select().from(schema.accounts).where(eq(schema.accounts.code, '100')).get();
      if (!cashAccount) throw new Error('100 Kasa hesabı bulunamadı.');

      debitAccountId = expenseAccount.id;
      creditAccountId = cashAccount.id;
    }

    const documentRecord = {
      id: docId,
      docNumber,
      type: payload.type,
      date: payload.date,
      description: payload.description,
      totalAmount: payload.amount,
      createdAt: now,
    };

    const journalEntryRecord = {
      id: entryId,
      entryNumber,
      documentId: docId,
      date: payload.date,
      description: payload.description,
      status: 'active' as const,
      createdAt: now,
    };

    const debitItem = {
      id: 'ji_' + Date.now() + '_1',
      journalEntryId: entryId,
      accountId: debitAccountId,
      entityId: debitEntityId || null,
      debit: payload.amount,
      credit: 0,
      description: payload.description,
    };

    const creditItem = {
      id: 'ji_' + Date.now() + '_2',
      journalEntryId: entryId,
      accountId: creditAccountId,
      entityId: creditEntityId || null,
      debit: 0,
      credit: payload.amount,
      description: payload.description,
    };

    db.insert(schema.documents).values(documentRecord).run();
    db.insert(schema.journalEntries).values(journalEntryRecord).run();
    db.insert(schema.journalItems).values([debitItem, creditItem]).run();

    return { success: true, docNumber, entryNumber };
  });

  // List recent transactions
  ipcMain.handle('transactions:list', async (_, options?: { entityId?: string; limit?: number }) => {
    const db = getDatabase();
    const limit = options?.limit || 100;

    const result = db
      .select({
        id: schema.journalEntries.id,
        entryNumber: schema.journalEntries.entryNumber,
        docNumber: schema.documents.docNumber,
        docType: schema.documents.type,
        date: schema.journalEntries.date,
        description: schema.journalEntries.description,
        totalAmount: schema.documents.totalAmount,
        status: schema.journalEntries.status,
      })
      .from(schema.journalEntries)
      .leftJoin(schema.documents, eq(schema.journalEntries.documentId, schema.documents.id))
      .orderBy(desc(schema.journalEntries.date), desc(schema.journalEntries.createdAt))
      .limit(limit)
      .all();

    return result;
  });

  // Strict Accounting Reversing Entry (Ters Düzeltme Kaydı - No Silme, Full Audit Trail)
  ipcMain.handle('transactions:cancel', async (_, entryId: string) => {
    const db = getDatabase();
    const now = new Date().toISOString();

    const entry = db.select().from(schema.journalEntries).where(eq(schema.journalEntries.id, entryId)).get();
    if (!entry) throw new Error('İşlem kaydı bulunamadı.');

    if (entry.status === 'cancelled') {
      throw new Error('Bu işlem zaten ters kayıt ile düzeltilmiş.');
    }

    // Get original journal items to flip debit & credit
    const originalItems = db
      .select()
      .from(schema.journalItems)
      .where(eq(schema.journalItems.journalEntryId, entryId))
      .all();

    if (originalItems.length === 0) {
      throw new Error('İşlem detay satırları bulunamadı.');
    }

    // 1. Mark original entry as 'cancelled' (Ters Kaydı Oluşturuldu)
    db.update(schema.journalEntries)
      .set({ status: 'cancelled' })
      .where(eq(schema.journalEntries.id, entryId))
      .run();

    // 2. Create Reversing Document & Reversing Journal Entry
    const revDocId = 'doc_rev_' + Date.now();
    const revEntryId = 'yev_rev_' + Date.now();
    const countRes = db.select({ count: sql<number>`count(*)` }).from(schema.documents).get();
    const docSeq = ((countRes?.count || 0) + 1).toString().padStart(5, '0');
    const year = new Date().getFullYear();

    const revDocNumber = `TRS-${year}-${docSeq}`;
    const revEntryNumber = `TRS-YEV-${year}-${docSeq}`;

    const originalDoc = entry.documentId
      ? db.select().from(schema.documents).where(eq(schema.documents.id, entry.documentId)).get()
      : null;

    const totalAmount = originalDoc?.totalAmount || 0;
    const revDesc = `TERS DÜZELTME KAYDI (${entry.entryNumber} / ${entry.description})`;

    // Insert Reversing Document
    db.insert(schema.documents)
      .values({
        id: revDocId,
        docNumber: revDocNumber,
        type: originalDoc?.type || 'transfer',
        date: now.split('T')[0],
        description: revDesc,
        totalAmount,
        createdAt: now,
      })
      .run();

    // Insert Reversing Journal Entry
    db.insert(schema.journalEntries)
      .values({
        id: revEntryId,
        entryNumber: revEntryNumber,
        documentId: revDocId,
        date: now.split('T')[0],
        description: revDesc,
        status: 'active',
        createdAt: now,
      })
      .run();

    // Insert Reversed Journal Items (FLIP Debit <-> Credit)
    const reversedItems = originalItems.map((item, idx) => ({
      id: `ji_rev_${Date.now()}_${idx}`,
      journalEntryId: revEntryId,
      accountId: item.accountId,
      entityId: item.entityId,
      debit: item.credit, // FLIPPED
      credit: item.debit, // FLIPPED
      description: `TERS KAYIT: ${item.description || ''}`,
    }));

    db.insert(schema.journalItems).values(reversedItems).run();

    return { success: true, revDocNumber, revEntryNumber };
  });
}
