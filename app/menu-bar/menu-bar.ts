import './menu-bar.scss'
import { generateId } from '../generateId'
import type OS from '../os/os'

interface MenuItemAction {
  label: string
  action: () => void
}

interface MenuItemLink {
  label: string
  link: string
}

type MenuItem = MenuItemAction | MenuItemLink

const isMenuItemLink = (menuItem: MenuItem): menuItem is MenuItemLink =>
  menuItem.hasOwnProperty('link')

interface Menu {
  id: string
  menu: HTMLElement
  items: Array<MenuItem>
}

export default class MenuBar {
  private os: OS
  private menus: Array<Menu> = []
  private menubar: HTMLElement = document.getElementById('menu-bar')!

  constructor(os: OS) {
    this.os = os
  }

  getMenu(id: string) {
    return this.menus.find((menu) => menu.id === id)!
  }

  menuPos(id: string) {
    const { top, right, bottom, left, width, height } =
      this.getMenu(id).menu.getBoundingClientRect()
    return { y: top, r: right, b: bottom, x: left, w: width, h: height }
  }

  async addMenu(title: string, items: Array<MenuItem>) {
    const id = generateId()
    const MENU = <HTMLTemplateElement>document.getElementById('messy-menu')!
    const newMenu = MENU.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement
    newMenu.textContent = title
    newMenu.addEventListener('click', () =>
      this.os.ifNotBusy(() => this.showMenu(id))
    )
    this.menubar.appendChild(newMenu)
    this.menus.push({ id, menu: newMenu, items })
  }

  showMenu(id: string) {
    document.querySelectorAll('.menu__cover').forEach((menu) => menu.remove())
    const menu = this.getMenu(id)
    menu.menu.classList.add('selected')

    const MENU_ITEMS = <HTMLTemplateElement>(
      document.getElementById('messy-menu-items')!
    )
    const menuWrapper = MENU_ITEMS.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement
    const menuItems = menuWrapper.querySelector('.menu__items')! as HTMLElement

    document.addEventListener('click', (e) => {
      if (e.target === menu.menu) {
        return
      }
      menuItems.style.opacity = '0'
      setTimeout(() => {
        menu.menu.classList.remove('selected')
        menuWrapper.remove()
      }, 200)
    })
    menuItems.style.left = `${this.menuPos(id).x}px`

    for (let item of menu.items) {
      if (isMenuItemLink(item)) {
        const menuLink = document.createElement('a')
        menuLink.className = 'menu__item'
        menuLink.textContent = item.label
        menuLink.href = item.link
        menuLink.target = '_blank'
        menuItems.appendChild(menuLink)
      } else {
        const MENU_ITEM = <HTMLTemplateElement>(
          document.getElementById('messy-menu-item')!
        )
        const menuItem = MENU_ITEM.content.firstElementChild!.cloneNode(
          true
        )! as HTMLElement
        menuItem.textContent = item.label
        menuItem.addEventListener('click', item.action)
        menuItems.appendChild(menuItem)
      }
    }
    this.menubar.appendChild(menuWrapper)
    setTimeout(() => {
      menuItems.style.opacity = '1'
    }, 10)
  }
}
