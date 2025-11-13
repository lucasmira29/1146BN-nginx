import medicoService from '../services/medicoService.js';
import jwt from 'jsonwebtoken';

class medicoController {
  static async cadastrarMedico(req, res) {
    try {
      const {
        name,
        document,
        birthdate,
        phone,
        postal_code,
        email,
        password,
        specialty,
      } = req.body;

      if (
        !name ||
        !document ||
        !birthdate ||
        !phone ||
        !postal_code ||
        !email ||
        !password
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
        password,
        role: 'medico',
      };

      const medico = await medicoService.createMedico(userData, specialty);

      return res
        .status(200)
        .json({ message: 'Médico cadastrado com sucesso!', medico });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Ocorreu um erro ao cadastrar médico' });
    }
  }

  static async listarMedicos(req, res) {
    const filtros = { ...req.query };

    try {
      const medico = await medicoService.getAllMedicos(filtros);

      res.status(200).json(medico);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro ao listar os médicos' });
    }
  }

  static async listarMedicoById(req, res) {
    try {
      const { id } = req.params;
      const medico = await medicoService.getMedicoById(Number(id));

      if (!medico) {
        return res.status(404).json({ message: 'Médico não encontrado' });
      }

      res.status(200).json(medico);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Erro ao ao listar médico por Id' });
    }
  }

  static async updateMedico(req, res) {
    const { id } = req.params;
    const data = req.body;

    try {
      const existingMedico = await medicoService.getMedicoById(Number(id));

      if (!existingMedico) {
        return res.status(404).json({ message: 'Médico não encontrado' });
      }

      const updatedMedico = await medicoService.updateMedico(Number(id), data);

      const newToken = jwt.sign(
        {
          id: updatedMedico.user.id,
          name: updatedMedico.user.name,
          email: updatedMedico.user.email,
          role: updatedMedico.user.role,
        },
        process.env.SECRET,
        { expiresIn: '1h' },
      );

      return res.status(200).json({
        message: 'Médico atualizado com sucesso!',
        user: {
          id: updatedMedico.user.id,
          name: updatedMedico.user.name,
          email: updatedMedico.user.email,
          document: updatedMedico.user.document,
          role: updatedMedico.user.role,
        },
        token: newToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar médico', error });
    }
  }

  static async deleteMedico(req, res) {
    const { id } = req.params;

    try {
      const existingMedico = await medicoService.getMedicoById(Number(id));

      if (!existingMedico) {
        return res.status(404).json({ message: 'Médico não encontrado' });
      }

      await medicoService.deleteMedico(Number(id));

      res.status(200).json({ message: 'Médico deletado com sucesso' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Erro ao deletar médico' });
    }
  }
}

export default medicoController;
