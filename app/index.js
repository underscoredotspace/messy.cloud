class pWindow {
  constructor({page, title, x, y, w, h}) {
    const template = document.getElementById('window-template').querySelector('.window')
    const el = template.cloneNode(true)
    
    this.pos = {}

    this.el = el
    this.desktop = document.getElementById('desktop')
    this.sizeHandle = el.querySelector('.window__button.size')
    this.closeButton = el.querySelector('.window__button.close')
    this.maxButton = el.querySelector('.window__button.max')
    this.title = el.querySelector('.window__title')
    this.content = el.querySelector('.window__content__iframe')
    this.contentCover = el.querySelector('.window__content__cover')
    
    const {top, right, bottom, left} = this.desktop.getBoundingClientRect()
    
    if (!x) {x = ((right-left) / 2) - (w / 2)}
    if (!y) {y = ((bottom-top) / 2) - (h / 2)}
    
    this.move(x+left, y+top)
    this.size(w, h)
    
    desktop.appendChild(el)
    
    if (page) {this.loadContent(page, title)}
    
    this.takeFocus = this.takeFocus.bind(this)
    this.close = this.close.bind(this)
    this.animate = this.animate.bind(this)
    this.loadContent = this.loadContent.bind(this)
    this.initEventListeners()
    this.takeFocus()
  }

  loadContent(page, title = this.el.id) {
      this.content.src = page
      const el = this.el
      
      this.content.addEventListener('load', e => {
        this.title.innerText = title
        e.target.style.display = 'grid'
        el.querySelector('.window__content__loading').style.display = 'none'
      })
  }

  animate(callback) {
    const el = this.el
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
    
    this.el.style.left = `${x}px`
    this.el.style.top = `${y}px`
    
  }
  
  size(w, h) {
    const {top, right, bottom, left} = this.desktop.getBoundingClientRect()
    if (w<240) {w=240}
    if (h<200) {h=200}
    if (w+this.pos.x > (right-left)) {w = right - this.pos.x}
    if (h+this.pos.y > (bottom-top)) {h = bottom - this.pos.y}
    
    this.el.style.width = `${w}px`
    this.pos.w = w
    
    this.el.style.height = `${h}px`
    this.pos.h = h
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

  restore() {
    this.animate(() => {
      this.maximised = false
      this.size(this.beforeMax.w, this.beforeMax.h)
      this.move(this.beforeMax.x, this.beforeMax.y)
      this.sizeHandle.classList.remove('disabled')
    })
  }

  close(e) {
    this.content.src = 'about:blank'
    this.el.remove()
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
    this.el.style.zIndex = 2
    this.title.style.backgroundColor = 'steelblue'
    this.title.style.color = 'black'
    this.contentCover.style.display = 'none'
  }
  
  initEventListeners() {
    const el = this.el

    this.el.addEventListener('touchend', this.takeFocus)
    this.el.addEventListener('mouseup', this.takeFocus)
    
    // Close window
    this.closeButton.addEventListener('click', this.close)
    
    // Maximise window
    this.maxButton.addEventListener('click', e => {     
      if (this.maximised) {
        this.restore()
        return
      }

      this.maximise()
    })
    
    // Move window start
    const handleMoveStart = e => {
      if (this.maximised) {return}
      const pageX = e.pageX || e.touches[0].pageX
      const pageY = e.pageY || e.touches[0].pageY

      el.classList.add('changing')
      this.contentCover.style.display = 'block'
      this.title.style.cursor = 'move'
      this.dragging = true
      
      const {x,y} = el.getBoundingClientRect()
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

      el.classList.add('changing')
      this.contentCover.style.display = 'block'
      this.sizeHandle.style.cursor = 'nwse-resize'
      this.sizing = true
      
      const {width,height} = el.getBoundingClientRect()
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
      el.classList.remove('changing')

      this.dragging = false
      this.sizing = false
      this.start = {}
      this.takeFocus()
    }
    
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleMouseUp)
  }
}

const windows = [
  new pWindow({page:'https://router.messy.cloud', title:'neeko-router', x:100, y:20, w:320, h:200}),
  new pWindow({page:'https://screensaver.messy.cloud', title:'Mac Plus Screensaver', x:100, y:230, w:320, h:200})
]