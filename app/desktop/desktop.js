import Icon from '../icon/icon'

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