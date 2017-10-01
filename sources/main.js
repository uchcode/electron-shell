const {app, Menu, MenuItem, dialog, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

let winW = 0, winH = 0
let windows = []
let pathsForReady = []

function setEnabledMenuItems(enabled=true) {
    Menu.getApplicationMenu().items.filter(e=>e.label=='View')[0].submenu.items.forEach(i=>i.enabled=enabled)
}

function makeHtmlWindow(filePath) {
    for (let w of windows) {
        let p = decodeURI(w.webContents.getURL().replace(/^file:\/\//,''))
        if (p.startsWith(filePath+'/')) return w.show()
        if (p == filePath) return w.show()
    }
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
        case '.htmld':
            var entryPoint = filePath + '/index.html'
            break
        case '.html':
            var entryPoint = filePath
            break
    }
    win.loadURL(url.format({pathname:entryPoint,protocol:'file:',slashes:true}))
}

app.on('ready', () => {
    let menu = Menu.buildFromTemplate(require('./menu'))
    menu.items.filter(e=>e.label=='Window')[0].submenu.insert(0, new MenuItem({
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click() {
            let paths = dialog.showOpenDialog({
                filters: [
                    {name:'Electron Choco HTML',extensions:['html']},
                    {name:'Electron Choco HTML bundle',extensions:['htmld']},
                ],
            })
            if (paths) {
                paths.forEach(p=>makeHtmlWindow(p))
            }
        },
    }))
    Menu.setApplicationMenu(menu)
    if (!pathsForReady.length) return setEnabledMenuItems(false)
    pathsForReady.forEach(p=>makeHtmlWindow(p))
})

app.on('open-file', (event, filePath) => {
    event.preventDefault()
    try {
        makeHtmlWindow(filePath)
    } catch(e) {
        pathsForReady.push(filePath)
    }
})
