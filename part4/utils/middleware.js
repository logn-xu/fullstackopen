const logger = require("./logger");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const reqLogger = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path:  ", req.path);
  logger.info("Body:  ", req.body);
  logger.info("---");
  next();
};

const tokenExtractor = async (req, res, next) => {
  const noTokenPath = ["/api/login"];
  const path = req.path;
  if (noTokenPath.includes(path)) {
    return next();
  }

  try {
    const authorization = req.get("authorization");
    if (authorization && authorization.startsWith("Bearer ")) {
      const token = authorization.replace("Bearer ", "");

      const decodeToken = jwt.verify(token, process.env.SECRET);
      if (!decodeToken || !decodeToken.id) {
        res.status(401).json({ error: "Unauthorized" });
      }

      const user = await User.findOne({ username: decodeToken.username });
      req.user = user;
    } else {
      res.status(401).json({ error: "unauthorized" });
    }
  } catch (error) {
    return next(error);
  }
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({
    error: "unknown endpoint",
  });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);
  if (error.name === "CastError") {
    res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    res.status(400).send({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return res.status(400).json({ error: "username is exist" });
  } else if (error.message === "jwt expired") {
    res.status(401).send({ error: "jwt expired" });
  }
  next(error);
};

module.exports = {
  reqLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
