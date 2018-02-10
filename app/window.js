import uuid from 'uuid'
const template = document.getElementById('window-template').querySelector('.window')

export default class tosWindow {
  constructor({page, title, x, y, w, h}, os) {
    const win = template.cloneNode(true)
    
    this.pos = {}
    this.window = win
    this.os = os
    this.id = uuid()
    this.window.id = `window-${this.id}`

    this.desktop = document.getElementById('desktop')
    this.sizeHandle = win.querySelector('.window__button.size')
    this.closeButton = win.querySelector('.window__button.close')
    this.maxButton = win.querySelector('.window__button.max')
    this.minButton = win.querySelector('.window__button.min')
    this.title = win.querySelector('.window__title')
    this.content = win.querySelector('.window__content__iframe')
    this.contentCover = win.querySelector('.window__content__cover')
    
    const {top, right, bottom, left} = this.desktop.getBoundingClientRect()
    
    if (!x) {x = ((right-left) / 2) - (w / 2)}
    if (!y) {y = ((bottom-top) / 2) - (h / 2)}
    
    this.move(x+left, y+top)
    this.size(w, h)
    
    desktop.appendChild(win)
    
    if (page) {this.loadContent(page, title)}
    
    this.takeFocus = this.takeFocus.bind(this)
    this.close = this.close.bind(this)
    this.animate = this.animate.bind(this)
    this.minimise = this.minimise.bind(this)
    this.loadContent = this.loadContent.bind(this)
    this.initEventListeners()
    this.takeFocus()
  }

  loadContent(page, title = this.window.id) {
      this.content.src = page
      const el = this.window
      
      this.content.addEventListener('load', e => {
        this.title.innerText = title
        e.target.style.display = 'grid'
        el.querySelector('.window__content__loading').style.display = 'none'
      })
  }

  animate(callback) {
    const el = this.window
    el.classList.add('maximising')
    setTimeout(()=> {
      el.classList.remove('maximising')
    }, 500)
    callback()
  }
  
  move(x, y) {
    const {top, right, bottom, left} = this.desktop.getBoundingClientRect()

    if (x<left) {x=left}
    if (y<top) {y=top}
    if (x+this.pos.w > (right)) {x = right - this.pos.w}
    if (y+this.pos.h > (bottom)) {y = bottom - this.pos.h}
    
    this.pos.x = x 
    this.pos.y = y
    
    this.window.style.left = `${x}px`
    this.window.style.top = `${y}px`
    
  }
  
  size(w, h) {
    const {top, right, bottom, left} = this.desktop.getBoundingClientRect()
    if (w<240) {w=240}
    if (h<200) {h=200}
    if (w+this.pos.x > (right-left)) {w = right - this.pos.x}
    if (h+this.pos.y > (bottom-top)) {h = bottom - this.pos.y}
    
    this.window.style.width = `${w}px`
    this.pos.w = w
    
    this.window.style.height = `${h}px`
    this.pos.h = h
  }

  minimise(e) {
    this.os.minimise(this.id)
    this.window.classList.add('minimised')
    this.minimised = true
  }

  unminimise() {
    this.window.classList.remove('minimised')
    this.minimise = false
  }

  maximise() {
    this.animate(() => {
      const {top, left, height, width} = this.desktop.getBoundingClientRect()
      this.beforeMax = {x:this.pos.x,y:this.pos.y,w:this.pos.w,h:this.pos.h}
      this.move(left, top)
      this.size(width, height)
      this.sizeHandle.classList.add('disabled')
      this.maximised = true
    })
  }

  unmaximise() {
    this.animate(() => {
      this.beforeMax = {}
      this.size(this.beforeMax.w, this.beforeMax.h)
      this.move(this.beforeMax.x, this.beforeMax.y)
      this.sizeHandle.classList.remove('disabled')
      this.maximised = false
    })
  }

  close(e) {
    this.os.taskBar.removeWindow(this.id)
    this.content.src = 'about:blank'
    this.window.remove()
    // give another window focus?
  }

  takeFocus(e) {
    this.desktop.querySelectorAll('.window').forEach(win => {
      win.style.zIndex = 1
      const title = win.querySelector('.window__title')
      const contentCover = win.querySelector('.window__content__cover')
      title.style.backgroundColor = 'lightsteelblue'
      title.style.color = 'steelblue'
      contentCover.style.display = 'block'
    })
    this.window.style.zIndex = 2
    this.title.style.backgroundColor = 'steelblue'
    this.title.style.color = 'black'
    this.contentCover.style.display = 'none'
    this.os.taskBar.setActive(this.id)
  }
  
  initEventListeners() {
    this.window.addEventListener('touchend', this.takeFocus)
    this.window.addEventListener('mouseup', this.takeFocus)
    
    // Close window
    this.closeButton.addEventListener('click', this.close)

    // Minimise window
    this.minButton.addEventListener('click', this.minimise)
    
    // Maximise window
    this.maxButton.addEventListener('click', e => {     
      if (this.maximised) {
        this.unmaximise()
        return
      }

      this.maximise()
    })
    
    // Move window start
    const handleMoveStart = e => {
      if (this.maximised) {return}
      const pageX = e.pageX || e.touches[0].pageX
      const pageY = e.pageY || e.touches[0].pageY

      this.window.classList.add('changing')
      this.contentCover.style.display = 'block'
      this.title.style.cursor = 'move'
      this.dragging = true
      
      const {x,y} = this.window.getBoundingClientRect()
      this.start = {
        x: pageX - x, 
        y: pageY - y
      }
      
      e.preventDefault()
    }
    this.title.addEventListener('mousedown', handleMoveStart)
    this.title.addEventListener('touchstart', handleMoveStart)
    
    // Resize window start
    const handleResizeStart = (e) => {
      if (this.maximised) {return}

      const pageX = e.pageX || e.touches[0].pageX
      const pageY = e.pageY || e.touches[0].pageY

      this.window.classList.add('changing')
      this.contentCover.style.display = 'block'
      this.sizeHandle.style.cursor = 'nwse-resize'
      this.sizing = true
      
      const {width,height} = this.window.getBoundingClientRect()
      this.start = {
        w: pageX - width, 
        h: pageY - height
      }
      
      e.preventDefault()
    }

    this.sizeHandle.addEventListener('mousedown', handleResizeStart)
    this.sizeHandle.addEventListener('touchstart', handleResizeStart)
    
    // Handle drag for Resize and Move
    const handleMouseMove = (e) => {
      if (!this.dragging && !this.sizing) {return}
      const pageX = e.pageX || e.touches[0].pageX
      const pageY = e.pageY || e.touches[0].pageY

      this.takeFocus()
      this.contentCover.style.display = 'block'

      if (this.dragging) {
        this.move(pageX - this.start.x, pageY - this.start.y)
      } else if (this.sizing) {
        this.size(pageX - this.start.w, pageY - this.start.h)
      }
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('touchmove', handleMouseMove)
    
    // Release Move/Resize    
    const handleMouseUp = (e) => {
      if (!this.dragging && !this.sizing) {return}

      this.sizeHandle.style.cursor = 'default'
      this.title.style.cursor = 'default'
      this.window.classList.remove('changing')

      this.dragging = false
      this.sizing = false
      this.start = {}
      this.takeFocus()
    }
    
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleMouseUp)
  }
}