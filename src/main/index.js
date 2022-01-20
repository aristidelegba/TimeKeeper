import { app, powerSaveBlocker,powerMonitor,BrowserWindow  } from 'electron'


  
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()

 
  powerMonitor.on("lock-screen", () => {
    powerSaveBlocker.start("prevent-display-sleep");
  });
  powerMonitor.on("suspend", () => {
    powerSaveBlocker.start("prevent-app-suspension");
  });
})

// Load here all startup windows
require('./mainWindow')
