import { ipcMain } from 'electron';
import { getDatabase } from '../database/client';
import * as schema from '../database/schema';
import { eq } from 'drizzle-orm';

export function registerAuthIPC() {
  // Get App Settings
  ipcMain.handle('settings:get', async () => {
    const db = getDatabase();
    const currentSettings = db.select().from(schema.settings).where(eq(schema.settings.id, 'app_settings')).get();
    return currentSettings || null;
  });

  // Save Settings
  ipcMain.handle('settings:update', async (_, payload: Partial<typeof schema.settings.$inferInsert>) => {
    const db = getDatabase();
    const now = new Date().toISOString();

    db.update(schema.settings)
      .set({
        ...payload,
        updatedAt: now,
      })
      .where(eq(schema.settings.id, 'app_settings'))
      .run();

    return { success: true };
  });

  // Verify PIN Code
  ipcMain.handle('auth:verifyPin', async (_, pin: string) => {
    const db = getDatabase();
    const currentSettings = db.select().from(schema.settings).where(eq(schema.settings.id, 'app_settings')).get();

    if (!currentSettings?.pinCode) {
      return { success: true }; // No PIN set
    }

    if (currentSettings.pinCode === pin) {
      return { success: true };
    }

    return { success: false, message: 'Hatalı PIN Kodu.' };
  });
}
