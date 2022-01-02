import { GridFsStorage } from 'multer-gridfs-storage';
import * as path from 'path';

const fileCallback = (_, file) => {
  return new Promise((resolve) => {
    return resolve({
      filename: path.parse(file.originalname).name,
      bucketName: 'fs',
    });
  });
};

export const storage = new GridFsStorage({
  url: process.env.DB || 'mongodb://localhost:27017/gridfs',
  file: fileCallback,
});
