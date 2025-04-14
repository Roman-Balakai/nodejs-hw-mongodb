import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginSchema, registerSchema } from '../validation/auth.js';
import { loginController, logoutController, refreshController, registerController } from '../controllers/auth.js';

const router = express.Router();
const jsonParse = express.json();

router.post('/register', jsonParse, validateBody(registerSchema), ctrlWrapper(registerController));

router.post('/login', jsonParse, validateBody(loginSchema), ctrlWrapper(loginController));

router.post('/logout', ctrlWrapper(logoutController));

router.post('/refresh', ctrlWrapper(refreshController));

export default router;
