// const express = require("express");
// const Joi = require("joi");
// const cors = require("cors");

// const { PORT } = process.env;

// const server = express();

// server.use(express.json());
// server.use(cors({ origin: process.env.ALLOWED_ORIGIN }));

// const contactScheme = Joi.object({
//   name: Joi.string().required,
//   email: Joi.string().email().required,
//   phone: Joi.string().required,
// });

// contactScheme.validate();

// server.get("/api/contacts", validate(contactScheme), (req, res, next) => {
//   res.status(205).send({ hello: "world" });
// });

// server.listen(PORT, () => {
//   console.log("started listening", PORT);
// });

// function validate(scheme) {
//   return (req, res, next) => {
//     const validationResult = scheme.validate(req.body);
//     if (validationResult.error) {
//       return res.status(400).send(validationResult.error);
//     }
//     next();
//   };
// }
