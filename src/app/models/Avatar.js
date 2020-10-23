import Sequelize, { Model } from 'sequelize';

class Avatar extends Model {
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
        console.log('model de avatar');
        img.url = `${process.env.APP_URL}/avatar/${img.path}`;
      }
    });

    return this;
  }
}

export default Avatar;
