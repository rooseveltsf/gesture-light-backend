import * as Yup from 'yup';
import User from '../models/User';
import Image from '../models/Image';

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
    const { originalname: name, filename: path } = req.file;

    const { id } = await Image.create({ name, path });

    await User.update({
      avatar_id: id,
    });

    return res.send();
  }
}

export default new UserController();
