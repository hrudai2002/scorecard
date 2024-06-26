import express from 'express'; 
import { createMatch, getFinishedMatches, getLiveMatches, getMatchDetails, getMatchSummary, getMatchTeamDetails, updateScore } from '../controllers/common.controller';
import { authMiddleWare } from '../middlewares/auth.middleware';

const router = express.Router();
router.get('/live', authMiddleWare, getLiveMatches);
router.get('/finished', authMiddleWare, getFinishedMatches);
router.get('/:matchId', authMiddleWare, getMatchDetails);
router.get('/teams/:matchId', authMiddleWare, getMatchTeamDetails);
router.get('/summary/:matchId', authMiddleWare, getMatchSummary);
router.post('/create', authMiddleWare, createMatch);
router.put('/update/score', authMiddleWare, updateScore);

export default router; 
