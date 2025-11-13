import express from 'express';
import HorarioMedicoController from '../controllers/horarioMedicoController.js';
import HorarioDisponivelController from '../controllers/horarioDisponivelController.js';

const router = express.Router();


router.get('/disponivel/:medicoId', (req, res) => HorarioDisponivelController.listar(req, res));
router.get('/medico/:id', (req, res) => HorarioMedicoController.listarHorarioMedicoId(req, res));
router.get('/', (req, res) => HorarioMedicoController.listarHorarios(req, res));
router.post('/', (req, res) => HorarioMedicoController.criarHorario(req, res));
router.put('/:id', (req, res) => HorarioMedicoController.atualizarHorario(req, res));
router.delete('/:id', (req, res) => HorarioMedicoController.deletarHorario(req, res));

export default router;
