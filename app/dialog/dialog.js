import {DIALOG} from '../templates'

export default class Dialog {
  constructor({title, text, buttons}, os) {
    this.os = os
    this.dialog = DIALOG.cloneNode(true)
    console.log(this.dialog)

    this.dialog.querySelector('.dialog__title').innerText = title
    this.dialog.querySelector('.dialog__text').innerText = text

    this.button = this.dialog.querySelector('.dialog__button.default')
    this.button.addEventListener('click', e => this.clickButton())
  }

  clickButton(id) {

    this.close()
  }

  close() {
    this.dialog.remove()
  }
}

class Button {
  constructor({text, action, isDefault = false}, os) {
    this.os = os
    this.text = text
    this.action = action
    this.isDefault = isDefault
    this.button = document.createElement('button')
  }


}