const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Avatar = require('../models/Avatar');
const authConfig = require('../../config/auth');

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    let error = {};

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Avatar,
          as: 'avatar',
          attributes: ['path', 'url'],
        },
      ],
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

    const { id, name, address, avatar } = user;

    return res.json({
      user: {
        id,
        name,
        address,
        email,
        avatar,
      },
      token: jwt.sign({ id }, authConfig.secret),
    });
  }
}

module.exports = new SessionController();
