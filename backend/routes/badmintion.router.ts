import express from 'express'; 
import { createMatch, getFinishedMatches, getLiveMatches } from '../controllers/badmintion.controller';

const router = express.Router();
router.get('/live', getLiveMatches);
router.get('/finished', getFinishedMatches);
router.post('/create', createMatch);

export default router; 
