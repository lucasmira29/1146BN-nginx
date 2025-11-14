import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userService from '../services/userService.js';

class userController {
  static async atualizarAdmin(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      const existingAdmin = await userService.getUserById(id, data);

      if (!existingAdmin || existingAdmin.role !== 'admin') {
        return res.status(404).json({ message: 'Administrador não encontrado' });
      }

      const updatedAdmin = await userService.updateAdmin(id, data);

      const newToken = jwt.sign(
        {
          id: updatedAdmin.id,
          name: updatedAdmin.name,
          email: updatedAdmin.email,
          role: updatedAdmin.role,
        },
        process.env.SECRET,
        { expiresIn: '1h' },
      );

      return res.status(200).json({
        message: 'Administrador atualizado com sucesso!',
        user: {
          id: updatedAdmin.id,
          name: updatedAdmin.name,
          email: updatedAdmin.email,
          document: updatedAdmin.document,
          role: updatedAdmin.role,
        },
        token: newToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar Administrador', error });
    }
  }

  static async listarUsuarios(req, res) {
    try {
      const filters = req.query;

      const users = await userService.filtrarUsuarios(filters);

      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao listar usuários' });
    }
  }

  static async listarUsuarioPorId(req, res) {
    try {
      const { id } = req.params;

      const user = await userService.getUserById(id);
      if (user) {
        return res.status(200).json(user);
      }

      return res
        .status(404)
        .json({ message: 'Usuário com Id informado não encontrado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao listar usuário por ID' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: 'Email e senha são obrigatórios' });
      }

      const user = await userService.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'Usuário ou senha incorreto' });
      }

      if (!user.password) {
        return res.status(401).json({ message: 'Usuário ou senha incorreto' });
      }

      const senhaValida = await bcrypt.compare(password, user.password);
      if (!senhaValida) {
        return res.status(401).json({ message: 'Usuário ou senha incorreto' });
      }

      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        process.env.SECRET,
        { expiresIn: '1h' },
      );

      return res.status(200).json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao realizar login', error });
    }
  }
}

export default userController;
