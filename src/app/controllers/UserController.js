const Yup = require('yup');
const User = require('../models/User');
const Avatar = require('../models/Avatar');

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação do formulário' });
    }

    const userExists = await User.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const { name, address, email } = await User.create(req.body);

    return res.json({ name, address, email });
  }

  async update(req, res) {
    const { userId } = req;

    const { originalname: name, key: path, location: url = '' } = req.file;

    try {
      const { id } = await Avatar.create({ name, path, url });

      await User.update(
        {
          avatar_id: id,
        },
        {
          where: {
            id: userId,
          },
        }
      );

      const { avatar_id, avatar } = await User.findOne({
        where: { id: userId },
        include: [
          {
            model: Avatar,
            as: 'avatar',
            attributes: ['path', 'url'],
          },
        ],
      });

      return res.json({ avatar, avatar_id });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Não foi possivel adicionar avatar' });
    }
  }
}

module.exports = new UserController();
