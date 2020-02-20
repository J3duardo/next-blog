const express = require("express");
const server = express();
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const PORT = dev ? 3000 : process.env.PORT;

const app = next({dev});
const handle = app.getRequestHandler();

app.prepare()
.then(() => {
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, (err) => {
    if(err) {
      throw err
    }
    console.log(`Next montado en el servidor ${PORT}`)
  })
})
.catch(err => console.log(err))