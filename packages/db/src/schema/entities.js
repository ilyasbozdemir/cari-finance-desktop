import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const entities = sqliteTable('entities', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type', {
        enum: ['customer', 'supplier', 'bank', 'cash', 'partner']
    }).notNull(),
    accountId: text('account_id').notNull(),
    phone: text('phone'),
    taxNumber: text('tax_number'),
    address: text('address'),
    notes: text('notes'),
    isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
    createdAt: text('created_at').notNull(),
});
