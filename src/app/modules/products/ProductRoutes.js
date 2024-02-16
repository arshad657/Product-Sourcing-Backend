import { ProductController } from './ProductController.js';
import express from 'express';

const router = express.Router();

router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductDetails);
router.post('/upload', ProductController.createProduct);
router.delete('/delete/:id', ProductController.deleteProduct);

export const ProductRoutes = router;