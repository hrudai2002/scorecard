import express from "express"; 
import { loginUser, registerUser } from "../controllers/user.controller";

const router = express.Router();
router.post('/register', registerUser); 
router.put('/login', loginUser);

export default router;
