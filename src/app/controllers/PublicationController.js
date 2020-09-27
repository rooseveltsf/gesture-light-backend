import Publication from '../models/Publication';

class PublicationController {
  async index(req, res) {
    const publications = await Publication.findAll();

    return res.json(publications);
  }
}

export default new PublicationController();
