import { Collections } from "../../../../app.js"
import {v2 as cloudinary} from 'cloudinary';
import multer from "multer";
import { ObjectId as objectId } from "mongodb";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });


cloudinary.config({ 
  cloud_name: 'dawimxabt', 
  api_key: '296256911189299', 
  api_secret: '-hWal4lURXy04deHxhXTXtDVedU' 
});

const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let cursor;

    if (category && search) {
      // If both category and search are provided, filter by both conditions
      cursor = Collections.productsCollection.find({
        category: category,
        title: { $regex: search, $options: 'i' }, // Case-insensitive search
      });
    } else if (category) {
      // If only category is provided, filter by category
      cursor = Collections.productsCollection.find({ category: category });
    } else if (search) {
      // If only search is provided, filter by search term
      cursor = Collections.productsCollection.find({
        title: { $regex: search, $options: 'i' }, // Case-insensitive search
      });
    } else {
      // If neither category nor search is provided, retrieve all products
      cursor = Collections.productsCollection.find();
    }

    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};


  const getProductDetails = async (req, res) => {
    const id = req.params.id
    const query = {_id: new objectId(id)}
    const cursor = Collections.productsCollection.find(query)
    const result = await cursor.toArray()
      res.send(result)
  };
  
  const createProductCategory = async (req, res) => {
    const body = req.body;
    const { name } = body;
    if (!name.length > 0) {
      return res.status(400).json({ success: false, message: "Please provide all mandatory fields" });
    }
    try {
      // Insert new product
      body.totalCount = 0;
      const newProductCategory = await Collections.productCategoriesCollection.insertOne(body);
      res.status(201).json({ success: true, message: "New product category uploaded!"});
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

    const uploadToCloudinary = async (file) => {
      try {
        const result = await cloudinary.uploader.upload(file, { folder: 'Images' });
        // console.log('Upload successful:', result);
        return result.secure_url;
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
      }
    };
    
    const createProduct = async (req, res) => {
      const body = req.body;
      
      const { title, description, prices, images, category } = body;
      if ((!title.length || !description.length || !prices.length ) > 0) {
        return res.status(400).json({ success: false, message: "Please provide all mandatory fields" });
      }else if(category === undefined) {
        return res.status(400).json({ success: false, message: "Please provide all mandatory fields" });
      }
      try {
          // Insert new product
          const newProduct = await Collections.productsCollection.insertOne(body);
          const productId = newProduct.insertedId;
        
          //Update totalCount of the respective product category
          const productCategoryToUpdate = await Collections.productCategoriesCollection.findOne(
          { name: category },
          );
           await Collections.productCategoriesCollection.updateOne(
          { name: category },
          { $set: { totalCount: productCategoryToUpdate.totalCount + 1 } }
          );
          // Upload images to Cloudinary
          let imageList = [];
          if (images && images.length > 0) {
          const uploadPromises = images.map(async (image) => {
            const imageUrl = await uploadToCloudinary(image.dataURL);
            imageList.push(imageUrl);
            return imageUrl;
          });
    
          const uploadedImages = await Promise.all(uploadPromises);
          // Update product with uploaded image URLs
          await Collections.productsCollection.updateOne(
            { _id: productId },
            { $set: { images: uploadedImages } }
          );
          }
    
          res.status(201).json({ success: true, message: "New product uploaded!", productId });
      } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    };
    
 const deleteProduct = async (req, res) => {
    const id = req.params.id;
    const query = {_id: new objectId(id)}

    //Update totalCount of the respective product category
    const productToDelete = await Collections.productsCollection.findOne(query);
    const productCategoryToUpdate = await Collections.productCategoriesCollection.findOne(
      { name: productToDelete.category },
      );
       await Collections.productCategoriesCollection.updateOne(
      { name: productToDelete.category },
      { $set: { totalCount: productCategoryToUpdate.totalCount - 1 } }
      );
    const result = await Collections.productsCollection.deleteOne(query)
    res.send(result)
    }

export const ProductController = { getProducts, getProductDetails, createProduct, createProductCategory, deleteProduct };
