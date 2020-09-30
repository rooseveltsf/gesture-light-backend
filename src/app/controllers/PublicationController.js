import Publication from '../models/Publication';
import User from '../models/User';
import Image from '../models/Image';

class PublicationController {
  async index(req, res) {
    const userExists = await User.findByPk(req.userId);
    if (!userExists) {
      return res.status(400).json({ error: 'Usuário não existe' });
    }

    try {
      // const { page = 1 } = req.query;
      const allPublications = await Publication.findAll({
        include: [
          {
            model: Image,
            as: 'image',
            attributes: ['url', 'path'],
          },
          {
            model: User,
            as: 'user',
            attributes: ['name', 'address', 'email'],
          },
        ],
        // limit: 5,
        // offset: (page - 1) * 5,
      });

      const formatPublications = JSON.stringify(allPublications, null, 2);
      const publications = JSON.parse(formatPublications);

      const notAcessible = publications.filter(
        (item) => item.status === 'notAccessible'
      ).length;
      const neutro = publications.filter((item) => item.status === 'neutro')
        .length;
      const acessible = publications.filter(
        (item) => item.status === 'accessible'
      ).length;

      res.header('X-Total-countAcessible', acessible);
      res.header('X-Total-countNotAcessible', notAcessible);
      res.header('X-Total-countNeutro', neutro);

      return res.json(publications);
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Erro na listagem das publicações.' });
    }
  }

  async store(req, res) {
    const userExists = await User.findByPk(req.userId);

    if (!userExists) {
      return res.status(400).json({ error: 'Usuário não existe.' });
    }

    const { originalname: name, filename: path } = req.file;

    const { id } = await Image.create({ name, path });

    const {
      title,
      description,
      status,
      address,
      latitude,
      longitude,
    } = req.body;

    const publication = await Publication.create({
      title,
      description,
      status,
      address_post: address,
      latitude,
      longitude,
      user_id: req.userId,
      image_id: id,
    });

    return res.json(publication);
  }

  async update(req, res) {
    const userExist = await User.findByPk(req.userId);

    if (!userExist) {
      return res.status(400).json({
        error: 'Usuário não existe',
      });
    }

    const { id } = req.params;

    const currentPublication = await Publication.findOne({
      attributes: ['user_id'],
      where: {
        id,
      },
      raw: true,
      nest: true,
    });

    if (!currentPublication) {
      return res.status(400).json({
        error: 'Publicação não existe',
      });
    }

    const { user_id } = currentPublication;

    if (user_id !== req.userId) {
      return res.status(400).json({
        error: 'Você não possui permissão para alterar essa publicação.',
      });
    }

    await Publication.update(req.body, {
      where: {
        id,
      },
    });

    return res.send();
  }

  async delete(req, res) {
    const userExist = await User.findByPk(req.userId);

    if (!userExist) {
      return res.json({
        error: 'Usuário não existe',
      });
    }

    const { id } = req.params;

    const currentPublication = await Publication.findOne({
      attributes: ['user_id'],
      where: {
        id,
      },
      raw: true,
      nest: true,
    });

    if (!currentPublication) {
      return res.json({
        error: 'Publicação não existe',
      });
    }

    const { user_id } = currentPublication;

    if (user_id !== req.userId) {
      return res.json({
        error: 'Você não possui permissão para deletar essa publicação.',
      });
    }

    await Publication.destroy({
      where: {
        id,
      },
    });

    return res.send();
  }
}

export default new PublicationController();
