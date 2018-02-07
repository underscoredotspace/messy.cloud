class pWindow {
  constructor({x, y, w, h}) {
    const template = document.getElementById('window-template').querySelector('.window')
    const el = template.cloneNode(true)
    
    this.sizeHandle = el.querySelector('.window__button.size')
    this.closeButton = el.querySelector('.window__button.close')
    this.maxButton = el.querySelector('.window__button.max')
    this.title = el.querySelector('.window__title')
    this.el = el
    this.pos = {}
    
    this.move(x, y)
    this.size(w, h)
    
    document.body.appendChild(el)
    
    this.initEventListeners()
  }
  
  move(x, y) {
    if (x<0) {x=0}
    if (y<0) {y=0}
    if (x+this.pos.w > window.innerWidth) {x = window.innerWidth - this.pos.w}
    if (y+this.pos.h > window.innerHeight) {y = window.innerHeight - this.pos.h}
    
    this.pos.x = x 
    this.pos.y = y
    
    this.el.style.left = `${x}px`
    this.el.style.top = `${y}px`
    
  }
  
  size(w, h) {
    if (w<200) {w = 200}
    if (h<150) {h = 150}
    if (w+this.pos.x > window.innerWidth) {w = window.innerWidth - this.pos.x}
    if (h+this.pos.y > window.innerHeight) {h = window.innerHeight - this.pos.y}
    
    this.el.style.width = `${w}px`
    this.pos.w = w
    
    this.el.style.height = `${h}px`
    this.pos.h = h
  }
  
  initEventListeners() {
    // Close window
    this.closeButton.addEventListener('click', e => {
      this.el.remove()
    })
    
    // Maximise window
    this.maxButton.addEventListener('click', e => {
      this.el.classList.add('maximising')
      setTimeout(()=> {
        this.el.classList.remove('maximising')
      }, 500)
      
      if (this.maximised) {
        this.maximised = false
        this.size(this.beforeMax.w, this.beforeMax.h)
        this.move(this.beforeMax.x, this.beforeMax.y)
        return
      }
      this.beforeMax = {...this.pos}
      this.move(0,0)
      this.size(window.innerWidth, window.innerHeight)
      this.maximised = true
    })
    
    // Move window start
    this.title.addEventListener('mousedown', e => {
      if (this.maximised) {return}
      this.el.classList.add('changing')
      this.title.style.cursor = 'move'
      this.dragging = true
      
      const box = this.el.getBoundingClientRect()
      this.start = {
        x: e.pageX - box.x, 
        y: e.pageY - box.y
      }
      
      e.preventDefault()
    })
    
    // Resize window start
    this.sizeHandle.addEventListener('mousedown', e => {
      if (this.maximised) {return}
      this.el.classList.add('changing')
      this.sizeHandle.style.cursor = 'nwse-resize'
      this.sizing = true
      
      const box = this.el.getBoundingClientRect()
      this.start = {
        w: e.pageX - box.width, 
        h: e.pageY - box.height
      }
      
      e.preventDefault()
    })
    
    // Handle drag for Resize and Move
    document.addEventListener('mousemove', e => {
      if (this.dragging) {
        this.move(e.pageX - this.start.x, e.pageY - this.start.y)
      } else if (this.sizing) {
        this.size(e.pageX - this.start.w, e.pageY - this.start.h)
      }
    })
    
    // Release Move/Resize
    document.addEventListener('mouseup', e => {
      this.sizeHandle.style.cursor = 'default'
      this.title.style.cursor = 'default'
      this.el.classList.remove('changing')
      this.dragging = false
      this.sizing = false
      this.start = {}
    })
  }
}

const windows = [new pWindow({x:10, y:10, w:100, h:200}), new pWindow({x:300, y:50, w:150, h:150})]