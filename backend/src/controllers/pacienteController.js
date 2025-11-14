// 1146BN-nginx/backend/src/controllers/pacienteController.js

import pacienteService from '../services/pacienteService.js';

class pacienteController {
  static async cadastrarPaciente(req, res) {
    try {
      const {
        name,
        document,
        birthdate,
        phone,
        postal_code,
        email,
        history,
      } = req.body;

      if (
        !name ||
        !document ||
        !birthdate ||
        !phone ||
        !postal_code ||
        !email
      ) {
        return res
          .status(400)
          .json({ message: 'Todos os dados são obrigatórios.' });
      }

      const userData = {
        name,
        document,
        birthdate: new Date(birthdate),
        phone,
        postal_code,
        email,
        role: 'paciente',
      };

      const pacienteData = { history };

      const pacienteUser = await pacienteService.createPaciente(
        userData,
        pacienteData,
      );

      return res
        .status(201)
        .json({
          message: 'Paciente cadastrado com sucesso!',
          user: pacienteUser,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao cadastrar paciente.', error });
    }
  }

  static async listarPacientes(req, res) {
    const filtros = { ...req.query };  
    
    try {
      const pacientes = await pacienteService.getAllPacientes(filtros);
      return res.status(200).json(pacientes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao listar pacientes', error });
    }
  }

  static async listarPacienteById(req, res) {
    const { id } = req.params;

    try {
      // MUDANÇA: Removido Number()
      const paciente = await pacienteService.getPacienteById(id);
      if (!paciente) {
        return res.status(404).json({ message: 'Paciente não encontrado' });
      }
      return res.status(200).json(paciente);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Erro ao listar paciente por Id', error });
    }
  }

  static async updatePaciente(req, res) {
    const { id } = req.params;
    const data = req.body;
  
    try {
      // MUDANÇA: Removido Number()
      const existingPaciente = await pacienteService.getPacienteById(id);
      
      if (!existingPaciente) {
        return res.status(404).json({ message: 'Paciente não encontrado' });
      }
  
      // MUDANÇA: Removido Number()
      const newData = await pacienteService.updatePaciente(id, data);
  
      return res.status(200).json(newData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar paciente', error });
    }
  }
  

  static async deletePaciente(req, res) {
    const { id } = req.params;

    try {
      // MUDANÇA: Removido Number()
      const existingPaciente = await pacienteService.getPacienteById(id);

      if (!existingPaciente) {
        return res.status(404).json({ message: 'Paciente não encontrado' });
      }

      // MUDANÇA: Removido Number()
      await pacienteService.deletePaciente(id);

      res.status(200).json({ message: "Paciente deletado com sucesso" });

    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Erro ao deletar paciente' });
    }
  }
}

export default pacienteController;
