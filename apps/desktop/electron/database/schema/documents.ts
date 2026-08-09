import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  docNumber: text('doc_number').notNull().unique(), // e.g. SAT-2026-00001
  type: text('type', {
    enum: [
      'sale',               // Satış Belgesi
      'customer_payment',    // Tahsilat Belgesi
      'purchase',           // Satınalma Belgesi
      'supplier_payment',    // Ödeme Belgesi
      'partner_draw',       // Ortak Para Çekme
      'partner_deposit',    // Ortak Para Yatırma
      'transfer',           // Virman / Transfer (Kasa-Banka)
      'expense'             // Gider Belgesi
    ]
  }).notNull(),
  date: text('date').notNull(), // ISO YYYY-MM-DD
  description: text('description'),
  totalAmount: real('total_amount').notNull(),
  createdAt: text('created_at').notNull(),
});

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
