// import { Collections } from "../../../../app.js"

import { Collections } from "../../../../app.js";

const getProductCategories = async () => {
  const cursor = Collections.productsCollection.find()
  const result = await cursor.toArray()
    res.send(result)
  }
    
export const ProductCategoriesController = { getProductCategories };
