const api = require('./api');
const auth = require('./auth');
const sendMessages = require('./sendMessages');
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  addFile: () => {
    (async () => {
      const results = await sendMessages();
      console.log('Результаты отправки сообщений:', results);
    })();}
  });

  window.Electron.addFile();