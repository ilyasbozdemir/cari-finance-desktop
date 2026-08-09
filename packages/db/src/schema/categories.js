import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const categories = sqliteTable('categories', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type', { enum: ['income', 'expense'] }).notNull(),
    accountId: text('account_id').notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
});
