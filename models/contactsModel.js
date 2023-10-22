// Mongoose setup
const mongoose = require("mongoose");

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
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
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
