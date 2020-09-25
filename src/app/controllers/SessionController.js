import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    let error = {};

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      error = {
        email: 'Usuário não existe',
      };
      return res.status(400).json(error);
    }

    if (!(await user.checkPassword(password))) {
      error = {
        password: 'Senha incorreta',
      };
      return res.status(400).json(error);
    }

    const { id, name, address } = user;

    return res.json({
      user: {
        id,
        name,
        address,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret),
    });
  }
}

export default new SessionController();
