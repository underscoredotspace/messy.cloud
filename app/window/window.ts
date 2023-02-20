import './window.scss'
import { generateId } from '../generateId'
import type OS from '../os/os'
import type { IconPos } from '../icon/icon'

export interface WindowDef {
  w: number
  h: number
  x?: number
  y?: number
  page: string
  titleText: string
  fixedSize?: boolean
}

export class Window {
  private os: OS
  public window: HTMLElement

  public id: string
  public page: string
  public titleText: string

  public fixedSize: boolean
  public zIndex: number = -1
  public minimised = false
  public maximised = false
  public focused = false
  private dragging = false
  private beforeMax: ReturnType<typeof this.pos> | null = null
  private moveStart: Omit<ReturnType<typeof this.pos>, 'r' | 'b'> | null = null
  private sizing = false

  private sizeHandle: HTMLButtonElement
  private closeButton: HTMLButtonElement
  private maxButton: HTMLButtonElement
  private minButton: HTMLButtonElement
  private title: HTMLElement
  private content: HTMLIFrameElement
  private contentCover: HTMLElement
  private loadingIndicator: HTMLElement

  constructor(os: OS, page: string, titleText: string, fixedSize = false) {
    this.os = os

    const WINDOW = <HTMLTemplateElement>document.getElementById('messy-window')
    const win = WINDOW.content.firstElementChild!.cloneNode(
      true
    )! as HTMLElement
    this.window = win

    this.id = generateId()
    this.window.id = `window-${this.id}`
    this.fixedSize = fixedSize
    this.page = page
    this.titleText = titleText

    this.sizeHandle = win.querySelector('.window__button.size')!
    this.closeButton = win.querySelector('.window__button.close')!
    this.maxButton = win.querySelector('.window__button.max')!
    this.minButton = win.querySelector('.window__button.min')!
    this.title = win.querySelector('.window__title')!
    this.content = win.querySelector('.window__content__iframe')!
    this.contentCover = win.querySelector('.window__content__cover')!
    this.loadingIndicator = win.querySelector('.window__content__loading')!

    if (this.fixedSize) {
      this.sizeHandle.style.display = 'none'
      this.maxButton.disabled = true
    }

    if (this.fixedSize) {
      this.sizeHandle.style.display = 'none'
      this.maxButton.disabled = true
    }

    if (page) {
      this.loadContent(page, titleText)
    }

    this.initEventListeners()
  }

  translate(iconPos: IconPos, win: WindowDef) {
    const x = iconPos.x - win.x! - win.w / 2
    const y = iconPos.y - win.y! - win.h / 2
    this.window.style.transform = `translate(${x}px, ${y}px) scale(0)`
  }

  pos() {
    const { top, right, bottom, left, width, height } =
      this.window.getBoundingClientRect()
    return { y: top, r: right, b: bottom, x: left, w: width, h: height }
  }

  setIndex(zIndex: number) {
    this.zIndex = zIndex
    this.window.style.zIndex = `${zIndex}`
  }

  loadContent(page: string, titleText: string) {
    this.content.src = page
    this.title.textContent = titleText

    const timeout = setTimeout(() => {
      this.loadingIndicator.textContent = 'Error: timeout'
      this.os.removeBee()
    }, 10 * 1000) // 10s timeout

    this.content.addEventListener('load', () => {
      this.content.style.display = 'grid'
      this.loadingIndicator.style.display = 'none'
      this.content.contentWindow?.focus()
      clearTimeout(timeout)
      this.window.style.transform = ''
      this.os.removeBee()
    })
  }

  move(x: number, y: number) {
    this.window.style.left = `${x}px`
    this.window.style.top = `${y}px`
  }

  resize(w: number, h: number) {
    this.window.style.width = `${w}px`
    this.window.style.height = `${h}px`
  }

  minimise(translateX: number, translateY: number) {
    this.window.style.transform = `translate(${translateX}px, ${translateY}px) scale(0)`
    this.minimised = true
    this.unFocus()
  }

  unminimise() {
    this.window.style.transform = 'none'
    this.minimised = false
  }

  maximise() {
    if (this.fixedSize) {
      return
    }

    this.beforeMax = this.pos()
    this.os.maximiseWindow(this.id)
    this.sizeHandle.classList.add('disabled')
    this.maximised = true
  }

