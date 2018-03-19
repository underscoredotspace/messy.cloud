import Window from '../window/window'
import MenuBar from '../menu-bar/menu-bar'
import Desktop from '../desktop/desktop'
import TaskBar from '../task-bar/task-bar'

const MIN_WINDOW_W = 240
const MIN_WINDOW_H = 200

export default class OS {
  constructor() {
    this.windows = []
    this.menuBar = new MenuBar(this)
    this.desktop = new Desktop(this)
    this.taskBar = new TaskBar(this)

    this.icon = {
      app: 0,
      file: 1,
      trash: 2
    }

    window.addEventListener('resize', e => this.handleBrowserResize(e))
  }

  init() {
    this.loadMenus()
    this.loadIcons()
    this.removeBee()
  }

  addBee() {
    document.body.classList.add('busy-bee')
    const buttons = document.querySelectorAll('button')
    buttons.forEach(button => button.disabled = true)
  }

  removeBee() {
    document.body.classList.remove('busy-bee')
    const buttons = document.querySelectorAll('button')
    buttons.forEach(button => button.disabled = false)
  }

  loadMenus() {
    this.menuBar.addMenu({title: 'MessyCloud', items: [
      {label: 'item1', action: this.test},
      {label: 'item2', action: this.test},
      {label: 'item3', action: this.test},
      {label: 'item4', action: this.test}
    ]})
    this.menuBar.addMenu({title: 'File', items: [
      {label: 'item1', action: this.test}
    ]})
    this.menuBar.addMenu({title: 'Edit', items: [
      {label: 'item1', action: this.test}
    ]})
    this.menuBar.addMenu({title: 'View', items: [
      {label: 'item1', action: this.test}
    ]})
    this.menuBar.addMenu({title: 'Options', items: [
      {label: 'item1', action: this.test}
    ]})
  }
  
  loadIcons() {
    this.desktop.addIcon({title:'emojis.htm', type:this.icon.file, window: {
      page:'https://emoji.messy.cloud', title:'[CAB] Emojis', w:386, h:330
    }})
    this.desktop.addIcon({title:'scrsaver.app', type:this.icon.app, window: {
      page:'https://screensaver.messy.cloud', title:'Mac Plus Screensaver', w:320, h:300
    }})
    this.desktop.addIcon({title:'winter.app', type:this.icon.app, window: {
      page: 'https://winter.messy.cloud', title: 'Winter Scene', w:415, h:500
    }})
    this.desktop.addIcon({title:'frogger.app', type:this.icon.app, window: {
      page: 'https://underscoredotspace.github.io/frogger/', title: 'Frogger', w:448, h:271
    }})
    this.desktop.addIcon({title:'router.htm', type:this.icon.file, window: {
      page:'https://router.messy.cloud', title:'[CAB] neeko-router Demo', w:320, h:200
    }})
    this.desktop.addIcon({title:'TRASH', type:this.icon.trash, window: {
      page:'https://underscore.space', title:'[CAB] underscore .  space', w:490, h:1000
    }})
  }

  test() {
    console.log('menu test')
  }

  handleBrowserResize(e) {
    for (let win of this.windows) {
      if (win.minimised) { continue }

      const {w, h, x, y} = win.pos()
      this.moveWindow(win.id, x, y)
      this.resizeWindow(win.id, w, h)
    }
  }

  getWindow(id) {
    return this.windows.find(win => win.id === id)
  }

  alreadyOpen(page) {
    return this.windows.filter(win => win.page === page).length > 0
  }

  openWindow(win, icon) {
    if(this.alreadyOpen(win.page)) {
      this.openDialog({title:'Error', text:'Window is already open!'})
      return
    }
    
    this.addBee()
    const newWindow = new Window(this, win)
    const desktop = this.desktop.pos()
    newWindow.icon = icon

    this.windows.push(newWindow)
    this.desktop.addWindow(newWindow)
    this.taskBar.addWindow(newWindow, win.title)
    
    this.resizeWindow(newWindow.id, win.w, win.h)
    
    if (!win.hasOwnProperty('x')) {win.x = ((desktop.r-desktop.x) / 2) - (win.w / 2)}
    if (!win.hasOwnProperty('y')) {win.y = ((desktop.b-desktop.y) / 2) - (win.h / 2)}
    this.moveWindow(newWindow.id, win.x+desktop.x, win.y+desktop.y)
    newWindow.translate(icon, {x:win.x, y:win.y, h:win.h, w:win.w})
    this.setFocus(newWindow.id)
  }

  openDialog(dialog) {
    this.desktop.addDialog(dialog)
  }

  resizeWindow(id, w, h) {
    const win = this.getWindow(id)
    const {x,y} = win.pos()
    const desktop = this.desktop.pos()
    if (w + x > desktop.r) {w = desktop.r - x}
    if (h + y > desktop.b) {h = desktop.b - y}
    if (w < MIN_WINDOW_W) {w = MIN_WINDOW_W}
    if (h < MIN_WINDOW_H) {h = MIN_WINDOW_H}
    win.resize(w, h)
  }

  moveWindow(id, x, y) {
    const win = this.getWindow(id)
    const {w,h} = win.pos()
    const desktop = this.desktop.pos()

    if (x < desktop.x) {x = desktop.x}
    if (y < desktop.y) {y = desktop.y}
    if (x + w > desktop.r) {
      x = desktop.r - w
      if (x < desktop.x) {x = desktop.x}
    }
    if (y + h > desktop.b) {
      y = desktop.b - h
      if (y < desktop.y) {y = desktop.y}
    }

    win.move(x, y)
  }

  closeWindow(id) {
    this.getWindow(id).close()
    this.taskBar.removeWindow(id)
    this.windows = this.windows.filter(window => window.id !== id)
  }

  setFocus(id) {
    const thisWin = this.getWindow(id)
    if (thisWin.focused) {return}
    const startIndex = thisWin.zIndex

    for(let win of this.windows) {
      if (win.zIndex > startIndex) {win.setIndex(win.zIndex-1)}
      if (win.id !== id) {win.unFocus()}
    }

    if (!thisWin.hasOwnProperty('zIndex')) {
      thisWin.setIndex(this.windows.length)
    } else {
      thisWin.setIndex(this.windows.length + 1)
    }
    thisWin.setFocus()

    this.taskBar.setActive(id)
  }

  selectTask(id) {
    // If window is already active it should be minimised instead
    if (this.getWindow(id).focused) {
      this.minimiseWindow(id)
    } else {
      this.setFocus(id)
    }
  }

  minimiseWindow(id) {
    const win = this.getWindow(id)
    const winPos = win.pos()
    const translateX = this.taskBar.minimiseWindow(id) - (winPos.x + (winPos.w/2))
    const translateY = this.desktop.pos().b - winPos.y
    win.minimise(translateX, translateY)
  }

  maximiseWindow(id) {
    const win = this.getWindow(id)
    const {x, y, w, h} = this.desktop.pos()
    win.move(x, y)
    win.resize(w, h)
  }
}