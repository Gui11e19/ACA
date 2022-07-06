const moongose = require("mongoose"); //requerimos la libreria moongose
//el método connect recibe como parametros la URI de
//conexión.

module.export = moongose
  .connect(mongodbURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then((db) => console.log("Connection success!!"))
  .catch((err) => console.error(err));
