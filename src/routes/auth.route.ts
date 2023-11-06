import express, { Router } from 'express';
import { createUser, forgotPassword, loginUser, resetPassword } from '../controllers/auth.controller';
import { checkUsernameOrEmail } from '../middlewares/verify-signup';

const router: Router = express.Router();

router.post('/signup', checkUsernameOrEmail, createUser)
      .post('/signin', loginUser)
      .post('/reset-password', resetPassword)
      .post('/forgot-password', forgotPassword);

export default router;