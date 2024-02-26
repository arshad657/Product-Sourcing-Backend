import express from 'express';
import { ProductRoutes } from '../modules/products/ProductRoutes.js';
import { PasswordRoutes } from '../modules/password/PasswordRoutes.js';
import { ProductCategoriesRoutes } from '../modules/productCategories/ProductCategoriesRoutes.js';
import { AdminRoutes } from '../modules/admins/AdminRoutes.js';

const router = express.Router();

let moduleRoutes = [
    {
      path: "/products",
      routes: ProductRoutes
    },
    {
      path: "/change-password",
      routes: PasswordRoutes
    },
    {
      path: "/product-categories",
      routes: ProductCategoriesRoutes
    },
    {
      path: "/admins",
      routes: AdminRoutes
    },
  ];

// Define a middleware function
moduleRoutes.forEach(route => router.use(route.path, route.routes));
  
export default router;