import type { Icon } from '../icon/icon'
import type OS from '../os/os'
import type { Window } from '../window/window'
import type { Dialog } from '../dialog/dialog'
import './desktop.scss'

export default class Desktop {
  private os
  private icons: Array<Icon> = []
  private desktop: HTMLElement = document.getElementById('desktop')!

  constructor(os: OS) {
    this.os = os

    this.desktop.addEventListener('click', (e: MouseEvent) =>
      os.ifNotBusy(() => this.deselectAllIcons(e))
    )
  }

  get pos() {
    const { top, right, bottom, left, width, height } =
      this.desktop.getBoundingClientRect()
    return { y: top, r: right, b: bottom, x: left, w: width, h: height }
  }

  addWindow(win: Window) {
    this.desktop.appendChild(win.window)
  }

  async addDialog(dialog: Dialog) {
    const { Dialog } = await import('../dialog/dialog')
    // @ts-ignore
    this.desktop.appendChild(new Dialog(dialog).dialog)
  }

  async addIcon(icon: Icon) {
    const { Icon } = await import('../icon/icon')
    // @ts-ignore
    const newIcon = new Icon(this.os, icon)
    this.icons.push(newIcon)
    this.desktop.appendChild(newIcon.icon)
  }

  deselectAllIcons(e: MouseEvent) {
    if (e?.target === this.desktop) {
      this.icons.forEach((icon) => icon.deselect())
    }
  }
}
