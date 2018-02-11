import Window from './window'
import MenuBar from './menu-bar'
import Desktop from './desktop'
import TaskBar from './task-bar'

const MIN_WINDOW_W = 240
const MIN_WINDOW_H = 200

export default class os {
  constructor() {
    this.windows = []
    this.menuBar = new MenuBar(this)
    this.desktop = new Desktop(this)
    this.taskBar = new TaskBar(this)
  }

  getWindow(id) {
    return this.windows.filter(win => win.id === id)[0]
  }

  openWindow(win) {
    const newWindow = new Window(win, this)
    const desktop = this.desktop.pos()
    this.windows.push(newWindow)
    this.desktop.addWindow(newWindow)
    this.taskBar.addWindow(newWindow, win.title)

    this.resizeWindow(newWindow.id, win.w, win.h)

    if (!win.hasOwnProperty('x')) {win.x = ((desktop.r-desktop.x) / 2) - (win.w / 2)}
    if (!win.hasOwnProperty('y')) {win.y = ((desktop.b-desktop.y) / 2) - (win.h / 2)}
    this.moveWindow(newWindow.id, win.x+desktop.x, win.y+desktop.y)
  }

  resizeWindow(id, w, h) {
    const win = this.getWindow(id)
    const {x,y} = win.pos()
    const desktop = this.desktop.pos()
    if (w < MIN_WINDOW_W) {w = MIN_WINDOW_W}
    if (h < MIN_WINDOW_H) {h = MIN_WINDOW_H}
    if (w + x > desktop.r) {w = desktop.r - x}
    if (h + y > desktop.b) {h = desktop.b - y}

    win.resize(w, h)
  }

  moveWindow(id, x, y) {
    const win = this.getWindow(id)
    const {w,h} = win.pos()
    const desktop = this.desktop.pos()

    if (x < desktop.x) {x = desktop.x}
    if (y < desktop.y) {y = desktop.y}
    if (x + w > desktop.r) {x = desktop.r - w}
    if (y + h > desktop.b) {y = desktop.b - h}

    win.move(x, y)
  }

  closeWindow(id) {
    this.taskBar.removeWindow(id)
    this.getWindow(id).close()
    this.windows = this.windows.filter(window => window.id !== id)
    
    // activate another window
    if (this.windows.length !== 0) {
      this.setFocus(this.windows[this.windows.length-1].id)
    }
  }

  setFocus(id) {
    for (let window of this.windows) {
      if (window.id === id) {
        window.setFocus()
      } else {
        window.unFocus()
      }
    }
    this.taskBar.setActive(id)
  }

  minimiseWindow(id) {
    this.taskBar.minimiseWindow(id)
    this.getWindow(id).minimise()
  }

  maximiseWindow(id) {
    const win = this.getWindow(id)
    const {x, y, w, h} = this.desktop.pos()
    win.move(x, y)
    win.resize(w, h)
  }
}