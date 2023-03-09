// import model/schema to initiate actions
const Product = require("../models/product")

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).select("name price")
  res.status(200).json({ products })
}

const getAllProducts = async (req, res) => {
  // better to destructure object you want from req.query
  // any unwanted query string are ignored and if nothing is passed, will return all items since queryObj will be empty
  const { featured, company, name, sort, fields, numericFilters } = req.query
  const queryObj = {}
  if (featured) {
    queryObj.featured = featured === "true" ? true : false
  }
  if (company) {
    queryObj.company = company
  }
  if (name) {
    // regex options from Mongoose for case insensitive search
    queryObj.name = { $regex: name, $options: "i" }
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte"
    }
    const regEx = /\b(<|>|<=|>=|=)\b/g
    let filters = numericFilters.replace(regEx, (match) => {
      return `-${operatorMap[match]}-`
    })

    const options = ["price", "rating"]
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-")
      if (options.includes(field)) {
        queryObj[field] = { [operator]: Number(value) }
      }
    })
  }
  console.log(queryObj)
  let result = Product.find(queryObj)

  // sort functionality
  if (sort) {
    const sortList = sort.split(",").join(" ")
    result = result.sort(sortList)
  } else {
    result = result.sort("createdAt")
  }

  //select option, User chooses what options to view
  if (fields) {
    const fieldsList = fields.split(",").join(" ")
    result = result.select(fieldsList)
  }

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit
  result = result.skip(skip).limit(limit)

  // results of the API after user selects parameters
  const products = await result
  res.status(200).json({ products, nbHits: products.length })
}

module.exports = {
  getAllProductsStatic,
  getAllProducts
}
