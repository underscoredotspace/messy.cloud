import {v4 as uuid} from 'uuid'

import APP_ICON from './icons/app.png'
import FILE_ICON from './icons/file.png'

const ICONS = [APP_ICON, FILE_ICON]
const ICON_TEMPLATE = document.getElementById('icon-template').querySelector('.icon')

class Icon {
  constructor(os, {title, type, window}) {
    this.os = os
    this.icon = ICON_TEMPLATE.cloneNode(true)
    this.id = uuid()

    this.title = this.icon.querySelector('.icon__title')
    this.image = this.icon.querySelector('.icon__image')

    this.title.innerText = title
    this.image.style.backgroundImage = `url(${ICONS[type]})`
    this.icon.addEventListener('dblclick', () => this.load(window))
    this.icon.addEventListener('click', e => this.select(e))
  }

  load(window) {
    this.os.openWindow(window, this.id)
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

export default class Desktop {
  constructor(os) {
    this.os = os
    this.icons = []

    this.desktop = document.getElementById('desktop')

    this.desktop.addEventListener('click', e => this.deselectAllIcons(e))
  }

  pos() {
    const {top, right, bottom, left, width, height} = this.desktop.getBoundingClientRect()
    return {y:top, r:right, b:bottom, x:left, w:width, h:height}
  }

  addWindow(win) {
    this.desktop.appendChild(win.window)
  }

  addIcon(icon) {
    const newIcon = new Icon(this.os, icon)
    this.icons.push(newIcon)
    this.desktop.appendChild(newIcon.icon)
  }

  deselectAllIcons(e) {
    if (e && e.target.id !== 'desktop') {return}
    this.icons.forEach(icon => icon.deselect())
  }
}