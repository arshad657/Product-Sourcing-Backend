import { ProductController } from './ProductController.js';
import express from 'express';

const router = express.Router();

router.get('/', ProductController.getProducts);

export const ProductRoutes = router;