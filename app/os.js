import Window from './window'
import Taskbar from './task-bar'

export default class os {
  constructor() {
    this.windows = []
    this.taskBar = new Taskbar(this)
  }

  getWindow(id) {
    return this.windows.filter(win => win.id === id)[0]
  }

  openWindow(win) {
    const newWindow = new Window(win, this)
    this.taskBar.addWindow(newWindow, win.title)
  }

  closeWindow(id) {
    this.taskBar.removeWindow(id)
    this.getWindow(id).close()
    this.windows = this.windows.filter(win => win.id !== id)
  }

  minimiseWindow(id) {
    this.taskBar.minimiseWindow(id)
    this.getWindow(id).minimise()
  }

  taskClick(id, e) {
    this.taskBar.setActive(id)
    this.getWindow(id).takeFocus()
  }
}