import {v4 as uuid} from 'uuid'
import {MENU} from '../templates'

export default class MenuBar {
  constructor(os) {
    this.os = os
    this.menus = []
    this.menubar = document.getElementById('menu-bar')
  }

  getMenu(id) {
    return this.menus.find(menu => menu.id === id)
  }

  addMenu({title, items}) {
    const id = uuid()
    const newMenu = MENU.cloneNode(true)
    newMenu.innerText = title
    newMenu.addEventListener('click', e => this.showMenu(id))
    this.menubar.appendChild(newMenu)
    this.menus.push({id, menu:newMenu, items})
  }

  showMenu(id) {
    const menu = this.getMenu(id)
    //show invisible element behind with click event to close menu
    //create item wrapper
    //position item wrapper
    //create children with click events
    for (let item of menu.items) {

    }
  }
}