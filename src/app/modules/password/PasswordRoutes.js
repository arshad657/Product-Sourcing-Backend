import { PasswordController } from './PasswordController.js';
import express from 'express';

const router = express.Router();

router.patch('/', PasswordController.changePassword);


export const PasswordRoutes = router;