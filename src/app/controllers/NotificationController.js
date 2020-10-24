const Notification = require('../schemas/Notification');
const User = require('../models/User');
const Publication = require('../models/Publication');

class NotificationController {
  async index(req, res) {
    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async store(req, res) {
    const user = await User.findByPk(req.userId);

    const { publication_id } = req.params;

    const publication = await Publication.findByPk(publication_id);

    if (!publication) {
      return res.status(400).json({ error: 'Publicação não existe' });
    }

    const { user_id } = publication;

    const notification = await Notification.create({
      content: `Você recebeu um novo alerta de ${user.name}. Edite sua publicação.`,
      user: user_id,
      publication: publication_id,
    });

    const ownerSocket = req.connectedUsers[user_id];

    if (ownerSocket) {
      req.io.to(ownerSocket).emit('notification', notification);
    }
    return res.send();
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}
module.exports = new NotificationController();
