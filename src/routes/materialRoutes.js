import express from 'express';
import {
  createMaterial,
  getAllMaterials,
  getMaterialsByEmail,
  deleteMaterial,
  updateMaterial,
  getMaterialById,
  getStudentMaterials
} from '../controllers/materialController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createMaterial);
router.get('/', getAllMaterials);
router.get('/:email', verifyToken, getMaterialsByEmail);
router.delete('/:id', deleteMaterial);
router.patch('/:id', updateMaterial);
router.get('/material/:id', getMaterialById);
router.get('/student/:email', verifyToken, getStudentMaterials);

export default router;
