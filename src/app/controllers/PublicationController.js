const Publication = require('../models/Publication');
const User = require('../models/User');
const Image = require('../models/Image');
const Avatar = require('../models/Avatar');

class PublicationController {
  async index(req, res) {
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
          include: [
            {
              model: Avatar,
              as: 'avatar',
              attributes: ['url', 'path'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
      // limit: 5,
      // offset: (page - 1) * 5,
    });

    const formatPublications = JSON.stringify(allPublications, null, 2);
    const publications = JSON.parse(formatPublications);

    const notAcessible = publications.filter(
      (item) => item.status === 'notAccessible'
    );
    const neutro = publications.filter((item) => item.status === 'neutro');

    const acessible = publications.filter(
      (item) => item.status === 'accessible'
    );

    res.header('X-Total-countAcessible', acessible.length);
    res.header('X-Total-countNotAcessible', notAcessible.length);
    res.header('X-Total-countNeutro', neutro.length);

    return res.json(allPublications);
  }

  async store(req, res) {
    const { originalname: name, key: path, location: url = '' } = req.file;

    const { id } = await Image.create({ name, path, url });

    const {
      title,
      description,
      status,
      address,
      latitude,
      longitude,
    } = req.body;

    await Publication.create({
      title,
      description,
      status,
      address_post: address,
      latitude,
      longitude,
      user_id: req.userId,
      image_id: id,
    });

    return res.send();
  }

  async update(req, res) {
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
      return res.status(401).json({
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
      return res.status(401).json({
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

module.exports = new PublicationController();
