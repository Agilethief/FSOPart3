require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const Contact = require("./models/contactsModel");

// https://github.com/expressjs/morgan
morgan.token("body", (request) => {
  //return request.body;
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  }
  return "";
});

app.use(express.static("dist"));
app.use(express.json());
app.use(morgan(":method :url :response-time ms :body"));

// Routes

app.get("/", (request, response) => {
  response.json(Contact);
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
      .then(() => {
        response.status(204).end();
      })
      .catch((error) => next(error));
  }
);

app.put("/api/contacts/:id", (request, response, next) => {
  console.log("PUT request received");
  const { name, number } = request.body;

  Contact.findByIdAndUpdate(
    request.params.id,
    { name, number },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  )
    .then((updatedContact) => {
      response.json(updatedContact);
    })
    .catch((error) => next(error));
});

// Adding contacts
app.post("/api/contacts", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
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

  newContact
    .save()
    .then((savedContact) => {
      response.json(savedContact);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  const sendDate = new Date();
  response.send(`<h1>Info</h1>
  <hr/>
  <p>Contact list has info for ${Contact.length} contacts</p>
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
  } else if (error.name === "ValidationError") {
    return response
      .status(400)
      .json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
