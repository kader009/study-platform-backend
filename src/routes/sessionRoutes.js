import express from 'express';
import {
  getAllSessions,
  createSession,
  getApprovedSessions,
  getApprovedSessionsByEmail,
  getSessionById,
  deleteSession,
  approveSession,
  getSessionsByTutorEmail,
  updateSessionFee,
} from '../controllers/sessionController.js';

const router = express.Router();

router.get('/', getAllSessions);
router.post('/', createSession);
router.get('/approved', getApprovedSessions);
router.get('/approved/:email', getApprovedSessionsByEmail);
router.get('/email/:email', getSessionsByTutorEmail);
router.get('/:id', getSessionById);
router.delete('/:id', deleteSession);
router.patch('/approve/:id', approveSession);
router.patch('/:id', updateSessionFee);

export default router;
