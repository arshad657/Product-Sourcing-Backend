// import { Collections } from "../../../../app.js"

import { ObjectId } from "mongodb";
import { Collections } from "../../../../app.js";

const getProductCategories = async (req, res) => {
  const cursor = Collections.productCategoriesCollection.find()
  const result = await cursor.toArray()
    res.send(result)
  }

  const deleteProductCategory = async (req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    
    const productCategoryToDelete = await Collections.productCategoriesCollection.findOne(query);
    if (productCategoryToDelete.totalCount > 0) {
      return res.status(500).json({ success: false, message: "Please delete all the product of this categories first" });
    }
    //Update totalCount of the respective product category
    const result = await Collections.productCategoriesCollection.deleteOne(query)
    res.send(result)
    }
    
export const ProductCategoriesController = { getProductCategories, deleteProductCategory };
