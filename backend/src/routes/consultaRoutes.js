import express from 'express';
import consultaController from '../controllers/consultaController.js';
// import { formatDateTimeFields } from '../middlewares/formatDateMiddleware.js';

const router = express.Router();

router.post('/', consultaController.agendar);
router.get('/', consultaController.listarTodas);
router.get('/:id', consultaController.listarPorId);
router.put('/:id', consultaController.atualizar);
router.delete('/:id', consultaController.deletar);

export default router;
