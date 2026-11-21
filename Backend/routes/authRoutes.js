import express from 'express';
import { getUsers, signupUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.get('/users', getUsers);
router.post('/auth/signup', signupUser);
router.post('/auth/login', loginUser);

export default router;
