function elementFromString(elementString) {
  const element = document.createElement('div')
  element.innerHTML = elementString
  return element.firstChild
}

export const WINDOW = elementFromString`<div class="window">
  <div class="window__button close"><i class="fas fa-times"></i></div>
  <div class="window__title"></div>
  <div class="window__button min"><i class="fas fa-window-minimize"></i></div>
  <div class="window__button max"><i class="fas fa-expand-arrows-alt"></i></div>

  <div class="window__content">
    <div class="window__content__loading">Loading...</div>
    <iframe class="window__content__iframe" src="about:blank" scrolling="no"></iframe>
    <div class="window__content__cover"></div>
  </div>
  <div class="window__button scroll up"><i class="fas fa-arrow-up"></i></div>
  <div class="window__scroll-bar vert"></div>
  <div class="window__button scroll down"><i class="fas fa-arrow-down"></i></div>

  <div class="window__button scroll left"><i class="fas fa-arrow-left"></i></div>  
  <div class="window__scroll-bar horiz"></div>
  <div class="window__button scroll right"><i class="fas fa-arrow-right"></i></div>
  <div class="window__button size">&#x25E2;</div>
</div>`

export const ICON = elementFromString`<div class="icon">
  <div class="icon__image"></div>
  <div class="icon__title">title</div>
</div>`

export const TASK = elementFromString`<div class="task"></div>`