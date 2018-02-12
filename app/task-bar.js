const template = document.getElementById('task-template').querySelector('.task')

export default class TaskBar {
  constructor(os) {
    this.os = os
    this.taskbar = document.getElementById('task-bar')
  }

  getTask(id) {
    return this.taskbar.querySelector(`#task-${id}`)
  }

  setActive(id) {
    for (let win of this.os.windows) {
      const task = this.getTask(win.id)
      task.classList.remove('active')
      
      if (win.id === id) {
        win.unminimise()
        task.classList.add('active')
        task.classList.remove('minimised')
      }
    }
  }

  minimiseWindow(id) {
    const task = this.getTask(id)
    task.classList.remove('active')
    task.classList.add('minimised')
  }

  addWindow(win, title) {
    const newTask = template.cloneNode(true)
    newTask.id = `task-${win.id}`
    newTask.classList.add('active')
    newTask.innerText = title
    newTask.title = title
    newTask.addEventListener('click', e => this.os.selectTask(win.id))
    this.taskbar.appendChild(newTask)
  }

  removeWindow(id) {
    this.getTask(id).remove()
  }
}