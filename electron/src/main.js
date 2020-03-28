const { app, BrowserWindow } = require("electron");
require("electron-reload");
const isDev = require("electron-is-dev");

function createWindow() {
  // Cree la fenetre du navigateur.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  if (isDev) {
    win.loadURL("http://localhost:3000");
  } else {
    win.loadFile("../react/public/index.html");
  }
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
