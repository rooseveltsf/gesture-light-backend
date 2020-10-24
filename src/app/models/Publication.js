const Sequelize = require('sequelize');

class Publication extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        status: Sequelize.STRING,
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        address_post: Sequelize.STRING,
        latitude: Sequelize.DECIMAL,
        longitude: Sequelize.DECIMAL,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Image, { foreignKey: 'image_id', as: 'image' });
  }
}

module.exports = Publication;
