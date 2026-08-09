import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

export const journalEntries = sqliteTable('journal_entries', {
  id: text('id').primaryKey(),
  entryNumber: text('entry_number').notNull().unique(),
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
  entityId: text('entity_id'),
  debit: real('debit').default(0).notNull(),
  credit: real('credit').default(0).notNull(),
  description: text('description'),
});

export type JournalEntry = typeof journalEntries.$inferSelect;
export type NewJournalEntry = typeof journalEntries.$inferInsert;

export type JournalItem = typeof journalItems.$inferSelect;
export type NewJournalItem = typeof journalItems.$inferInsert;
