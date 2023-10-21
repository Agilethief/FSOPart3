// For FSO Excercise 3.12+
const mongoose = require("mongoose");

const argCount = process.argv.length;

// Establish the note schema and model
const contactSchema = new mongoose.Schema({
  name: String,
  number: String, // We use a string here so we can format numbers as XXX-XXX-XXXX
});

const contactModel = mongoose.model(
  "Contact",
  contactSchema
);

// Functions for interacting with the DB
function displayContacts() {
  contactModel.find({}).then((result) => {
    console.log("Presenting list of contacts");
    console.log("Phonebook:");
    result.forEach((contact) => {
      console.log(contact.name, contact.number);
    });
    mongoose.connection.close();
  });
}

function addContact(nameToAdd, numberToAdd) {
  const newContact = new contactModel({
    name: nameToAdd,
    number: numberToAdd,
  });
  newContact.save().then((result) => {
    console.log("Contact saved!");
    console.log("New contact:", result.name, result.number);
    mongoose.connection.close();
  });
}

function SetupConnection() {
  const password = process.argv[2];

  const url = `mongodb+srv://tbermansedermongodb:${password}@cluster0.cq9y0fn.mongodb.net/contactApp?retryWrites=true&w=majority`;

  mongoose.set("strictQuery", false);
  mongoose.connect(url);
}

if (argCount < 3) {
  console.log("Give password as argument");
  process.exit(1);
}
SetupConnection();

if (argCount === 3) {
  displayContacts();
} else if (argCount === 5) {
  addContact(process.argv[3], process.argv[4]);
} else {
  console.log(
    "Invalid number of arguments. Must be three to see contacts, five to add a contact."
  );
  process.exit(1);
}
