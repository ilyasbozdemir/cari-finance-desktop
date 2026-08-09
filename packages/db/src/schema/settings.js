import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const settings = sqliteTable('settings', {
    id: text('id').primaryKey(),
    companyName: text('company_name').default('ABC Mobilya İmalat A.Ş.').notNull(),
    taxNumber: text('tax_number'),
    address: text('address'),
    phone: text('phone'),
    pinCode: text('pin_code'),
    autoBackupEnabled: integer('auto_backup_enabled', { mode: 'boolean' }).default(true).notNull(),
    backupIntervalDays: integer('backup_interval_days').default(7).notNull(),
    lastBackupAt: text('last_backup_at'),
    updatedAt: text('updated_at').notNull(),
});
