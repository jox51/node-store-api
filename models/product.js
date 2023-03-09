//import mongoose
const mongoose = require("mongoose")

// define schema which will then be used to interact with db
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "product name must be provided"]
  },
  price: {
    type: Number,
    required: [true, "product price must be provided"]
  },
  featured: {
    type: Boolean,
    deafault: false
  },
  rating: {
    type: Number,
    default: 4.5
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  company: {
    type: String,
    enum: {
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: "{VALUE} is not supported"
    }
  }
})

// export schema, name in string will be used to access the object
module.exports = mongoose.model("Product", productSchema)
