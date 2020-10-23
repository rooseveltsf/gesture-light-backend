import '../bootstrap';
import multer from 'multer';
import crypto from 'crypto';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import { resolve, extname } from 'path';

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, resolve(__dirname, '..', '..', 'tmp', 'uploads'));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        file.key = res.toString('hex') + extname(file.originalname);

        return cb(null, file.key);
      });
    },
  }),
  s3: multerS3({
    s3: new aws.S3({
      region: process.env.AWS_DEFAULT_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACESS_KEY,
      },
    }),
    bucket: 'gesturelight',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        const fileName = res.toString('hex') + extname(file.originalname);

        return cb(null, fileName);
      });
    },
  }),
};

export default {
  dest: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  storage: storageTypes[process.env.STORAGE_TYPE],
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/pjpeg',
      'image/png',
      'image/gif',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(), 'Tipo da imagem é invalido');
    }
  },
};
