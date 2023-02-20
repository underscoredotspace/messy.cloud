import './menu-bar.scss'
import { generateId } from '../generateId'

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

  async addMenu({ title, items }) {
    const id = generateId()
    const MENU = document.getElementById('messy-menu')
    const newMenu = MENU.content.firstElementChild.cloneNode(true)
    newMenu.textContent = title
    newMenu.addEventListener('click', () =>
      this.os.ifNotBusy(() => this.showMenu(id))
    )
    this.menubar.appendChild(newMenu)
    this.menus.push({ id, menu: newMenu, items })
  }

  showMenu(id) {
    document.querySelectorAll('.menu__cover').forEach((menu) => menu.remove())
    const menu = this.getMenu(id)
    menu.menu.classList.add('selected')

    const MENU_ITEMS = document.getElementById('messy-menu-items')
    const menuWrapper = MENU_ITEMS.content.firstElementChild.cloneNode(true)
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
        const MENU_ITEM = document.getElementById('messy-menu-item')
        const menuItem = MENU_ITEM.content.firstElementChild.cloneNode(true)
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
