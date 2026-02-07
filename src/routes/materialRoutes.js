import express from 'express';
import {
  createMaterial,
  getAllMaterials,
  getMaterialsByEmail,
  deleteMaterial,
  updateMaterial,
  getMaterialById,
  getMaterialsBySessionId,
  getStudentMaterials,
} from '../controllers/materialController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createMaterial);
router.get('/', getAllMaterials);
// Specific routes first to avoid param conflicts
router.get('/material/:id', getMaterialById);
router.get('/session/:sessionId', getMaterialsBySessionId);
router.get('/student/:email', getStudentMaterials);
router.get('/:email', verifyToken, getMaterialsByEmail);
router.delete('/:id', deleteMaterial);
router.patch('/:id', updateMaterial);

export default router;
