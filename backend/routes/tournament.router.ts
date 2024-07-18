import express from 'express';
import { authMiddleWare } from '../middlewares/auth.middleware';
import { createTournament, getAllTournaments } from '../controllers/tournament.controller';

const router = express.Router();
router.get('', getAllTournaments);
router.post('/create', authMiddleWare, createTournament);


export default router;