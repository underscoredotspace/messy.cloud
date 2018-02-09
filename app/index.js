class pWindow {
  constructor({page, title, x, y, w, h}) {
    const template = document.getElementById('window-template').querySelector('.window')
    const el = template.cloneNode(true)
    
    this.el = el
    this.pos = {}
    
    const {innerWidth, innerHeight} = window
    
    if (!x) {x = (innerWidth / 2) - (w / 2)}
    if (!y) {y = (innerHeight / 2) - (h / 2)}
    
    this.move(x, y)
    this.size(w, h)
    
    document.body.appendChild(el)
    
    if (page) {this.page = page}
    if (title) {this.titleText = title}
    
    this.initEventListeners()
  }
  
  move(x, y) {
    const {innerWidth, innerHeight} = window
    if (x<0) {x=0}
    if (y<0) {y=0}
    if (x+this.pos.w > innerWidth) {x = innerWidth - this.pos.w}
    if (y+this.pos.h > innerHeight) {y = innerHeight - this.pos.h}
    
    this.pos.x = x 
    this.pos.y = y
    
    this.el.style.left = `${x}px`
    this.el.style.top = `${y}px`
    
  }
  
  size(w, h) {
    const {innerWidth, innerHeight} = window
    if (w<200) {w = 200}
    if (h<150) {h = 150}
    if (w+this.pos.x > innerWidth) {w = innerWidth - this.pos.x}
    if (h+this.pos.y > innerHeight) {h = innerHeight - this.pos.y}
    
    this.el.style.width = `${w}px`
    this.pos.w = w
    
    this.el.style.height = `${h}px`
    this.pos.h = h
  }
  
  initEventListeners() {
    const el = this.el
    this.sizeHandle = el.querySelector('.window__button.size')
    this.closeButton = el.querySelector('.window__button.close')
    this.maxButton = el.querySelector('.window__button.max')
    this.title = el.querySelector('.window__title')
    this.content = el.querySelector('.window__content__iframe')
    this.contentCover = el.querySelector('.window__content__cover')
    
    if (this.page) {
      this.content.src = this.page
      
      this.content.addEventListener('load', e => {
        this.title.innerText = this.titleText
        e.target.style.display = 'grid'
        el.querySelector('.window__content__loading').style.display = 'none'
      })
    }
    
    // Close window
    this.closeButton.addEventListener('click', e => {
      this.content.src = 'about:blank'
      el.remove()
    })
    
    // Maximise window
    this.maxButton.addEventListener('click', e => {
      el.classList.add('maximising')
      setTimeout(()=> {
        el.classList.remove('maximising')
      }, 500)
      
      if (this.maximised) {
        this.maximised = false
        this.size(this.beforeMax.w, this.beforeMax.h)
        this.move(this.beforeMax.x, this.beforeMax.y)
        return
      }
      // this.beforeMax = {...this.pos}
      this.beforeMax = {x:this.pos.x,y:this.pos.y,w:this.pos.w,h:this.pos.h}
      this.move(0,0)
      this.size(window.innerWidth, window.innerHeight)
      this.maximised = true
    })
    
    // Move window start
    const handleMoveStart = e => {
      const pageX = e.pageX || e.touches[0].pageX
      const pageY = e.pageY || e.touches[0].pageY

      if (this.maximised) {return}
      el.classList.add('changing')
      this.contentCover.style.display = 'block'
      this.title.style.cursor = 'move'
      this.dragging = true
      
      const box = el.getBoundingClientRect()
      this.start = {
        x: pageX - box.x, 
        y: pageY - box.y
      }
      
      e.preventDefault()
    }
    this.title.addEventListener('mousedown', handleMoveStart)
    this.title.addEventListener('touchstart', handleMoveStart)
    
    // Resize window start
    const handleResizeStart = (e) => {
      const pageX = e.pageX || e.touches[0].pageX
      const pageY = e.pageY || e.touches[0].pageY

      if (this.maximised) {return}
      el.classList.add('changing')
      this.contentCover.style.display = 'block'
      this.sizeHandle.style.cursor = 'nwse-resize'
      this.sizing = true
      
      const box = el.getBoundingClientRect()
      this.start = {
        w: pageX - box.width, 
        h: pageY - box.height
      }
      
      e.preventDefault()
    }

    this.sizeHandle.addEventListener('mousedown', handleResizeStart)
    this.sizeHandle.addEventListener('touchstart', handleResizeStart)
    
    // Handle drag for Resize and Move
    const handleMouseMove = (e) => {
      const pageX = e.pageX || e.touches[0].pageX
      const pageY = e.pageY || e.touches[0].pageY

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
      this.sizeHandle.style.cursor = 'default'
      this.title.style.cursor = 'default'
      el.classList.remove('changing')
      this.contentCover.style.display = 'none'
      this.dragging = false
      this.sizing = false
      this.start = {}
    }
    
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleMouseUp)
  }
}

const windows = [
  new pWindow({page:'https://router.messy.cloud', title:'neeko-router', x:100, y:10, w:320, h:200}),
  new pWindow({page:'https://screensaver.messy.cloud', title:'Mac Plus Screensaver', x:100, y:230, w:320, h:200})
]