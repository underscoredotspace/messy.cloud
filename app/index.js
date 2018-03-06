import OS from './os/os'
window.os = new OS()

if (module.hot) {
  window.os.desktop.desktop.innerHTML = ''
  window.os.taskBar.taskbar.innerHTML = ''
  window.os.menuBar.menubar.innerHTML = ''
}

os.addIcon({title:'emojis.htm', type:os.icon.file, window: {
  page:'https://emoji.messy.cloud', title:'[CAB] Emojis', w:386, h:330, y:10
}})
os.addIcon({title:'scrsaver.app', type:os.icon.app, window: {
  page:'https://screensaver.messy.cloud', title:'Mac Plus Screensaver', w:240, h:200, x: 10, y:100
}})
os.addIcon({title:'winter.app', type:os.icon.app, window: {
  page: 'https://winter.messy.cloud', title: 'Winter Scene', w:415, h:500
}})
os.addIcon({title:'frogger.app', type:os.icon.app, window: {
  page: 'https://underscoredotspace.github.io/frogger/', title: 'Frogger', w:448, h:271
}})
os.addIcon({title:'router.htm', type:os.icon.file, window: {
  page:'https://router.messy.cloud', title:'[CAB] neeko-router Demo', w:320, h:200, y:365
}})
os.addIcon({title:'TRASH', type:os.icon.trash, window: {
  page:'https://underscore.space', title:'[CAB] underscore .  space', w:490, h:1000
}})

// os.openDialog({
//   title: 'Messy Cloud v0.3', 
//   text: `Welcome! This is the portfolio of Colin Tindle, in the style of Atari's graphical OS. 
  
//   Please double click on each of the icons to load a section. A window will open - you can move, resize, minimise and maximise these windows to your heart's content. `,
//   buttons: {}
// })
