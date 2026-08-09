import { ipcMain } from 'electron';
import { getDatabase } from '../database/client';
import * as schema from '../database/schema';
import { eq, sql, and } from 'drizzle-orm';

export function registerPartnersIPC() {
  ipcMain.handle('partners:list', async () => {
    const db = getDatabase();

    const partnerList = db
      .select()
      .from(schema.entities)
      .where(eq(schema.entities.type, 'partner'))
      .all();

    const result = partnerList.map((partner) => {
      const balanceRes = db
        .select({
          totalDraws: sql<number>`COALESCE(SUM(${schema.journalItems.debit}), 0)`,     // Para Çekme (Borç)
          totalDeposits: sql<number>`COALESCE(SUM(${schema.journalItems.credit}), 0)`, // Para Yatırma (Alacak)
        })
        .from(schema.journalItems)
        .innerJoin(schema.journalEntries, eq(schema.journalItems.journalEntryId, schema.journalEntries.id))
        .where(
          and(
            eq(schema.journalItems.entityId, partner.id),
            eq(schema.journalEntries.status, 'active')
          )
        )
        .get();

      const totalDraws = balanceRes?.totalDraws || 0;
      const totalDeposits = balanceRes?.totalDeposits || 0;
      const balance = totalDeposits - totalDraws; // Positive = Partner is creditor to company

      return {
        ...partner,
        totalDraws,
        totalDeposits,
        balance,
      };
    });

    return result;
  });

  ipcMain.handle('partners:getStatement', async (_, partnerId: string) => {
    const db = getDatabase();

    const partner = db
      .select()
      .from(schema.entities)
      .where(eq(schema.entities.id, partnerId))
      .get();

    if (!partner) throw new Error('Ortak kaydı bulunamadı.');

    const movements = db
      .select({
        id: schema.journalItems.id,
        date: schema.journalEntries.date,
        docNumber: schema.documents.docNumber,
        docType: schema.documents.type,
        description: schema.journalItems.description,
        drawAmount: schema.journalItems.debit,    // Çekilen
        depositAmount: schema.journalItems.credit, // Yatırılan
      })
      .from(schema.journalItems)
      .innerJoin(schema.journalEntries, eq(schema.journalItems.journalEntryId, schema.journalEntries.id))
      .leftJoin(schema.documents, eq(schema.journalEntries.documentId, schema.documents.id))
      .where(
        and(
          eq(schema.journalItems.entityId, partnerId),
          eq(schema.journalEntries.status, 'active')
        )
      )
      .orderBy(schema.journalEntries.date, schema.journalEntries.createdAt)
      .all();

    let runningBalance = 0;
    const itemsWithBalance = movements.map((item) => {
      runningBalance += item.depositAmount - item.drawAmount;
      return {
        ...item,
        runningBalance,
      };
    });

    return {
      partner,
      movements: itemsWithBalance,
      currentBalance: runningBalance,
    };
  });
}
