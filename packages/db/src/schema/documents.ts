import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  docNumber: text('doc_number').notNull().unique(),
  type: text('type', {
    enum: [
      'sale',
      'customer_payment',
      'purchase',
      'supplier_payment',
      'partner_draw',
      'partner_deposit',
      'transfer',
      'expense'
    ]
  }).notNull(),
  date: text('date').notNull(),
  description: text('description'),
  totalAmount: real('total_amount').notNull(),
  createdAt: text('created_at').notNull(),
});

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
