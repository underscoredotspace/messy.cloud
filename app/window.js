import uuid from 'uuid'
const template = document.getElementById('window-template').querySelector('.window')

export default class tosWindow {
  constructor({page, title}, os) {
    const win = template.cloneNode(true)
    
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
    
    if (page) {this.loadContent(page, title)}
    
    this.close = this.close.bind(this)
    this.animate = this.animate.bind(this)
    this.minimise = this.minimise.bind(this)
    this.loadContent = this.loadContent.bind(this)
    this.initEventListeners()
  }

  pos() {
    const {top, right, bottom, left, width, height} = this.window.getBoundingClientRect()
    return {y:top, r:right, b:bottom, x:left, w:width, h:height}
  }

  loadContent(page, title = this.window.id) {
      this.content.src = page
      this.title.innerText = title
      
      this.content.addEventListener('load', e => {
        e.target.style.display = 'grid'
        this.window.querySelector('.window__content__loading').style.display = 'none'
      })
  }

  animate(callback) {
    this.window.classList.add('maximising')
    setTimeout(()=> {
      this.window.classList.remove('maximising')
    }, 500)
    callback()
  }
  
  move(x, y) {
    requestAnimationFrame(() => {
      this.window.style.left = `${x}px`
      this.window.style.top = `${y}px`
    })
  }
  
  resize(w, h) {
    requestAnimationFrame(() => {
      this.window.style.width = `${w}px`
      this.window.style.height = `${h}px`
    })
  }

  minimise() {
    this.window.classList.add('minimised')
    this.minimised = true
    this.unFocus()
  }

  unminimise() {
    this.window.classList.remove('minimised')
    this.minimised = false
  }

  maximise() {
    this.animate(() => {
      this.beforeMax = this.pos()
      this.os.maximiseWindow(this.id)
      this.sizeHandle.classList.add('disabled')
      this.maximised = true
    })
  }

  unmaximise() {
    this.animate(() => {
      this.resize(this.beforeMax.w, this.beforeMax.h)
      this.move(this.beforeMax.x, this.beforeMax.y)
      this.beforeMax = {}
      this.sizeHandle.classList.remove('disabled')
      this.maximised = false
    })
  }

  close(e) {
    this.content.src = 'about:blank'
    this.window.remove()
    // give another window focus?
  }

  setFocus() {    
    if(this.focused) {return}
    this.focused = true
    this.window.classList.add('active')
    this.title.classList.add('active')
    this.contentCover.classList.remove('active')
  }

  unFocus() {
    if(!this.focused) {return}
    this.focused = false
    this.window.classList.remove('active')
    this.title.classList.remove('active')
    this.contentCover.classList.add('active')
  }
  
  initEventListeners() {
    this.window.addEventListener('touchend', e=>this.os.setFocus(this.id))
    this.window.addEventListener('mouseup', e=>this.os.setFocus(this.id))
    
    this.closeButton.addEventListener('click', e => this.os.closeWindow(this.id))
    this.minButton.addEventListener('click', e => this.os.minimiseWindow(this.id))
    
    this.maxButton.addEventListener('click', e => {     
      !this.maximised ? this.maximise() : this.unmaximise()
    })

    // Move window start
    const handleMoveStart = e => {
      if (this.maximised) {return}
      if (!this.focused) {this.os.setFocus(this.id)}

      const pageX = e.pageX || e.touches[0].pageX
      const pageY = e.pageY || e.touches[0].pageY

      this.window.classList.add('changing')
      this.contentCover.style.display = 'block'
      this.title.style.cursor = 'move'
      this.dragging = true
      
      const {x,y} = this.pos()
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
      if (!this.focused) {this.os.setFocus(this.id)}

      const pageX = e.pageX || e.touches[0].pageX
      const pageY = e.pageY || e.touches[0].pageY

      this.window.classList.add('changing')
      this.contentCover.style.display = 'block'
      this.sizeHandle.style.cursor = 'nwse-resize'
      this.sizing = true
      
      const {w,h} = this.pos()
      this.start = {
        w: pageX - w, 
        h: pageY - h
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

      this.contentCover.style.display = 'block'

      if (this.dragging) {
        this.os.moveWindow(this.id, pageX - this.start.x, pageY - this.start.y)
      } else if (this.sizing) {
        this.os.resizeWindow(this.id, pageX - this.start.w, pageY - this.start.h)
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
    }
    
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleMouseUp)
  }
}