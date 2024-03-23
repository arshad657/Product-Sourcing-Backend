import express from 'express';
import { ProductCategoriesController } from './ProductCategoriesController.js';

const router = express.Router();

router.get('/', ProductCategoriesController.getProductCategories);
router.delete('/delete/:id', ProductCategoriesController.deleteProductCategory);


export const ProductCategoriesRoutes = router;