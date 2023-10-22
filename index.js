require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const accessLogStream = fs.createWriteStream(
  path.join("./", "access.log"),
  { flags: "a" }
);
const Contact = require("./models/contactsModel");

// https://github.com/expressjs/morgan
morgan.token("body", (request, response) => {
  //return request.body;
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  }
  return "";
});

app.use(express.static("dist"));
app.use(express.json());
app.use(morgan(":method :url :response-time ms :body")); //, { stream: accessLogStream }));

// Routes

app.get("/", (request, response) => {
  response.json(contacts);
});

app.get("/api/contacts", (request, response) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts);
  });
});

app.get("/api/contacts/:id", (request, response, next) => {
  const id = request.params.id;

  Contact.findById(id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete(
  "/api/contacts/:id",
  (request, response, next) => {
    const id = request.params.id;

    Contact.findByIdAndDelete(id)
      .then((result) => {
        response.status(204).end();
      })
      .catch((error) => next(error));
  }
);

app.put("/api/contacts/:id", (request, response, next) => {
  console.log("PUT request received");
  const body = request.body;

  const contact = {
    name: body.name,
    number: body.number,
  };

  Contact.findByIdAndUpdate(request.params.id, contact, {
    new: true,
  })
    .then((updatedContact) => {
      response.json(updatedContact);
    })
    .catch((error) => next(error));
});

// Adding contacts
app.post("/api/contacts", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  /*
  // Make sure the name is unique.
  const nameExists = contacts.find((contact) => {
    return contact.name === body.name;
  });
  if (nameExists) {
    return response.status(400).json({
      error: "Name must be unique",
    });
  }

  // Make sure the number is unique.
  const numExists = contacts.find((contact) => {
    return contact.number === body.number;
  });
  if (numExists) {
    return response.status(400).json({
      error: "Number must be unique",
    });
  }
*/

  const newContact = new Contact({
    name: body.name,
    number: body.number,
  });

  newContact.save().then((savedContact) => {
    response.json(savedContact);
  });
});

app.get("/info", (request, response) => {
  const sendDate = new Date();
  response.send(`<h1>Info</h1>
  <hr/>
  <p>Contact list has info for ${contacts.length} contacts</p>
  <p>${sendDate}</p>
  `);
});

// Middleware
const unkownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unkownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response
      .status(400)
      .send({ error: "malformatted id" });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
