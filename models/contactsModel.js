// Mongoose setup
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then(() => {
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
  number: {
    type: String, // We use a string here so we can format numbers as XXX-XXX-XXXX
    minLength: 8,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{2,4}-\d{3,4}-\d{3,4}/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid phone number!, you must use the format {2,4}-{3,4}-{3,4}`,
    },
  },
});
contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Contact", contactSchema);
