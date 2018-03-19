import OS from './os/os'
window.os = new OS()

if (module.hot) {
  window.os.desktop.desktop.innerHTML = ''
  window.os.taskBar.taskbar.innerHTML = ''
  window.os.menuBar.menubar.innerHTML = ''
}

os.init()

if (location.hostname !== 'localhost') {
  os.openDialog({
    title: 'Messy Cloud v0.4', 
    text: `Welcome! This is the portfolio of Colin Tindle, in the style of Atari's graphical OS. 
    
    Please double click on each of the icons to load a section. A window will open - you can move, resize, minimise and maximise these windows to your heart's content. `,
    buttons: {}
  })
}