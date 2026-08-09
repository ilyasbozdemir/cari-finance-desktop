import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const entities = sqliteTable('entities', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type', {
    enum: ['customer', 'supplier', 'bank', 'cash', 'partner']
  }).notNull(),
  accountId: text('account_id').notNull(), // Link to 120.xxx, 320.xxx, 102.xxx, 100.xxx, 500.xxx
  phone: text('phone'),
  taxNumber: text('tax_number'),
  address: text('address'),
  notes: text('notes'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  createdAt: text('created_at').notNull(),
});

export type Entity = typeof entities.$inferSelect;
export type NewEntity = typeof entities.$inferInsert;
