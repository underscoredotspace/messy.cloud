import type OS from '../os/os'
import type { WindowDef } from '../window/window'
import './icon.scss'
import APP_ICON from './icons/app.png'
import FILE_ICON from './icons/file.png'
import TRASH_ICON from './icons/trash.png'

export enum ICONS {
  APP_ICON,
  FILE_ICON,
  TRASH_ICON,
}

const iconMap = {
  [ICONS.APP_ICON]: APP_ICON,
  [ICONS.FILE_ICON]: FILE_ICON,
  [ICONS.TRASH_ICON]: TRASH_ICON,
}

export interface IconPos {
  x: number
  y: number
}

export class Icon {
  private os: OS
  public icon: HTMLElement
  private title: HTMLElement
  private image: HTMLImageElement
  private selected: boolean = false

  constructor(os: OS, title: string, type: ICONS, window: WindowDef) {
    this.os = os

    const ICON = <HTMLTemplateElement>document.getElementById('messy-icon')!
    this.icon = ICON.content.firstElementChild!.cloneNode(true) as HTMLElement

    this.title = this.icon.querySelector('.icon__title')!
    this.image = this.icon.querySelector('.icon__image')!

    this.title.textContent = title
    this.image.style.backgroundImage = `url(${iconMap[type]})`
    this.icon.addEventListener('dblclick', (e) =>
      os.ifNotBusy(() => this.load(window, e))
    )
    this.icon.addEventListener('click', (e) =>
      os.ifNotBusy(() => this.select(e))
    )

    if (type == ICONS.TRASH_ICON) {
      this.icon.classList.add('trash')
    }
  }

  pos() {
    const { top, right, bottom, left, width, height } =
      this.icon.getBoundingClientRect()
    return { y: top, r: right, b: bottom, x: left, w: width, h: height }
  }

  load(win: WindowDef, e: MouseEvent) {
    e.preventDefault()
    window.getSelection()!.removeAllRanges()
    const icon = this.pos()
    const x = icon.x + icon.w / 2
    const y = icon.y + icon.h / 2

    this.os.openWindow(win, { x, y })
  }

  select(e: MouseEvent) {
    if (this.selected) {
      this.deselect()
      return
    }

    this.os.desktop.deselectAllIcons(e)
    this.selected = true
    this.icon.classList.add('selected')
    this.icon.style.setProperty('--text-color', 'var(--atari-white)')
    this.icon.style.setProperty('--icon-title', 'black')
  }

  deselect() {
    this.selected = false
    this.icon.classList.remove('selected')
    this.icon.style.setProperty('--text-color', 'black')
    this.icon.style.setProperty('--icon-title', 'var(--atari-white)')
  }
}
