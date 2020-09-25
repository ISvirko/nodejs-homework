const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { contactRouter } = require("./contacts/contact.router");
const { authRouter } = require("./auth/auth.router");
const { userRouter } = require("./users/user.router");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const { MONGODB_URL, ALLOWED_ORIGIN, PORT } = process.env;

module.exports = class AuthServer {
  constructor() {
    this.app = null;
  }

  async start() {
    this.initServer();
    await this.initDbConnection();
    this.initMiddlewares();
    this.initRoutes();
    this.initErrorHandling();
    this.startListening();
  }

  initServer() {
    this.app = express();
  }

  async initDbConnection() {
    try {
      await mongoose.connect(MONGODB_URL, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
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
    this.app.use(cookieParser());
  }

  initRoutes() {
    this.app.use("/auth", authRouter);
    this.app.use("/users", userRouter);
    this.app.use("/api/contacts", contactRouter);
  }

  initErrorHandling() {
    this.app.use((err, req, res, next) => {
      const statusCode = err.status || 500;

      res.status(statusCode).send(err.message);
    });
  }

  startListening() {
    this.app.listen(PORT, () => {
      console.log("Started listening on port", PORT);
    });
  }
};
