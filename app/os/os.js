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

  addIcon(icon) {
    this.desktop.addIcon(icon)
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