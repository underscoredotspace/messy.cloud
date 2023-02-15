import OS from './os/os'
const os = new OS()

window.os = os

if (import.meta.hot) {
  window.os.desktop.desktop.innerHTML = ''
  window.os.taskBar.taskbar.innerHTML = ''
  window.os.menuBar.menubar.innerHTML = ''
}

os.init()

if (location.hostname !== 'localhost') {
  os.about()
}
