require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const PhoneBook = require("./models/phonebook");

const app = express();

app.use(cors());
app.use(express.json());

// logs
morgan.token("body", function getBody(req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (req, res) => {
  PhoneBook.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  PhoneBook.findById(req.params.id).then((persion) => {
    res.json(persion);
  });
});

app.delete("/api/persons/:id", (req, res, next) => {
  PhoneBook.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const person = new PhoneBook({
    name: req.body.name,
    number: req.body.number,
  });

  if (!person.name || !person.number) {
    res.status(400).json({
      error: `name or number missing`,
    });
  } else {
    person
      .save()
      .then((result) => {
        res.status(204).end();
      })
      .catch((error) => next(error));
  }
});

app.put("/api/persons/:id", (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  };

  PhoneBook.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
  })
    .then((result) => {
      res.json(person);
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  PhoneBook.find({}).then((result) => {
    const date = new Date();
    const body = {
      msg: `Phonebook has info ${result.length} people`,
      date: `${date.toDateString()} ${date.toTimeString()}`,
    };
    res.json(body);
  });
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({
    error: "unknown endpoint",
  });
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    res.status(400).send({ error: error.message });
  }
  next(error);
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is http://localhost:${PORT}`);
});
