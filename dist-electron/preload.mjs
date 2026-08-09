"use strict";
const electron = require("electron");
const api = {
  transactions: {
    create: (payload) => electron.ipcRenderer.invoke("transactions:create", payload),
    list: (options) => electron.ipcRenderer.invoke("transactions:list", options),
    cancel: (entryId) => electron.ipcRenderer.invoke("transactions:cancel", entryId)
  },
  customers: {
    list: () => electron.ipcRenderer.invoke("customers:list"),
    getStatement: (customerId) => electron.ipcRenderer.invoke("customers:getStatement", customerId),
    create: (payload) => electron.ipcRenderer.invoke("customers:create", payload)
  },
  suppliers: {
    list: () => electron.ipcRenderer.invoke("suppliers:list"),
    getStatement: (supplierId) => electron.ipcRenderer.invoke("suppliers:getStatement", supplierId),
    create: (payload) => electron.ipcRenderer.invoke("suppliers:create", payload)
  },
  cash: {
    list: () => electron.ipcRenderer.invoke("cash:list"),
    getMovements: (cashId) => electron.ipcRenderer.invoke("cash:getMovements", cashId),
    create: (name) => electron.ipcRenderer.invoke("cash:create", name)
  },
  banks: {
    list: () => electron.ipcRenderer.invoke("banks:list"),
    getMovements: (bankId) => electron.ipcRenderer.invoke("banks:getMovements", bankId),
    create: (payload) => electron.ipcRenderer.invoke("banks:create", payload)
  },
  partners: {
    list: () => electron.ipcRenderer.invoke("partners:list"),
    getStatement: (partnerId) => electron.ipcRenderer.invoke("partners:getStatement", partnerId)
  },
  accounts: {
    list: () => electron.ipcRenderer.invoke("accounts:list")
  },
  reports: {
    getDashboard: () => electron.ipcRenderer.invoke("reports:getDashboard"),
    getTrialBalance: () => electron.ipcRenderer.invoke("reports:getTrialBalance")
  },
  backup: {
    export: () => electron.ipcRenderer.invoke("backup:export"),
    import: () => electron.ipcRenderer.invoke("backup:import")
  },
  auth: {
    getSettings: () => electron.ipcRenderer.invoke("settings:get"),
    updateSettings: (payload) => electron.ipcRenderer.invoke("settings:update", payload),
    verifyPin: (pin) => electron.ipcRenderer.invoke("auth:verifyPin", pin)
  }
};
electron.contextBridge.exposeInMainWorld("api", api);
