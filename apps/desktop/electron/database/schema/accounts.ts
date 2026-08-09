import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(), // e.g. "100", "100.001", "120.001", "600.001"
  name: text('name').notNull(),         // e.g. "Merkez Kasa", "ABC Mobilya"
  type: text('type', {
    enum: ['asset', 'liability', 'equity', 'revenue', 'expense']
  }).notNull(),
  parentCode: text('parent_code'),     // e.g. "100" for "100.001"
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  createdAt: text('created_at').notNull(),
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
