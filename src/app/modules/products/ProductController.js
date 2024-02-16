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
    }

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
  // const x = await uploadToCloudinary(body.images.dataURL)
    // const imageList = newProduct.images;
    let imageList = []
    const uploadPromises = body?.images?.map(async (image) => {
      const imageUrl = await uploadToCloudinary(image.dataURL);
      imageList.push(imageUrl);
      return imageUrl;
    });

    const uploadedImages = await Promise?.all(uploadPromises);
    body.images = uploadedImages;
    console.log(body)
    const newProduct = Collections.productsCollection.insertOne(body);
    console.log(newProduct)
    res.status(201, body).json({success: true, msg: "New product uploaded!"});
  

    // const result = await cursor.toArray()
    //   res.send(result)
    }
 const deleteProduct = async (req, res) => {
    const id = req.params.id;
    const query = {_id: new objectId(id)}
    const result = await Collections.productsCollection.deleteOne(query)
    res.send(result)
    }

export const ProductController = { getProducts, getProductDetails, createProduct, deleteProduct };
