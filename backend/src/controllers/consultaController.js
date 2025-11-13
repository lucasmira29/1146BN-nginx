import consultaService from '../services/consultaService.js';

class consultaController {

  static async agendar(req, res) {
    try {
      const { paciente_id, medico_id, date_time, status, description } = req.body;


      if (!paciente_id || !medico_id || !date_time || !status) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando' });
      }

      const conflito = await consultaService.existeConflitoHorario(medico_id, date_time);
     
      if (conflito) {
        return res.status(409).json({ message: 'Já existe uma consulta agendada com este médico nesse horário.' });
      }

      const consulta = await consultaService.agendarConsulta({
        paciente_id,
        medico_id,
        date_time,
        status,
        description,
      });

      res.status(201).json({ message: 'Consulta agendada', consulta });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao agendar consulta', error });
      console.error(error);
    }
  }

  static async listarTodas(req, res) {
    try {
      const filtros = req.query;
      const consultas = await consultaService.listarConsultas(filtros);

      res.status(200).json(consultas);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar consultas', error });
      console.error(error);
    }
  }

  static async listarPorId(req, res) {
    try {
      const { id } = req.params;
      const consulta = await consultaService.listarConsultaPorId(id);

      if (!consulta) {
        return res.status(404).json({ message: 'Consulta não encontrada' });
      }


      res.status(200).json(consulta);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar consulta', error });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;


      const consulta = await consultaService.atualizarConsulta(id, data);
      res.status(200).json({ message: 'Consulta atualizada', consulta });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar consulta', error });
    }
  }

  static async deletar(req, res) {
    try {
      const { id } = req.params;
      await consultaService.deletarConsulta(id);

      res.status(200).json({ message: 'Consulta deletada com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar consulta', error });
    }
  }
}

export default consultaController;
