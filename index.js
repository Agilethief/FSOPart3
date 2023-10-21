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

let contacts = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  // Generate based on a large random number
  newID = Math.random() * 1000000000; // Make a real big number
  newID = Math.floor(newID); // Round down to nearest number
  return newID;

  // Generate based on length of array
  /*
  const maxId =
    contacts.length > 0
      ? Math.max(...contacts.map((n) => n.id))
      : 0;
  return maxId + 1;
  */
};

// Routes

app.get("/", (request, response) => {
  response.json(contacts);
});

app.get("/api/contacts", (request, response) => {
  response.json(contacts);
});

app.get("/api/contacts/:id", (request, response) => {
  const id = Number(request.params.id);
  const contact = contacts.find(
    (contact) => contact.id === id
  );
  if (contact) {
    response.json(contact);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/contacts/:id", (request, response) => {
  const id = Number(request.params.id);

  // Find the contact with the id
  const contact = contacts.find(
    (contact) => contact.id === id
  );

  if (contact) {
    contacts = contacts.filter(
      (contact) => contact.id !== id
    );

    response.status(204).end();
  } else {
    response.status(404).end();
  }
});

// Adding contacts
app.post("/api/contacts", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "content missing",
    });
  }

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

  const contact = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  contacts = contacts.concat(contact);

  response.json(contact);
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
