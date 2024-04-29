import express from 'express'; 
import { createMatch, getFinishedMatches, getLiveMatches, getMatchDetails } from '../controllers/badmintion.controller';

const router = express.Router();
router.get('/live', getLiveMatches);
router.get('/finished', getFinishedMatches);
router.get('/:matchId', getMatchDetails);
router.post('/create', createMatch);

export default router; 
