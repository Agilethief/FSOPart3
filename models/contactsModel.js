// Mongoose setup
const mongoose = require("mongoose");

const password = process.argv[2];
//console.log("password:", password);

//  `mongodb+srv://tbermansedermongodb:${password}@cluster0.cq9y0fn.mongodb.net/contactApp?retryWrites=true&w=majority`;
const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log(
      "error connecting to MongoDB:",
      error.message
    );
  });
// End mongoose setup

// Establish the note schema and model
const contactSchema = new mongoose.Schema({
  name: String,
  number: String, // We use a string here so we can format numbers as XXX-XXX-XXXX
});
contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const contactModel = mongoose.model(
  "Contact",
  contactSchema
);

module.exports = mongoose.model("Contact", contactSchema);
