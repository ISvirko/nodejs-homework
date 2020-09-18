const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const { PORT } = process.env;

const { contactsRouter } = require("./contacts/contacts.router");

exports.CRUDServer = class CRUDServer {
  constructor() {
    this.app = null;
  }

  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.initErrorHandling();
    this.startListening();
  }

  initServer() {
    this.app = express();
  }

  initMiddlewares() {
    this.app.use(express.json());
    this.app.use(morgan("tiny"));
    this.app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
  }

  initRoutes() {
    this.app.use("/api/contacts", contactsRouter);
  }

  initErrorHandling() {
    this.app.use((err, req, res, next) => {
      const status = err.status || 500;

      return res.status(status).send(err.message);
    });
  }

  startListening() {
    this.app.listen(PORT, () => {
      console.debug("Started listening on port", PORT);
    });
  }
};
