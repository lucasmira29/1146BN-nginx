import express from 'express';
import registroMedicoController from '../controllers/registroMedicoController.js';

const router = express.Router();

router.post('/', registroMedicoController.criar);
router.put('/:id', registroMedicoController.atualizar);
router.get('/consultas/:consultaId', registroMedicoController.buscarPorConsulta);
router.get('/pacientes/:pacienteId', registroMedicoController.listarPorPaciente);

export default router;
