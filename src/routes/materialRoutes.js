import express from 'express';
import {
  createMaterial,
  getAllMaterials,
  getMaterialsByEmail,
  deleteMaterial,
  updateMaterial,
} from '../controllers/materialController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createMaterial);
router.get('/', getAllMaterials);
router.get('/:email', verifyToken, getMaterialsByEmail);
router.delete('/:id', deleteMaterial);
router.patch('/:id', updateMaterial);

export default router;
