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
      trash: 2,
    }

    window.addEventListener('resize', (e) => this.handleBrowserResize(e))

    this.minimiseAll = this.minimiseAll.bind(this)
    this.restoreAll = this.restoreAll.bind(this)
  }

  init() {
    this.loadMenus()
    this.loadIcons()
    this.removeBee()
  }

  addBee() {
    document.body.classList.add('busy-bee')
  }

  removeBee() {
    document.body.classList.remove('busy-bee')
  }

  loadMenus() {
    this.menuBar.addMenu({
      title: 'Messy Cloud',
      items: [
        { label: 'About', action: this.about },
        {
          label: 'Issues',
          link: 'https://github.com/underscoredotspace/messy.cloud/issues',
        },
      ],
    })
    this.menuBar.addMenu({
      title: 'File',
      items: [{ label: 'Not yet', action: this.test }],
    })
    this.menuBar.addMenu({
      title: 'Edit',
      items: [{ label: 'Not yet', action: this.test }],
    })
    this.menuBar.addMenu({
      title: 'View',
      items: [
        { label: 'Minimise All', action: this.minimiseAll },
        { label: 'Restore All', action: this.restoreAll },
      ],
    })
    this.menuBar.addMenu({
      title: 'Options',
      items: [{ label: 'Not yet', action: this.test }],
    })
  }

  loadIcons() {
    this.desktop.addIcon({
      title: 'emojis.htm',
      type: this.icon.file,
      window: {
        page: 'https://emoji.messy.cloud',
        title: '[CAB] Emojis',
        w: 362,
        h: 306,
        fixedSize: true,
      },
    })
    this.desktop.addIcon({
      title: 'scrsaver.app',
      type: this.icon.app,
      window: {
        page: 'https://screensaver.messy.cloud',
        title: 'Mac Plus Screensaver',
        w: 320,
        h: 300,
      },
    })
    this.desktop.addIcon({
      title: 'winter.app',
      type: this.icon.app,
      window: {
        page: 'https://winter.messy.cloud',
        title: 'Winter Scene',
        w: 415,
        h: 500,
      },
    })
    this.desktop.addIcon({
      title: 'match.app',
      type: this.icon.app,
      window: {
        page: 'https://match.messy.cloud',
        title: 'Awesome Match',
        w: 360,
        h: 420,
        fixedSize: true,
      },
    })
    this.desktop.addIcon({
      title: 'todo.app',
      type: this.icon.app,
      window: {
        page: 'https://todo.messy.cloud',
        title: 'To-Do',
        w: 550,
        h: 300,
      },
    })
    this.desktop.addIcon({
      title: 'tictac~1.app',
      type: this.icon.app,
      window: {
        page: 'https://noughts.messy.cloud',
        title: 'Tic Tac Toe',
        w: 320,
        h: 480,
      },
    })
    this.desktop.addIcon({
      title: 'shutopia.app',
      type: this.icon.app,
      window: {
        page: 'https://strim.messy.cloud',
        title: 'Shutopia',
        w: 490,
        h: 1000,
      },
    })
    this.desktop.addIcon({
      title: 'webtris.exe',
      type: this.icon.app,
      window: {
        page: 'https://webtris.messy.cloud/',
        title: 'Webtris',
        w: 770,
        h: 1000,
      },
    })
    this.desktop.addIcon({
      title: 'llamas.app',
      type: this.icon.app,
      window: {
        page: 'https://llamas.messy.cloud/',
        title: 'Llamatron',
        w: 665,
        h: 455,
        fixedSize: true,
      },
    })
    this.desktop.addIcon({
      title: 'TRASH',
      type: this.icon.trash,
      window: {
        page: 'https://underscore.space',
        title: '[CAB] underscore .  space',
        w: 490,
        h: 1000,
      },
    })
  }

  test() {
    console.log('menu test')
  }

  about() {
    os.openDialog({
      title: 'Messy Cloud v0.6',
      text: `Welcome! This is the portfolio of Colin Tindle, in the style of Atari's graphical OS. 
      
      Please double click on each of the icons to load a section. A window will open - you can move, resize, minimise and maximise these windows to your heart's content. `,
      buttons: {},
    })
  }

  restoreAll() {
    this.windows.forEach((win) => this.setFocus(win.id))
  }

  minimiseAll() {
    this.windows.forEach((win) => this.minimiseWindow(win.id))
  }

  handleBrowserResize(e) {
    for (let win of this.windows) {
      if (win.minimised) {
        continue
      }

      const { w, h, x, y } = win.pos()
      this.moveWindow(win.id, x, y)
      this.resizeWindow(win.id, w, h)
    }
  }

  getWindow(id) {
    return this.windows.find((win) => win.id === id)
  }

  alreadyOpen(page) {
    return !!this.windows.find((win) => win.page === page)
  }

  async openWindow(win, icon) {
    if (this.alreadyOpen(win.page)) {
      this.openDialog({ title: 'Error', text: 'Window is already open!' })
      return
    }

    this.addBee()
    const { Window } = await import('../window/window')
    const newWindow = new Window(this, win)
    const desktop = this.desktop.pos()
    newWindow.icon = icon

    this.windows.push(newWindow)
    this.desktop.addWindow(newWindow)
    this.taskBar.addWindow(newWindow, win.title)

    this.resizeWindow(newWindow.id, win.w, win.h)

    if (!win.hasOwnProperty('x')) {
      win.x = (desktop.r - desktop.x) / 2 - win.w / 2
    }
    if (!win.hasOwnProperty('y')) {
      win.y = (desktop.b - desktop.y) / 2 - win.h / 2
    }

    this.moveWindow(newWindow.id, win.x + desktop.x, win.y + desktop.y)
    newWindow.translate(icon, win)
    this.setFocus(newWindow.id)
  }

  openDialog(dialog) {
    this.desktop.addDialog(dialog)
  }

  resizeWindow(id, w, h) {
    const win = this.getWindow(id)
    const { x, y } = win.pos()
    const desktop = this.desktop.pos()
    if (w + x > desktop.r) {
      w = desktop.r - x
    }
    if (h + y > desktop.b) {
      h = desktop.b - y
    }
    if (w < MIN_WINDOW_W) {
      w = MIN_WINDOW_W
    }
    if (h < MIN_WINDOW_H) {
      h = MIN_WINDOW_H
    }
    win.resize(w, h)
  }

  moveWindow(id, x, y) {
    const win = this.getWindow(id)
    const { w, h } = win.pos()
    const desktop = this.desktop.pos()

    if (x < desktop.x) {
      x = desktop.x
    }
    if (y < desktop.y) {
      y = desktop.y
    }
    if (x + w > desktop.r) {
      x = desktop.r - w
      if (x < desktop.x) {
        x = desktop.x
      }
    }
    if (y + h > desktop.b) {
      y = desktop.b - h
      if (y < desktop.y) {
        y = desktop.y
      }
    }

    win.move(x, y)
  }

  closeWindow(id) {
    this.getWindow(id).close()
    this.taskBar.removeWindow(id)
    this.windows = this.windows.filter((window) => window.id !== id)
  }

  setFocus(id) {
    const thisWin = this.getWindow(id)
    if (thisWin.focused) {
      return
    }
    const startIndex = thisWin.zIndex

    for (let win of this.windows) {
      if (win.zIndex > startIndex) {
        win.setIndex(win.zIndex - 1)
      }
      if (win.id !== id) {
        win.unFocus()
      }
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
    this.getWindow(id).focused ? this.minimiseWindow(id) : this.setFocus(id)
  }

  minimiseWindow(id) {
    const win = this.getWindow(id)
    const winPos = win.pos()
    const translateX =
      this.taskBar.minimiseWindow(id) - (winPos.x + winPos.w / 2)
    const translateY = this.desktop.pos().b - winPos.y
    win.minimise(translateX, translateY)
  }

  maximiseWindow(id) {
    const win = this.getWindow(id)
    const { x, y, w, h } = this.desktop.pos()
    win.move(x, y)
    win.resize(w, h)
  }
}
