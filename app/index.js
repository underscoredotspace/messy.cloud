import OS from './os/os'
window.os = new OS()

if (module.hot) {
  window.os.desktop.desktop.innerHTML = ''
  window.os.taskBar.taskbar.innerHTML = ''
  window.os.menuBar.menubar.innerHTML = ''
}

os.init()

if (location.hostname !== 'localhost') {
  os.about()
}