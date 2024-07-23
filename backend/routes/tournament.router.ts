import express from 'express';
import { authMiddleWare } from '../middlewares/auth.middleware';
import { createTournament, getAllTournaments, getTournamentMatches, moveMatchToLive } from '../controllers/tournament.controller';

const router = express.Router();
router.get('', getAllTournaments);
router.get('/:id', getTournamentMatches);
router.post('/create', authMiddleWare, createTournament);
router.put('/movetolive', authMiddleWare, moveMatchToLive);


export default router;