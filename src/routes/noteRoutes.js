import express from 'express';
import {
  createNote,
  getNotesByEmail,
  deleteNote,
  updateNote,
} from '../controllers/noteController.js';

const router = express.Router();

router.post('/', createNote);
router.get('/:email', getNotesByEmail);
router.delete('/:id', deleteNote);
router.patch('/:id', updateNote);

export default router;