  unmaximise() {
    if (!this.beforeMax) {
      return
    }
    this.resize(this.beforeMax.w, this.beforeMax.h)
    this.move(this.beforeMax.x, this.beforeMax.y)
    this.beforeMax = null
    this.sizeHandle.classList.remove('disabled')
    this.maximised = false
  }

  close() {
    this.window.style.transformOrigin = 'left top'
    this.window.style.transform = 'scale(0)'
    setTimeout(() => {
      this.content.src = 'about:blank'
      this.window.remove()
    }, 500)
  }

  setFocus() {
    this.focused = true
    this.window.classList.add('active')
    this.title.classList.add('active')
    this.contentCover.classList.add('active')
    this.content.contentWindow?.focus()
  }

  unFocus() {
    this.focused = false
    this.window.classList.remove('active')
    this.title.classList.remove('active')
    this.contentCover.classList.remove('active')
  }

  initEventListeners() {
    this.window.addEventListener('touchend', () => this.os.setFocus(this.id))
    this.window.addEventListener('mouseup', () => this.os.setFocus(this.id))

    this.closeButton.addEventListener('click', () =>
      this.os.ifNotBusy(() => this.os.closeWindow(this.id))
    )
    this.minButton.addEventListener('click', () =>
      this.os.ifNotBusy(() => this.os.minimiseWindow(this.id))
    )

    this.maxButton.addEventListener('click', () => {
      this.os.ifNotBusy(() =>
        !this.maximised ? this.maximise() : this.unmaximise()
      )
    })

    // Move window start
    const handleMoveStart = (e: TouchEvent | MouseEvent) => {
      if (this.maximised) {
        return
      }
      if (!this.focused) {
        this.os.setFocus(this.id)
      }

      //@ts-ignore
      const pageX = e.pageX || e.touches[0].pageX
      //@ts-ignore
      const pageY = e.pageY || e.touches[0].pageY

      this.window.classList.add('changing', 'move')
      this.contentCover.classList.remove('active')
      this.dragging = true

      const { x, y } = this.pos()
      this.moveStart = {
        h: 0,
        w: 0,
        x: pageX - x,
        y: pageY - y,
      }

      e.preventDefault()
    }
    this.title.addEventListener('mousedown', (e) =>
      this.os.ifNotBusy(() => handleMoveStart(e))
    )
    this.title.addEventListener('touchstart', (e) =>
      this.os.ifNotBusy(() => handleMoveStart(e))
    )

    // Resize window start
    const handleResizeStart = (e: TouchEvent | MouseEvent) => {
      if (this.maximised || this.fixedSize) {
        return
      }
      if (!this.focused) {
        this.os.setFocus(this.id)
      }

      // @ts-ignore
      const pageX = e.pageX || e.touches[0].pageX
      // @ts-ignore
      const pageY = e.pageY || e.touches[0].pageY

      this.window.classList.add('changing', 'resize')
      this.contentCover.classList.remove('active')
      this.sizing = true

      const { w, h } = this.pos()
      this.moveStart = {
        x: 0,
        y: 0,
        w: pageX - w,
        h: pageY - h,
      }

      e.preventDefault()
    }

    this.sizeHandle.addEventListener('mousedown', (e) =>
      this.os.ifNotBusy(() => handleResizeStart(e))
    )
    this.sizeHandle.addEventListener('touchstart', (e) =>
      this.os.ifNotBusy(() => handleResizeStart(e))
    )

    // Handle drag for Resize and Move
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!this.dragging && !this.sizing) {
        return
      }
      // @ts-ignore
      const pageX = e.pageX || e.touches[0].pageX
      // @ts-ignore
      const pageY = e.pageY || e.touches[0].pageY

      this.contentCover.classList.remove('active')

      if (this.dragging) {
        this.os.moveWindow(
          this.id,
          pageX - this.moveStart!.x,
          pageY - this.moveStart!.y
        )
      } else if (this.sizing) {
        this.os.resizeWindow(
          this.id,
          pageX - this.moveStart!.w,
          pageY - this.moveStart!.h
        )
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('touchmove', handleMouseMove)

    // Release Move/Resize
    const handleMouseUp = () => {
      if (!this.dragging && !this.sizing) {
        return
      }

      this.window.classList.remove('changing', 'move', 'resize')
      this.contentCover.classList.add('active')

      this.dragging = false
      this.sizing = false
      this.moveStart = null
    }

    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleMouseUp)
  }
}
