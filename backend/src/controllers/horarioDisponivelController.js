// 1146BN-nginx/backend/src/controllers/horarioDisponivelController.js

import horarioMedicoService from "../services/horarioMedicoService.js";

class HorarioDisponivelController {
  static async listar(req, res) {
    try {
      const { medicoId } = req.params;
      const { data } = req.query;

      if (!medicoId || !data) {
        return res.status(400).json({ message: 'medicoId e data são obrigatórios' });
      }

      // MUDANÇA: Removido Number()
      const horarios = await horarioMedicoService.getHorariosDisponiveis(medicoId, data);

      res.status(200).json({ data, horarios });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar horários disponíveis', error: err.message });
    }
  }
}

export default HorarioDisponivelController;