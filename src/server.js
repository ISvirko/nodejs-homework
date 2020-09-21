const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { contactsRouter } = require("./contacts/contacts.router");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const { MONGODB_URL, ALLOWED_ORIGIN, PORT } = process.env;

exports.CRUDServer = class CRUDServer {
  constructor() {
    this.app = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDatabaseConnection();
    this.initErrorHandling();
    this.startListening();
  }

  initServer() {
    this.app = express();
  }

  async initDatabaseConnection() {
    try {
      await mongoose.connect(MONGODB_URL, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
      });

      console.log("Database connection successful");
    } catch (err) {
      console.log(err.message);
      process.exit(1);
    }
  }

  initMiddlewares() {
    this.app.use(express.json());
    this.app.use(morgan("tiny"));
    this.app.use(cors({ origin: ALLOWED_ORIGIN }));
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
