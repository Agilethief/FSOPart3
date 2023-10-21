const http = require("http");
const express = require("express");
const app = express();
app.use(express.json());

const PORT = 3001;

let notes = [
  {
    id: 1,
    content: "This is in a file",
    important: true,
  },
  {
    id: 2,
    content: "The file is pulled into js and read out here",
    important: false,
  },
  {
    id: 3,
    content:
      "Breaking it up into multiple files is helpful",
    important: true,
  },
  {
    id: 4,
    content: "This is in a file",
    important: true,
  },
];

const generateId = () => {
  const maxId =
    notes.length > 0
      ? Math.max(...notes.map((n) => n.id))
      : 0;
  return maxId + 1;
};

app.get("/", (request, response) => {
  response.json(notes);
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

app.listen(PORT);
console.log(`Server running on port ${PORT}`);
