import { Collections } from "../../../../app.js"

 const getProducts = async (req, res) => {
    const cursor = Collections.productsCollection.find()
    const result = await cursor.toArray()
      res.send(result)
    }

export const ProductController = { getProducts };
