import express from 'express';
import { ProductRoutes } from '../modules/products/ProductRoutes.js';

const router = express.Router();

let moduleRoutes = [
    {
      path: "/products",
      routes: ProductRoutes
    }
  ];

// Define a middleware function
moduleRoutes.forEach(route => router.use(route.path, route.routes));
  
export default router;