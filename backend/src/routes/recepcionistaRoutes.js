import express from 'express';
import recepcionistaController from '../controllers/recepcionistaController.js';

const router = express.Router();

router.post('/', (req, res) => recepcionistaController.cadastrarRecepcionista(req, res));
router.get('/', (req, res) => recepcionistaController.listarRecepcionistas(req, res));
router.get('/:id', (req, res) => recepcionistaController.listarRecepcionistaById(req, res));
router.put('/:id', (req, res) => recepcionistaController.updateRecepcionista(req, res));
router.delete('/:id', (req, res) => recepcionistaController.deleteRecepcionista(req, res));

export default router;
