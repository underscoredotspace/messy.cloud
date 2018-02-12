export default class Desktop {
  constructor(os) {
    this.os = os
    this.desktop = document.getElementById('desktop')
  }

  pos() {
    const {top, right, bottom, left, width, height} = this.desktop.getBoundingClientRect()
    return {y:top, r:right, b:bottom, x:left, w:width, h:height}
  }

  addWindow(win) {
    this.desktop.appendChild(win.window)
  }
}