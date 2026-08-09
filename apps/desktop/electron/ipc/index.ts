import { registerTransactionsIPC } from './transactions.ipc';
import { registerCustomersIPC } from './customers.ipc';
import { registerSuppliersIPC } from './suppliers.ipc';
import { registerCashIPC } from './cash.ipc';
import { registerBanksIPC } from './banks.ipc';
import { registerPartnersIPC } from './partners.ipc';
import { registerAccountsIPC } from './accounts.ipc';
import { registerReportsIPC } from './reports.ipc';
import { registerBackupIPC } from './backup.ipc';
import { registerAuthIPC } from './auth.ipc';
import { registerInventoryIPC } from './inventory.ipc';

export function registerAllIPCHandlers() {
  registerTransactionsIPC();
  registerCustomersIPC();
  registerSuppliersIPC();
  registerCashIPC();
  registerBanksIPC();
  registerPartnersIPC();
  registerAccountsIPC();
  registerReportsIPC();
  registerBackupIPC();
  registerAuthIPC();
  registerInventoryIPC();
}
