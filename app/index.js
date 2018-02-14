import tos from './os/os'
window.os = new tos

os.addIcon({title:'emojis.htm', type:os.icon.file, window: {
  page:'https://emoji.messy.cloud', title:'[CAB] Emojis', w:400, h:345, y:10
}})
os.addIcon({title:'scrsaver.app', type:os.icon.app, window: {
  page:'https://screensaver.messy.cloud', title:'Mac Plus Screensaver', w:240, h:200, x: 10, y:100
}})
os.addIcon({title:'winter.app', type:os.icon.app, window: {
  page: 'http://winter.messy.cloud/#mobile', title: 'Winter Scene', w:415, h:500
}})
os.addIcon({title:'router.htm', type:os.icon.file, window: {
  page:'https://router.messy.cloud', title:'[CAB] neeko-router Demo', w:320, h:200, y:365
}})

os.openDialog({
  title: 'Messy Cloud v0.2', 
  text: `Welcome! This is the portfolio of Colin Tindle, in the style of Atari's graphical OS. 
  
  Please double click on each of the icons to load a section. A window will open - you can move, resize, minimise and maximise these windows to your heart's content. `,
  buttons: {}
})
