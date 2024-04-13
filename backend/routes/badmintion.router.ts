import express from 'express'; 
import { createMatch } from '../controllers/badmintion.controller';

const router = express.Router();
router.post('/create', createMatch);

export default router; 
