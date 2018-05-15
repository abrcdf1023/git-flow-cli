const colors = require('colors');

colors.setTheme({
  silly: 'rainbow',
  verbose: 'cyan',
  prompt: 'yellow',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: ['white', 'bgYellow'],
  input: ['white', 'bgBlue'],
  error: ['white', 'bgRed'],
});

module.exports.input = (msg) => {
  console.log(msg.input)
}

module.exports.info = (msg) => {
  console.log(msg.info)
}

module.exports.warn = (msg) => {
  console.log(msg.warn)
}

module.exports.error = (msg) => {
  console.log(msg.error)
}