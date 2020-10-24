const Sequelize = require('sequelize');
const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const s3 = new aws.S3();
class Image extends Sequelize.Model {
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
        img.url = `${process.env.APP_URL}/publish/${img.path}`;
      }
    });

    this.addHook('beforeDestroy', (image) => {
      if (process.env.STORAGE_TYPE === 's3') {
        return s3
          .deleteObject({
            Bucket: 'gesturelight',
            Key: image.path,
          })
          .promise();
      }
      return promisify(fs.unlink)(
        path.resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', image.path)
      );
    });

    return this;
  }
}

module.exports = Image;
