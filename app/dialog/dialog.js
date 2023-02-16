import { DIALOG } from '../templates'
import './dialog.scss'

export class Dialog {
  constructor({ title, text, link, buttons }, os) {
    this.os = os
    this.dialog = DIALOG.cloneNode(true)

    this.dialog.querySelector('.dialog__title').textContent = title
    this.dialog.querySelector('.dialog__text').textContent = text

    this.button = this.dialog.querySelector('.dialog__button.default')
    this.button.addEventListener('click', (e) => this.clickButton())
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.clickButton()
      }
    })
  }

  clickButton(id) {
    this.close()
  }

  close() {
    this.dialog.remove()
  }
}

class Button {
  constructor({ text, action, isDefault = false }, os) {
    this.os = os
    this.text = text
    this.action = action
    this.isDefault = isDefault
    this.button = document.createElement('button')
  }
}
