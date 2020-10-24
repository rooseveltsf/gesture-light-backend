const Sequelize = require('sequelize');

class Avatar extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', (img) => {
      if (img.url === '') {
        img.url = `${process.env.APP_URL}/avatar/${img.path}`;
      }
    });

    return this;
  }
}

module.exports = Avatar;
