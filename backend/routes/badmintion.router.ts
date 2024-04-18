import express from 'express'; 
import { createMatch, getLiveMatches } from '../controllers/badmintion.controller';

const router = express.Router();
router.get('/live', getLiveMatches);
router.post('/create', createMatch);

export default router; 
