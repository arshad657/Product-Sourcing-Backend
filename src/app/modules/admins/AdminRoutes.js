import { AdminController } from './AdminController.js';
import express from 'express';

const router = express.Router();

router.get('/', AdminController.getAdmins);
router.post('/create', AdminController.createAdmin);
router.post('/login', AdminController.login);
router.delete('/delete/:id', AdminController.deleteAdmin);


export const AdminRoutes = router;