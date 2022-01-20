/* eslint-disable */
import { EventEmitter } from "events";
import { BrowserWindow, app, Tray, Menu } from "electron";
const DEV_SERVER_URL = process.env.DEV_SERVER_URL;
const isProduction = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";
let tray = null;
export default class BrowserWinHandler {
  /**
   * @param [options] {object} - browser window options
   * @param [allowRecreate] {boolean}
   */
  constructor(options, allowRecreate = true) {
    this._eventEmitter = new EventEmitter();
    this.allowRecreate = allowRecreate;
    this.options = options;
    this.browserWindow = null;
    this._createInstance();
  }

  _createInstance() {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    if (app.isReady()) this._create();
    else {
      app.once("ready", () => {
        this._create();
      });
    }

    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (!this.allowRecreate) return;
    app.on("activate", () => this._recreate());
  }

  _create() {
    this.browserWindow = new BrowserWindow({
      ...this.options,
      minWidth: 200,
      // maxWidth: 200,
      // maxHeight: 380,
      minHeight: 380,
      icon: __dirname + "/icon.png",
      // titleBarStyle:'hidden',
      frame: false,
      webPreferences: {
        ...this.options.webPreferences,
        webSecurity: isProduction, // disable on dev to allow loading local resources
        nodeIntegration: true, // allow loading modules via the require () function
        contextIsolation: false, // https://github.com/electron/electron/issues/18037#issuecomment-806320028
        enableRemoteModule: true
      }
    });
    this.browserWindow.on("closed", e => {
      // const choice = require('dialog').showMessageBox(
      //   this.mainWindow,
      //   {
      //     type: 'question',
      //     buttons: ['Yes', 'No, hang on', 'third option'],
      //     title: 'Confirm your actions',
      //     message: 'Do you really want to close the application?'
      //   }
      // );
      // console.log('CHOICE: ', choice);
      // if (choice > 0) e.preventDefault();
      // Dereference the window object
      this.browserWindow = null;
      // this.browserWindow.setSkipTaskbar(true)
    });
    this.browserWindow.on("minimize", () => {
      // Dereference the window object
      // this.browserWindow.setSkipTaskbar(false)
    });
    this.browserWindow.on("restore", () => {
      // Dereference the window object
      // this.browserWindow.setSkipTaskbar(false)
    });
    app.whenReady().then(() => {
      tray = new Tray(__dirname + "/icon.png");
      const contextMenu = Menu.buildFromTemplate([
        {
          label: "Quitter",
          type: "normal",
          click: () => {
            this.browserWindow.close();
          }
        }
      ]);
      tray.addListener("click", e => {
        this.browserWindow.focus();
      });
      tray.setToolTip("TimeKeeper");
      tray.setContextMenu(contextMenu);
    });

    this.browserWindow.setAlwaysOnTop(true);
    this.browserWindow.removeMenu();

    this._eventEmitter.emit("created");
  }

  _addTrayIcon(browserWindow) {
    //add tray icon
  }

  _recreate() {
    if (this.browserWindow === null) this._create();
  }

  /**
   * @callback onReadyCallback
   * @param {BrowserWindow}
   */

  /**
   *
   * @param callback {onReadyCallback}
   */
  onCreated(callback) {
    if (this.browserWindow !== null) return callback(this.browserWindow);
    this._eventEmitter.once("created", () => {
      callback(this.browserWindow);
    });
  }

  async loadPage(pagePath) {
    if (!this.browserWindow)
      return Promise.reject(
        new Error("The page could not be loaded before win 'created' event")
      );
    const serverUrl = isDev ? DEV_SERVER_URL : "app://./index.html";
    const fullPath = serverUrl + "#" + pagePath;
    await this.browserWindow.loadURL(fullPath);
  }

  /**
   *
   * @returns {Promise<BrowserWindow>}
   */
  created() {
    return new Promise(resolve => {
      this.onCreated(() => resolve(this.browserWindow));
    });
  }
}
