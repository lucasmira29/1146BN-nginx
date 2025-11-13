import { Router } from 'express';
import pacienteRoutes from './pacienteRoutes.js';
import userRoutes from './userRoutes.js';
import medicoRoutes from './medicoRoutes.js';
import recepcionistaRoutes from './recepcionistaRoutes.js';
import consultaRoutes from './consultaRoutes.js';
import horarioMedicoRoutes from './horarioMedicoRoutes.js';
import registroMedicoRoutes from './registroMedicoRoutes.js';

const router = Router();

router.use("/pacientes", pacienteRoutes);
router.use("/usuarios", userRoutes);
router.use("/medicos", medicoRoutes);
router.use("/recepcionistas", recepcionistaRoutes);
router.use("/consultas", consultaRoutes);
router.use("/horarios", horarioMedicoRoutes);
router.use("/registros-medicos", registroMedicoRoutes);

export default router;
