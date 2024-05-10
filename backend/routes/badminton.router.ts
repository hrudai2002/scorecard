import express from 'express'; 
import { createMatch, getFinishedMatches, getLiveMatches, getMatchDetails, getMatchSummary, updateScore } from '../controllers/badminton.controller';
import { authMiddleWare } from '../middlewares/auth.middleware';

const router = express.Router();
router.get('/live', authMiddleWare, getLiveMatches);
router.get('/finished', authMiddleWare, getFinishedMatches);
router.get('/:matchId', authMiddleWare, getMatchDetails);
router.get('/summary/:matchId', authMiddleWare, getMatchSummary);
router.post('/create', authMiddleWare, createMatch);
router.put('/update/score', authMiddleWare, updateScore);

export default router; 
