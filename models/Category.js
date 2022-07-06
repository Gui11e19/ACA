const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Schema for Categories
const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("category", CategorySchema);
