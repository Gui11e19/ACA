const mongoose = require("mongoose"); // se requiere de moongose
const Schema = mongoose.Schema;
//Schema for products, keeps all their descriptions
const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  price: {
    type: Number,
    min: 0,
  },
  description: {
    type: String,
  },
  img_key: {
    type: String,
  },
});

// Exportando el schema de productos
module.exports = mongoose.model("product", ProductSchema);
