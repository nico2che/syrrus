const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
let win;

if (isDev) {
  require("electron-reload");
}

function createWindow() {
  // Cree la fenetre du navigateur.
  win = new BrowserWindow({
    width: 1440,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  if (isDev) {
    win.loadURL("http://localhost:3000");
  } else {
    win.loadFile("../build/index.html");
  }

  win.webContents.openDevTools();

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
