const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const actorSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    birthday: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Actor", actorSchema);
