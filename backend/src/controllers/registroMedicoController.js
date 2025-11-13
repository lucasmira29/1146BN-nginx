import registroMedicoService from "../services/registroMedicoService.js";

class registroMedicoController {
  static async criar(req, res) {
    try {
      const { consulta_id, medico_id, paciente_id, observacoes, diagnostico, tratamento } = req.body;

      if (!consulta_id || !medico_id || !paciente_id) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando' });
      }

      const registro = await registroMedicoService.criarRegistro({
        consulta_id,
        medico_id,
        paciente_id,
        observacoes,
        diagnostico,
        tratamento,
      });

      res.status(201).json({ message: 'Registro médico criado', registro });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar registro médico', error });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      const registro = await registroMedicoService.atualizarRegistro(id, data);
      res.status(200).json({ message: 'Registro médico atualizado', registro });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar registro médico', error });
    }
  }

  static async buscarPorConsulta(req, res) {
    try {
      const { consultaId } = req.params;
      const registro = await registroMedicoService.buscarPorConsulta(consultaId);

      if (!registro) {
        return res.status(404).json({ message: 'Registro não encontrado' });
      }

      res.status(200).json(registro);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar registro médico', error });
    }
  }

  static async listarPorPaciente(req, res) {
    try {
      const { pacienteId } = req.params;
      const registros = await registroMedicoService.listarPorPaciente(Number(pacienteId));

      res.status(200).json(registros);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar registros médicos do paciente', error });
    }
  }
}

export default registroMedicoController;
