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
    const cursor = Collections.productsCollection.find()
    const result = await cursor.toArray()
      res.send(result)
  }
  const getProductDetails = async (req, res) => {
    const id = req.params.id
    const query = {_id: new objectId(id)}
    const cursor = Collections.productsCollection.find(query)
    const result = await cursor.toArray()
      res.send(result)
  };
  
  const createProductCategory = async (req, res) => {
    const body = req.body;
    console.log(body)
    const { name } = body;
    if (!name.length > 0) {
      return res.status(400).json({ success: false, message: "Please provide all mandatory fields" });
    }
    try {
      // Insert new product
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
      const { title, description, prices, images } = body;
      if ((!title.length || !description.length || !prices.length) > 0) {
        return res.status(400).json({ success: false, message: "Please provide all mandatory fields" });
      }
    
      try {
        // Insert new product
        const newProduct = await Collections.productsCollection.insertOne(body);
        const productId = newProduct.insertedId;
    
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
    const result = await Collections.productsCollection.deleteOne(query)
    res.send(result)
    }

export const ProductController = { getProducts, getProductDetails, createProduct, createProductCategory, deleteProduct };
