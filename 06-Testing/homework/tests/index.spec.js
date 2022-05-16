const session = require('supertest-session');
const app = require('../index.js'); // Importo el archivo de entrada del server de express.

const agent = session(app);

describe('Test de APIS', () => {
  describe('GET /', () => {
    it('responds with 200', () => agent.get('/').expect(200));
    it('responds with and object with message `hola`', () =>
        agent.get('/').then((res) => {
          expect(res.body.message).toEqual('hola');
        }));
  });

  describe('GET /test', () => {
    it('responds with 200', () => agent.get('/test').expect(200));
    it('responds with and object with message `test`', () =>
      agent.get('/test').then((res) => {
        expect(res.body.message).toEqual('test');
      }));
  });

  describe('POST /sum', () => {
    it('responds with 200', () => agent.post('/sum').send({a: 1, b: 1}).expect(200));
    it('responds with the sum of 2 and 3', () =>
      agent.post('/sum')
        .send({a: 2, b: 3})
        .then((res) => {
          expect(res.body.result).toEqual(5);
        })
    );
  });

  describe('POST /product', () => {
    it('responds with 200', () => agent.post('/product').send({a:2,b:3}).expect(200));
    it('responds with the product of 2 and 3', () =>
      agent.post('/product')
        .send({a: 2, b: 3})
        .then((res) => {
          expect(res.body.result).toEqual(6);
        })
    );
  });

  describe('POST /sumArray', () => {
    it('si no envio un body espero un status 400', () => agent.post('/sumArray').expect(400));
    it('responds with 200', () => agent.post('/sumArray').send({array: [], num: 0}).expect(200));
    it('responds with and object with message `test`', () =>
      agent.post('/sumArray')
        .send({array: [2,5,7,10,11,15,20], num: 13})
        .then((res) => {
          expect(res.body.result).toEqual(true);
    }))
    it('responde false a la peticion', () =>
      agent.post('/sumArray')
        .send({array: [0,1,2,3], num: 13})
        .then((res) => {
          expect(res.body.result).toBeFalsy();
    }));
  })

  describe('POST /numString', () => {
    it("Status 200", () => agent.post("/numString").send({string:"a"}).expect(200));
    it("Status 400 si paso un numero", () => agent.post("/numString").send({string:5}).expect(400));
    it("Status 400 si el string esta vacío", () => agent.post("/numString").send({string:""}).expect(400));
    it("Espero que devuelva 4 si le paso hola", () => {
      agent.post("/numString")
        .send({string: "hola"})
        .then((res) => {
          expect(res.body.result).toEqual(4)
        })
    })
  })

  describe('POST /pluck', () => {
    let arrayObj = [
      {nombre: "Tomi", edad:"20"},
      {nombre: "Jorge", edad:"23"},
      {nombre: "Roman", edad:"22"},
      {nombre: "Fede", edad:"24"},
      {nombre: "Ivan", edad:"43"}
    ]
    it("Status 200", () => agent.post("/pluck").send({arrayObj, propiedad: "nombre"}).expect(200));
    it("Status 400 si array no es un arreglo", () => agent.post("/pluck").send({arrayObj: "arrayObj", propiedad: "nombre"}).expect(400));
    it("Status 400 si el string propiedad está vacio", () => agent.post("/pluck").send({arrayObj, propiedad: ""}).expect(400));
    it("Retorna los valores de la propiedad pasada", () => {
      agent.post("/pluck")
        .send({arrayObj, propiedad: "nombre"})
        .then((res) => {
          expect(res.body.result).toEqual(["Tomi", "Jorge", "Roman", "Fede", "Ivan"])
        })
    });
  })

});

