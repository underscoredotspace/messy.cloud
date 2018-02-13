import tos from './os/os'
window.os = new tos

os.addIcon({title:'emojis.htm', type:os.icon.file, window: {
  page:'https://emoji.messy.cloud', title:'[CAB] Emojis', w:400, h:345, y:10
}})
os.addIcon({title:'scrsaver.app', type:os.icon.app, window: {
  page:'https://screensaver.messy.cloud', title:'Mac Plus Screensaver', w:240, h:200, x: 10, y:100
}})
os.addIcon({title:'router.htm', type:os.icon.file, window: {
  page:'https://router.messy.cloud', title:'[CAB] neeko-router Demo', w:320, h:200, y:365
}})