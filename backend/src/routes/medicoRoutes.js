import express from 'express';
import medicoController from '../controllers/medicoController.js';

const router = express.Router();

router.get("/", (req, res) => medicoController.listarMedicos(req, res));
router.get("/:id", (req, res) => medicoController.listarMedicoById(req, res));
router.post("/", (req, res) => medicoController.cadastrarMedico(req, res));
router.put("/:id", (req, res) => medicoController.updateMedico(req, res));
router.delete("/:id", (req, res) => medicoController.deleteMedico(req, res));


export default router;
