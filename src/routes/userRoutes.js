import express from 'express';
import {
  createUser,
  getAllUsers,
  getSingleTutor,
  updateUserRole,
  getAllTutors,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/singletutor', getSingleTutor);
router.patch('/:id', updateUserRole);
router.get('/tutor', getAllTutors);

export default router;
