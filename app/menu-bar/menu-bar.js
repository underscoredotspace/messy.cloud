import './menu-bar.scss'
import { v4 as uuid } from 'uuid'
import { MENU, MENU_ITEMS, MENU_ITEM } from '../templates'

export default class MenuBar {
  constructor(os) {
    this.os = os
    this.menus = []
    this.menubar = document.getElementById('menu-bar')
  }

  getMenu(id) {
    return this.menus.find((menu) => menu.id === id)
  }

  menuPos(id) {
    const { top, right, bottom, left, width, height } =
      this.getMenu(id).menu.getBoundingClientRect()
    return { y: top, r: right, b: bottom, x: left, w: width, h: height }
  }

  addMenu({ title, items }) {
    const id = uuid()
    const newMenu = MENU.cloneNode(true)
    newMenu.textContent = title
    newMenu.addEventListener('click', (e) => this.showMenu(id))
    this.menubar.appendChild(newMenu)
    this.menus.push({ id, menu: newMenu, items })
  }

  showMenu(id) {
    document.querySelectorAll('.menu__cover').forEach((menu) => menu.remove())
    const menu = this.getMenu(id)
    menu.menu.classList.add('selected')

    const menuWrapper = MENU_ITEMS.cloneNode(true)
    const menuItems = menuWrapper.querySelector('.menu__items')

    document.addEventListener('click', (e) => {
      if (e.target === menu.menu) {
        return
      }
      menuItems.style.opacity = 0
      setTimeout(() => {
        menu.menu.classList.remove('selected')
        menuWrapper.remove()
      }, 200)
    })
    menuItems.style.left = `${this.menuPos(id).x}px`

    for (let item of menu.items) {
      if (item.link) {
        const menuLink = document.createElement('a')
        menuLink.className = 'menu__item'
        menuLink.textContent = item.label
        menuLink.href = item.link
        menuLink.target = '_blank'
        menuItems.appendChild(menuLink)
      } else {
        const menuItem = MENU_ITEM.cloneNode(true)
        menuItem.textContent = item.label
        menuItem.addEventListener('click', item.action)
        menuItems.appendChild(menuItem)
      }
    }
    this.menubar.appendChild(menuWrapper)
    setTimeout(() => {
      menuItems.style.opacity = 1
    }, 10)
  }
}
