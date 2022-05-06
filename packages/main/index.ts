import { app, BrowserWindow, shell , session} from 'electron'
import installExtension, {VUEJS3_DEVTOOLS, VUEJS_DEVTOOLS} from 'electron-devtools-installer'
import { release } from 'os'
import { join } from 'path'
import {bot} from './bot'
import {log} from "wechaty";
import Store from 'electron-store'


// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null

async function createWindow() {
  win = new BrowserWindow({
    title: 'wego',
    width:1600,
    height:1200,
    minWidth:800,
    minHeight:600,
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs')
    },
  })

  if (app.isPackaged || process.env["DEBUG"]) {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`

    win.loadURL(url)
    win.webContents.openDevTools()
  }

  // Test active push message to Renderer-process
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
    bot.start()
        .then(() => {
          return log.info('StarterBot', 'Starter Bot Started.')
        })
        .catch(console.error)
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(createWindow)
app.whenReady().then(async ()=>{
  await session.defaultSession.loadExtension('D:/6.0.0.21_0')
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

export {
  win, app
}