export default class TaskBar {
  constructor(os) {
    this.os = os
    this.taskbar = document.getElementById('task-bar')
  }

  getTask(id) {
    return this.taskbar.querySelector(`#task-${id}`)
  }

  taskPos(id) {
    const { top, right, bottom, left, width, height } = this.getTask(
      id
    ).getBoundingClientRect()
    return { y: top, r: right, b: bottom, x: left, w: width, h: height }
  }

  setActive(id) {
    for (let win of this.os.windows) {
      const task = this.getTask(win.id)
      task.classList.remove('active')

      if (win.id === id) {
        if (win.minimised) {
          win.unminimise()
          task.classList.remove('minimised')
        }
        task.classList.add('active')
      }
    }
  }

  minimiseWindow(id) {
    const task = this.getTask(id)
    task.classList.remove('active')
    task.classList.add('minimised')

    const taskPos = this.taskPos(id)
    return taskPos.x + taskPos.w / 2
  }

  addWindow(win, title) {
    const newTask = document.createElement('div')
    newTask.className = 'task'
    newTask.id = `task-${win.id}`
    newTask.classList.add('active')
    newTask.textContent = title
    newTask.title = title
    newTask.addEventListener('click', e => this.os.selectTask(win.id))
    this.taskbar.appendChild(newTask)
  }

  removeWindow(id) {
    this.getTask(id).remove()
  }
}
