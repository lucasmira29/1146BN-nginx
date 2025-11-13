import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get("/", (req, res) => userController.listarUsuarios(req, res));
router.get("/:id", (req, res) => userController.listarUsuarioPorId(req, res));
router.put("/admin/:id", (req, res) => userController.atualizarAdmin(req, res));
router.post('/login', (req, res) => userController.login(req, res));

export default router;