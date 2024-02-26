import { AdminController } from './AdminController.js';
import express from 'express';

const router = express.Router();

router.get('/', AdminController.getAdmins);
router.post('/create', AdminController.createAdmin);


export const AdminRoutes = router;