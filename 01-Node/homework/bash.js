const commands = require('./commands/index.js');

// Output un prompt
process.stdout.write('MATE > ');
// El evento stdin 'data' se dispara cuando el user escribe una línea
process.stdin.on('data', function (data) {
  var dat = data.toString().trim().split(" "); // remueve la nueva línea
  var cmd = dat[0]
  dat.shift()
  var string = "";
  dat.map((elemento) => string += elemento + " ")
  let text = string.trim()
  commands[cmd](text)
  process.stdout.write('\nMATE > ');
});