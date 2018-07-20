function elementFromString(elementString) {
  const element = document.createElement('div')
  element.innerHTML = elementString
  return element.firstChild
}

export const MENU = elementFromString`<button class="menu__title"></button>`

export const MENU_ITEMS = elementFromString`<div class="menu__cover">
  <div class="menu__items"></div>
</div>`

export const MENU_ITEM = elementFromString`<button class="menu__item"></button>`

export const WINDOW = elementFromString`<div class="window">
  <button class="window__button close"><i class="fas fa-times"></i></button>
  <div class="window__title"></div>
  <button class="window__button min"><i class="fas fa-window-minimize"></i></button>
  <button class="window__button max"><i class="fas fa-expand-arrows-alt"></i></button>

  <div class="window__content">
    <iframe class="window__content__iframe" src="about:blank" scrolling="yes"></iframe>
    <div class="window__content__loading">Loading...</div>
    <div class="window__content__cover"></div>
  </div>
  <button class="window__button size">
    <svg viewBox="0 0 10 10">
      <line x1="0" y1="100%" x2="100%" y2="0" stroke="black" />
    </svg>
  </button>
</div>`

export const DIALOG = elementFromString`<div class="dialog__cover">
<div class="dialog__frame">
  <div class="dialog">
    <h1 class="dialog__title"></h1>
    <div class="dialog__text"></div>
    <div class="dialog__buttons">
      <button class="dialog__button default">Ok</button>
    </div>
  </div>
</div>
</div>`

export const ICON = elementFromString`<div class="icon">
  <div class="icon__image"></div>
  <div class="icon__title"></div>
</div>`
