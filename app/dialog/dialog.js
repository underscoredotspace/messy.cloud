import './dialog.scss'
const DIALOG = document.getElementById('messy-dialog')

export class Dialog {
  constructor({ title, text }, os) {
    this.os = os

    this.dialog = DIALOG.content.firstElementChild.cloneNode(true)

    this.dialog.querySelector('.dialog__title').textContent = title
    this.dialog.querySelector('.dialog__text').textContent = text

    this.button = this.dialog.querySelector('.dialog__button.default')
    this.button.addEventListener('click', () => this.close())
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.close()
      }
    })
  }

  close() {
    this.dialog.remove()
  }
}
