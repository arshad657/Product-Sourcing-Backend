import express from 'express';
import { ProductCategoriesController } from './ProductCategoriesController.js';

const router = express.Router();

router.get('/', ProductCategoriesController.getProductCategories);


export const ProductCategoriesRoutes = router;