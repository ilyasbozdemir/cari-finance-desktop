import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const journalEntries = sqliteTable('journal_entries', {
  id: text('id').primaryKey(),
  entryNumber: text('entry_number').notNull().unique(), // Fiş No e.g. YEV-2026-00001
  documentId: text('document_id'),
  date: text('date').notNull(),
  description: text('description').notNull(),
  status: text('status', { enum: ['active', 'cancelled'] }).default('active').notNull(),
  createdAt: text('created_at').notNull(),
});

export const journalItems = sqliteTable('journal_items', {
  id: text('id').primaryKey(),
  journalEntryId: text('journal_entry_id').notNull().references(() => journalEntries.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  entityId: text('entity_id'), // Optional link to specific customer/supplier/bank/cash/partner entity
  debit: real('debit').default(0).notNull(),   // Borç tutarı
  credit: real('credit').default(0).notNull(), // Alacak tutarı
  description: text('description'),
});

export type JournalEntry = typeof journalEntries.$inferSelect;
export type NewJournalEntry = typeof journalEntries.$inferInsert;

export type JournalItem = typeof journalItems.$inferSelect;
export type NewJournalItem = typeof journalItems.$inferInsert;
