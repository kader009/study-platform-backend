import express from 'express';
import {
  bookSession,
  getBookedSessionsByEmail,
  getBookedSessionById,
} from '../controllers/bookedController.js';

const router = express.Router();

router.post('/', bookSession);
router.get('/:email', getBookedSessionsByEmail);
router.get('/:id', getBookedSessionById);

export default router;
