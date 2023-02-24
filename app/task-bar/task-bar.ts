import type OS from "../os/os"
import type { Window } from "../window/window"
import "./task-bar.scss"

export default class TaskBar {
  public os: OS
  private taskbar: HTMLElement

  constructor(os: OS) {
    this.os = os
    this.taskbar = document.getElementById("task-bar")!
  }

  getTask(id: string): HTMLElement {
    return this.taskbar.querySelector(`#task-${id}`)!
  }

  taskPos(id: string) {
    const task = this.getTask(id)

    const { top, right, bottom, left, width, height } =
      task.getBoundingClientRect()
    return { y: top, r: right, b: bottom, x: left, w: width, h: height }
  }

  setActive(id: string): void {
    for (const win of this.os.windows) {
      const task = this.getTask(win.id)

      task.classList.remove("active")

      if (win.id === id) {
        if (win.minimised) {
          win.unminimise()
          task.classList.remove("minimised")
        }
        task.classList.add("active")
      }
    }
  }

  /** @returns x position of task button's center */
  minimiseWindow(id: string): number {
    const task = this.getTask(id)

    task.classList.remove("active")
    task.classList.add("minimised")

    const taskPos = this.taskPos(id)
    return taskPos.x + taskPos.w / 2
  }

  addWindow(win: Window, title: string): void {
    const newTask = document.createElement("div")
    newTask.className = "task"
    newTask.id = `task-${win.id}`
    newTask.classList.add("active")
    newTask.textContent = title
    newTask.title = title
    newTask.addEventListener("click", () =>
      this.os.ifNotBusy(() => this.os.selectTask(win.id))
    )
    this.taskbar.appendChild(newTask)
  }

  removeWindow(id: string): void {
    this.getTask(id).remove()
  }
}
