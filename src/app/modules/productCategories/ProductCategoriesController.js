// import { Collections } from "../../../../app.js"

import { Collections } from "../../../../app.js";

const getProductCategories = async (req, res) => {
  const cursor = Collections.productCategoriesCollection.find()
  const result = await cursor.toArray()
    res.send(result)
  }
    
export const ProductCategoriesController = { getProductCategories };
