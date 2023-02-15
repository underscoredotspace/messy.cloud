import './icon.scss'
import APP_ICON from './icons/app.png'
import FILE_ICON from './icons/file.png'
import TRASH_ICON from './icons/trash.png'

const ICONS = [APP_ICON, FILE_ICON, TRASH_ICON]
import { ICON } from '../templates'

export class Icon {
  constructor(os, { title, type, window }) {
    this.os = os
    this.icon = ICON.cloneNode(true)

    this.title = this.icon.querySelector('.icon__title')
    this.image = this.icon.querySelector('.icon__image')

    this.title.textContent = title
    this.image.style.backgroundImage = `url(${ICONS[type]})`
    this.icon.addEventListener('dblclick', (e) => this.load(window, e))
    this.icon.addEventListener('click', (e) => this.select(e))
  }

  pos() {
    const { top, right, bottom, left, width, height } =
      this.icon.getBoundingClientRect()
    return { y: top, r: right, b: bottom, x: left, w: width, h: height }
  }

  load(win, e) {
    e.preventDefault()
    window.getSelection().removeAllRanges()
    const icon = this.pos()
    const x = icon.x + icon.w / 2
    const y = icon.y + icon.h / 2

    this.os.openWindow(win, { x, y })
  }

  select() {
    if (this.selected) {
      this.deselect()
      return
    }

    this.os.desktop.deselectAllIcons()
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
