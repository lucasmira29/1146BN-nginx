import horarioMedicoService from '../services/horarioMedicoService.js';

class HorarioMedicoController {

  static async criarHorario(req, res) {
    try {
      const { medico_id, start_time, end_time } = req.body;

      if (!medico_id || !start_time || !end_time) {
        return res
          .status(400)
          .json({ message: 'Campos obrigatórios faltando.' });
      }

      const data = {
        medico_id,
        start_time, 
        end_time,  
      };

      const horario = await horarioMedicoService.create(data);
      res.status(201).json({ message: 'Horário criado com sucesso!', horario });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async listarHorarios(req, res) {
    try {
      const horarios = await horarioMedicoService.getAll();
      return res.status(200).json(horarios);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async listarHorarioMedicoId(req, res) {
    try {
      const { id } = req.params;
      const horario = await horarioMedicoService.getById(Number(id));
      if (!horario) {
        return res.status(200).json([]);
      }
      res.status(200).json(horario);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async atualizarHorario(req, res) {
    try {
      const { id } = req.params;
      const { medico_id, start_time, end_time } = req.body;

      const data = {
        medico_id,
        start_time,
        end_time,
      };

      const horario = await horarioMedicoService.update(id, data);
      if (!horario) {
        return res.status(404).json({ message: 'Erro ao atualizar horário.' });
      }
      res.status(200).json({ message: 'Horário atualizado com sucesso!', horario });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deletarHorario(req, res) {
    try {
      const { id } = req.params;
      const deletado = await horarioMedicoService.delete(id);
      if (!deletado) {
        return res.status(404).json({ message: 'Erro ao deletar Horário' });
      }
      return res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default HorarioMedicoController;