require("dotenv").config()

const connectDB = require("./db/connect")
const Product = require("./models/product")

const jsonProducts = require("./products.json")

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    await Product.deleteMany()
    await Product.create(jsonProducts)
    console.log("load init product success connect")
    // pass 0 to show exit with success
    process.exit(0)
  } catch (error) {
    console.log(error)
    // pass one to show exit with error
    process.exit(1)
  }
}

start()
