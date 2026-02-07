import express from 'express';
import {
  createUser,
  getAllUsers,
  getSingleTutor,
  updateUserRole,
  getAllTutors,
  updateUserProfile,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/singletutor', getSingleTutor);
router.patch('/:id', updateUserRole);
router.get('/tutor', getAllTutors);
router.patch('/profile/:id', updateUserProfile);

export default router;
