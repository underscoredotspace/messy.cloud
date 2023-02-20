import MenuBar from '../menu-bar/menu-bar'
import Desktop from '../desktop/desktop'
import TaskBar from '../task-bar/task-bar'
import type { IconPos } from '../icon/icon'
import type { Window as MessyWindow, WindowDef } from '../window/window'

const MIN_WINDOW_W = 240
const MIN_WINDOW_H = 200

export default class OS {
  public windows: Array<MessyWindow> = []
  private menuBar = new MenuBar(this)
  public desktop = new Desktop(this)
  private taskBar = new TaskBar(this)

  constructor() {
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

  ifNotBusy(callback = () => {}) {
    const busy = document.body.classList.contains('busy-bee')
    if (!busy) {
      callback()
    }
  }

  loadMenus() {
    this.menuBar.addMenu('Messy Cloud', [
      { label: 'About', action: this.about.bind(this) },
      {
        label: 'Issues',
        link: 'https://github.com/underscoredotspace/messy.cloud/issues',
      },
    ])
    this.menuBar.addMenu('File', [{ label: 'Not yet', action: this.test }])
    this.menuBar.addMenu('Edit', [{ label: 'Not yet', action: this.test }])
    this.menuBar.addMenu('View', [
      { label: 'Minimise All', action: this.minimiseAll },
      { label: 'Restore All', action: this.restoreAll },
    ])
    this.menuBar.addMenu('Options', [{ label: 'Not yet', action: this.test }])
  }

  async loadIcons() {
    const { ICONS } = await import('../icon/icon')
    this.desktop.addIcon('emojis.htm', ICONS.FILE_ICON, {
      page: 'https://emoji.messy.cloud',
      titleText: '[CAB] Emojis',
      w: 362,
      h: 306,
      fixedSize: true,
    })
    this.desktop.addIcon('scrsaver.app', ICONS.APP_ICON, {
      page: 'https://screensaver.messy.cloud',
      titleText: 'Mac Plus Screensaver',
      w: 320,
      h: 300,
    })
    this.desktop.addIcon('winter.app', ICONS.APP_ICON, {
      page: 'https://winter.messy.cloud',
      titleText: 'Winter Scene',
      w: 415,
      h: 500,
    })
    this.desktop.addIcon('match.app', ICONS.APP_ICON, {
      page: 'https://match.messy.cloud',
      titleText: 'Awesome Match',
      w: 360,
      h: 420,
      fixedSize: true,
    })
    this.desktop.addIcon('todo.app', ICONS.APP_ICON, {
      page: 'https://todo.messy.cloud',
      titleText: 'To-Do',
      w: 550,
      h: 300,
    })
    this.desktop.addIcon('tictac~1.app', ICONS.APP_ICON, {
      page: 'https://noughts.messy.cloud',
      titleText: 'Tic Tac Toe',
      w: 320,
      h: 480,
    })
    this.desktop.addIcon('webtris.exe', ICONS.APP_ICON, {
      page: 'https://webtris.messy.cloud/',
      titleText: 'Webtris',
      w: 770,
      h: 1000,
    })
    this.desktop.addIcon('llamas.app', ICONS.APP_ICON, {
      page: 'https://llamas.messy.cloud/',
      titleText: 'Llamatron',
      w: 665,
      h: 455,
      fixedSize: true,
    })
    this.desktop.addIcon('TRASH', ICONS.TRASH_ICON, {
      page: 'https://underscore.space',
      titleText: '[CAB] underscore .  space',
      w: 490,
      h: 1000,
    })
  }

  test() {
    console.log('menu test')
  }

  about() {
    this.openDialog(
      'Messy Cloud v1.0',
      `Welcome! This is the portfolio of Colin Tindle, in the style of Atari's graphical OS. \n\nPlease double click on each of the icons to load a section. A window will open - you can move, resize, minimise and maximise these windows to your heart's content. `
    )
  }

  restoreAll() {
    this.windows
      .sort((a, b) => a.zIndex - b.zIndex)
      .forEach((win) => this.setFocus(win.id))
  }

  minimiseAll() {
    this.windows.forEach((win) => this.minimiseWindow(win.id))
  }

  handleBrowserResize(e: UIEvent) {
    if ((e.target as Window)?.innerWidth === 0) {
      return
    }

    for (let win of this.windows) {
      if (win.minimised) {
        continue
      }

      if (win.maximised) {
        this.maximiseWindow(win.id)
        continue
      }

      const { w, h, x, y } = win.pos()
      this.moveWindow(win.id, x, y)
      this.resizeWindow(win.id, w, h)
    }
  }

  getWindow(id: string): MessyWindow {
    return this.windows.find((win) => win.id === id)!
  }

  alreadyOpen(page: string) {
    return !!this.windows.find((win) => win.page === page)
  }

  async openWindow(win: WindowDef, iconPos: IconPos) {
    if (this.alreadyOpen(win.page)) {
      this.openDialog('Error', 'Window is already open!')
      return
    }

    this.addBee()
    const { Window } = await import('../window/window')
    const newWindow = new Window(this, win.page, win.titleText, win.fixedSize)
    const desktop = this.desktop.pos

    this.windows.push(newWindow)
    this.desktop.addWindow(newWindow)
    this.taskBar.addWindow(newWindow, win.titleText)

    this.resizeWindow(newWindow.id, win.w, win.h)

    if (!win.hasOwnProperty('x')) {
      win.x = (desktop.r - desktop.x) / 2 - win.w / 2
    }
    if (!win.hasOwnProperty('y')) {
      win.y = (desktop.b - desktop.y) / 2 - win.h / 2
    }

    this.moveWindow(newWindow.id, win.x! + desktop.x, win.y! + desktop.y)
    newWindow.translate(iconPos, win)
    this.setFocus(newWindow.id)
  }

  openDialog(title: string, text: string) {
    this.desktop.addDialog(title, text)
  }

  resizeWindow(id: string, w: number, h: number) {
    const win = this.getWindow(id)
    const { x, y } = win.pos()
    const desktop = this.desktop.pos
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

  moveWindow(id: string, x: number, y: number) {
    const win = this.getWindow(id)
    const { w, h } = win.pos()
    const desktop = this.desktop.pos

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

  closeWindow(id: string) {
    this.getWindow(id).close()
    this.taskBar.removeWindow(id)
    this.windows = this.windows.filter((window) => window.id !== id)
    this.focusNextwindow()
  }

  focusNextwindow() {
    const visibleWindows = this.windows.filter((window) => !window.minimised)

    const nextWindow = visibleWindows.sort((a, b) => a.zIndex - b.zIndex)[
      visibleWindows.length - 1
    ]

    if (nextWindow) {
      this.setFocus(nextWindow.id)
    }
  }

  setFocus(id: string) {
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

  selectTask(id: string) {
    // If window is already active it should be minimised instead
    this.getWindow(id).focused ? this.minimiseWindow(id) : this.setFocus(id)
  }

  minimiseWindow(id: string) {
    const win = this.getWindow(id)
    const winPos = win.pos()
    const translateX =
      this.taskBar.minimiseWindow(id) - (winPos.x + winPos.w / 2)
    const translateY = this.desktop.pos.b - winPos.y
    win.minimise(translateX, translateY)

    this.focusNextwindow()
  }

  maximiseWindow(id: string) {
    const win = this.getWindow(id)
    const { x, y, w, h } = this.desktop.pos
    win.move(x, y)
    win.resize(w, h)
  }
}
