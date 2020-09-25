import User from '../models/User';

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

    return res.send();
  }
}

export default new SessionController();
