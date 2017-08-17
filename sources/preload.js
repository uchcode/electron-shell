function _win_show(w=500,h=400) {
    window.moveTo((screen.width-w)/2, (screen.height-h)/2-100)
    window.resizeTo(w, h)
}

window.show = (w=500,h=400) => {
    _win_show(w,h)
}

window.state = (identifier) => {
    if (!identifier || typeof identifier != 'string') {
        throw new Error(`window.state: Invalid argument`)
    }
    try {
        let s = JSON.parse(localStorage.getItem(identifier))
        window.moveTo(s.x, s.y)
        window.resizeTo(s.w, s.h)
    } catch(e) {
        _win_show()
    }
    window.addEventListener('beforeunload',()=>{
        localStorage.setItem(identifier, JSON.stringify({
            x:window.screenX, y:window.screenY,
            w:window.outerWidth, h:window.outerHeight,
        }))
    })
}

document.log = (text) => {
    let code = document.createElement('code')
    code.setAttribute('style','display:block;white-space:pre-wrap;')
    code.textContent = text
    document.body.appendChild(code)
    document.body.scrollTop = document.body.scrollHeight
    return code
}
