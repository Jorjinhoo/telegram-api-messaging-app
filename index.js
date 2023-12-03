const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');


app.on('ready', () => {
  let win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload:[path.join(__dirname, 'src/backend/core.js')],
      nodeIntegration: true
    }
  })
  win.webContents.openDevTools();
  win.setMenuBarVisibility(false);
  win.setTitle('Rassylka');
  win.loadFile('index.html');
});

app.on('window-all-closed', () => app.quit());


