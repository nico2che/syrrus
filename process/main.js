const { app, BrowserWindow } = require("electron");
const windowStateKeeper = require("electron-window-state");
const isDev = require("electron-is-dev");
let win;

if (isDev) {
  require("electron-reload");
}

function createWindow() {
  // Cree la fenetre du navigateur.
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
  });

  win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindowState.manage(win);

  // and load the index.html of the app.
  if (isDev) {
    win.loadURL("http://localhost:3000");
  } else {
    win.loadFile("build/index.html");
  }

  if (isDev) {
    win.webContents.openDevTools();
  }

  require("./events");
}

app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS, create window if there is no one
  if (win === null) {
    createWindow();
  }
});
