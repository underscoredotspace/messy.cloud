import Window from './window'
import Taskbar from './task-bar'

export default class os {
  constructor() {
    this.windows = []
    this.taskBar = new Taskbar(this)
  }

  openWindow(win) {
    const newWindow = new Window(win, this)
    this.taskBar.addWindow(newWindow, win.title)
  }

  minimise(id) {
    this.taskBar.minimiseWindow(id)
  }

  taskClick(id, e) {
    this.taskBar.setActive(id)

    for (let win of this.windows) {
      const window = document.getElementById(`window-${win.id}`)
      if (win.id === id) {
        win.takeFocus()
        return
      }
    }
  }
}