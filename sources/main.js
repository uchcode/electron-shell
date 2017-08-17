const {app, Menu, MenuItem, dialog, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

let winW = 0, winH = 0
let windows = []
let pathForReady = undefined

function setEnabledMenuItems(enabled=true) {
    let items = Menu.getApplicationMenu().commandsMap['27'].submenu.items
    for (let i of items) {
        i.enabled = enabled
    }
}

function makeHtmlWindow(filePath) {
    let win = new BrowserWindow({
        width:winW, height:winH,
        webPreferences: {
            preload: path.join(__dirname,'preload.js'),
        },
    })
    windows.push(win)
    setEnabledMenuItems(true)
    win.on('closed', (event) => {
        windows = windows.filter(e=>e!==event.sender)
        if (!windows.length) setEnabledMenuItems(false)
    })
    win.webContents.on('did-finish-load', (event) => {
        win.webContents.executeJavaScript(`
            if (window.outerWidth == ${winW} && window.outerHeight == ${winH}) {
                window.show()
            }
        `)
    })
    switch (path.extname(filePath)) {
        case '.electronhtmld':
            var entryPoint = filePath + '/index.html'
            break
        case '.electronhtml':
            var entryPoint = filePath
            break
    }
    win.loadURL(url.format({pathname:entryPoint,protocol:'file:',slashes:true}))
    // win.webContents.openDevTools()
}

app.on('ready', () => {
    let menu = Menu.buildFromTemplate(require('./menu'))
    menu.commandsMap['33'].submenu.insert(0, new MenuItem({
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click() {
            let files = dialog.showOpenDialog({
                filters: [
                    {name:'Electron Choco HTML',extensions:['electronhtml']},
                    {name:'Electron Choco HTML bundle',extensions:['electronhtmld']},
                ],
            })
            if (files) {
                for (let f of files) makeHtmlWindow(f)
            }
        },
    }))
    Menu.setApplicationMenu(menu)
    if (!pathForReady) return setEnabledMenuItems(false)
    makeHtmlWindow(pathForReady)
})

app.on('open-file', (event, filePath) => {
    event.preventDefault()
    try {
        for (let w of windows) {
            let p = decodeURI(w.webContents.getURL().replace(/^file:\/\//,''))
            if (p.startsWith(filePath+'/')) return w.show()
            if (p == filePath) return w.show()
        }
        makeHtmlWindow(filePath)
    } catch(e) {
        pathForReady = filePath
    }
})
