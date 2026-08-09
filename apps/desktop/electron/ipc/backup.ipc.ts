import { ipcMain, dialog } from 'electron';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { getDatabase, closeDatabase } from '../database/client';
import * as schema from '../database/schema';
import { eq } from 'drizzle-orm';

export function registerBackupIPC() {
  // Trigger immediate database backup to user-selected location (.cari extension)
  ipcMain.handle('backup:export', async () => {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'cari_finance.db');

    if (!fs.existsSync(dbPath)) {
      throw new Error('Veritabanı dosyası bulunamadı.');
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const defaultName = `abc_mobilya_${todayStr}.cari`;

    const { filePath } = await dialog.showSaveDialog({
      title: 'Cari Finance Şirket Dosyasını (.cari) Kaydet',
      defaultPath: defaultName,
      filters: [
        { name: 'Cari Finance Şirket Dosyası (*.cari)', extensions: ['cari'] },
        { name: 'SQLite Veritabanı (*.db)', extensions: ['db', 'sqlite'] },
      ],
    });

    if (!filePath) {
      return { success: false, cancelled: true };
    }

    fs.copyFileSync(dbPath, filePath);

    // Update settings lastBackupAt
    const db = getDatabase();
    db.update(schema.settings)
      .set({ lastBackupAt: new Date().toISOString() })
      .where(eq(schema.settings.id, 'app_settings'))
      .run();

    return { success: true, filePath };
  });

  // Restore database from user-selected file (.cari or .db)
  ipcMain.handle('backup:import', async () => {
    const { filePaths } = await dialog.showOpenDialog({
      title: 'Cari Finance Şirket Dosyası (.cari) Aç',
      properties: ['openFile'],
      filters: [
        { name: 'Cari Finance Şirket Dosyası (*.cari, *.db)', extensions: ['cari', 'db', 'sqlite'] },
      ],
    });

    if (!filePaths || filePaths.length === 0) {
      return { success: false, cancelled: true };
    }

    const selectedFile = filePaths[0];
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'cari_finance.db');

    // Close database connection before overwrite
    closeDatabase();

    // Backup current before overwriting just in case
    const tempBackup = dbPath + '.bak';
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, tempBackup);
    }

    try {
      fs.copyFileSync(selectedFile, dbPath);
      // Re-initialize database
      getDatabase();
      return { success: true };
    } catch (err) {
      // Revert if failed
      if (fs.existsSync(tempBackup)) {
        fs.copyFileSync(tempBackup, dbPath);
      }
      getDatabase();
      throw new Error('Şirket dosyası (.cari) geri yüklenirken hata oluştu: ' + (err as Error).message);
    }
  });
}
