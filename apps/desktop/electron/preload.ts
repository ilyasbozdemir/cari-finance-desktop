import { contextBridge, ipcRenderer } from 'electron';

const api = {
  transactions: {
    create: (payload: any) => ipcRenderer.invoke('transactions:create', payload),
    list: (options?: any) => ipcRenderer.invoke('transactions:list', options),
    cancel: (entryId: string) => ipcRenderer.invoke('transactions:cancel', entryId),
  },
  customers: {
    list: (options?: any) => ipcRenderer.invoke('customers:list', options),
    getStatement: (customerId: string, options?: any) => ipcRenderer.invoke('customers:getStatement', customerId, options),
    create: (payload: any) => ipcRenderer.invoke('customers:create', payload),
  },
  suppliers: {
    list: (options?: any) => ipcRenderer.invoke('suppliers:list', options),
    getStatement: (supplierId: string, options?: any) => ipcRenderer.invoke('suppliers:getStatement', supplierId, options),
    create: (payload: any) => ipcRenderer.invoke('suppliers:create', payload),
  },
  cash: {
    list: (options?: any) => ipcRenderer.invoke('cash:list', options),
    getMovements: (cashId: string, options?: any) => ipcRenderer.invoke('cash:getMovements', cashId, options),
    create: (name: string) => ipcRenderer.invoke('cash:create', name),
  },
  banks: {
    list: (options?: any) => ipcRenderer.invoke('banks:list', options),
    getMovements: (bankId: string, options?: any) => ipcRenderer.invoke('banks:getMovements', bankId, options),
    create: (payload: any) => ipcRenderer.invoke('banks:create', payload),
  },
  partners: {
    list: (options?: any) => ipcRenderer.invoke('partners:list', options),
    getStatement: (partnerId: string, options?: any) => ipcRenderer.invoke('partners:getStatement', partnerId, options),
  },
  accounts: {
    list: () => ipcRenderer.invoke('accounts:list'),
    getJournalEntries: (options?: any) => ipcRenderer.invoke('accounts:getJournalEntries', options),
  },
  reports: {
    getDashboard: (options?: { fiscalYear?: number | 'all' }) => ipcRenderer.invoke('reports:getDashboard', options),
    getTrialBalance: (options?: { type?: 'gecici' | 'kesin'; fiscalYear?: number | 'all' }) => ipcRenderer.invoke('reports:getTrialBalance', options),
    getKebir: (options?: { fiscalYear?: number | 'all' }) => ipcRenderer.invoke('reports:getKebir', options),
    getMuavin: (options?: { entityId?: string; fiscalYear?: number | 'all' }) => ipcRenderer.invoke('reports:getMuavin', options),
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
