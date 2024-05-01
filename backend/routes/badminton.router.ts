import express from 'express'; 
import { createMatch, getFinishedMatches, getLiveMatches, getMatchDetails, updateScore } from '../controllers/badminton.controller';

const router = express.Router();
router.get('/live', getLiveMatches);
router.get('/finished', getFinishedMatches);
router.get('/:matchId', getMatchDetails);
router.post('/create', createMatch);
router.put('/updatescore', updateScore);

export default router; 
