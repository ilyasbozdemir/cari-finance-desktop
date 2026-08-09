import { contextBridge, ipcRenderer } from 'electron';

const api = {
  transactions: {
    create: (payload: any) => ipcRenderer.invoke('transactions:create', payload),
    list: (options?: any) => ipcRenderer.invoke('transactions:list', options),
    cancel: (entryId: string) => ipcRenderer.invoke('transactions:cancel', entryId),
  },
  customers: {
    list: () => ipcRenderer.invoke('customers:list'),
    getStatement: (customerId: string) => ipcRenderer.invoke('customers:getStatement', customerId),
    create: (payload: any) => ipcRenderer.invoke('customers:create', payload),
  },
  suppliers: {
    list: () => ipcRenderer.invoke('suppliers:list'),
    getStatement: (supplierId: string) => ipcRenderer.invoke('suppliers:getStatement', supplierId),
    create: (payload: any) => ipcRenderer.invoke('suppliers:create', payload),
  },
  cash: {
    list: () => ipcRenderer.invoke('cash:list'),
    getMovements: (cashId: string) => ipcRenderer.invoke('cash:getMovements', cashId),
    create: (name: string) => ipcRenderer.invoke('cash:create', name),
  },
  banks: {
    list: () => ipcRenderer.invoke('banks:list'),
    getMovements: (bankId: string) => ipcRenderer.invoke('banks:getMovements', bankId),
    create: (payload: any) => ipcRenderer.invoke('banks:create', payload),
  },
  partners: {
    list: () => ipcRenderer.invoke('partners:list'),
    getStatement: (partnerId: string) => ipcRenderer.invoke('partners:getStatement', partnerId),
  },
  accounts: {
    list: () => ipcRenderer.invoke('accounts:list'),
    getJournalEntries: () => ipcRenderer.invoke('accounts:getJournalEntries'),
  },
  reports: {
    getDashboard: () => ipcRenderer.invoke('reports:getDashboard'),
    getTrialBalance: (options?: { type?: 'gecici' | 'kesin' }) => ipcRenderer.invoke('reports:getTrialBalance', options),
    getKebir: () => ipcRenderer.invoke('reports:getKebir'),
    getMuavin: (options?: { entityId?: string }) => ipcRenderer.invoke('reports:getMuavin', options),
  },
  inventory: {
    list: () => ipcRenderer.invoke('inventory:list'),
    create: (payload: any) => ipcRenderer.invoke('inventory:create', payload),
    updateStock: (payload: any) => ipcRenderer.invoke('inventory:updateStock', payload),
    getMovements: (productId: string) => ipcRenderer.invoke('inventory:getMovements', productId),
  },
  backup: {
    export: () => ipcRenderer.invoke('backup:export'),
    import: () => ipcRenderer.invoke('backup:import'),
  },
  auth: {
    getSettings: () => ipcRenderer.invoke('settings:get'),
    updateSettings: (payload: any) => ipcRenderer.invoke('settings:update', payload),
    verifyPin: (pin: string) => ipcRenderer.invoke('auth:verifyPin', pin),
  },
};

contextBridge.exposeInMainWorld('api', api);

export type ElectronAPI = typeof api;
