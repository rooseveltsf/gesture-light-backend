import Publication from '../models/Publication';
import User from '../models/User';

class PublicationController {
  async index(req, res) {
    const publications = await Publication.findAll();
    const userExists = await User.findByPk(req.userId);
    if (!userExists) {
      return res.status(400).json({ error: 'Usuário não existe' });
    }
    return res.json(publications);
  }
}

export default new PublicationController();
