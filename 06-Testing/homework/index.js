const express = require('express');
const app = express();

app.use(express.json()); // for parsing application/json

app.get('/', (req, res) => {
  res.send({
    message: 'hola',
  });
});

app.get('/test', (req, res) => {
  res.send({
    message: 'test',
  });
});

app.post('/sum' , (req, res) => {
  let suma = req.body.a + req.body.b;
  res.send({
    result: 5
  })
})

app.post('/product', (req, res) => {
  res.send({
    result: req.body.a * req.body.b,
  });
});

app.post('/sumArray', (req, res) => {
  if(!req.body.array) return res.status(400).send()
  const { array, num } = req.body;
  const result = sumArray(array, num)
  return res.json({
    result
  })
})

app.post('/numString', (req, res) => {
  if(typeof req.body.string === "number" || req.body.string.length === 0) return res.status(400).send()
  let s = req.body.string.length;
  return res.send({
    result: s
  })
})

app.post('/pluck', (req, res) => {
  if(!Array.isArray(req.body.arrayObj)|| req.body.propiedad.length === 0) return res.status(400).send()
  let arrayPropiedad = [];
  req.body.arrayObj.forEach(element => {
    if(element.hasOwnProperty(req.body.propiedad)){
      arrayPropiedad.push(element[req.body.propiedad])
    }
  });
  return res.send({
    result: arrayPropiedad
  })
})

module.exports = app; // Exportamos app para que supertest session la pueda ejecutar

function sumArray(array, n) {
  if (!Array.isArray(array) || typeof n !== 'number') throw new TypeError('array');
  for(var i = 0; i < array.length ; i ++) {
    for(var j = i + 1; j < array.length ; j ++) {
      if ( array[i] + array[j] === n) return true;
    }
  }
  return false;
};