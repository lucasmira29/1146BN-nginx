import express from 'express';
import pacienteController from '../controllers/pacienteController.js';

const router = express.Router();

router.get("/", (req, res) => pacienteController.listarPacientes(req, res));
router.get("/:id", (req, res) => pacienteController.listarPacienteById(req, res));
router.post("/", (req, res) => pacienteController.cadastrarPaciente(req, res));
router.put("/:id", (req, res) => pacienteController.updatePaciente(req, res));
router.delete("/:id", (req, res) => pacienteController.deletePaciente(req, res));


export default router;
