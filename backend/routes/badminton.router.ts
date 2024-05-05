import express from 'express'; 
import { createMatch, getFinishedMatches, getLiveMatches, getMatchDetails, updateScore } from '../controllers/badminton.controller';
import { authMiddleWare } from '../middlewares/auth.middleware';

const router = express.Router();
router.get('/live', authMiddleWare, getLiveMatches);
router.get('/finished', getFinishedMatches);
router.get('/:matchId', getMatchDetails);
router.post('/create', createMatch);
router.put('/updatescore', updateScore);

export default router; 
