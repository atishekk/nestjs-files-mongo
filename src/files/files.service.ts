import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  GridFSBucket,
  GridFSBucketReadStream,
  GridFSFile,
  MongoClient,
  ObjectId,
} from 'mongodb';
import { toPromise } from '../common/utils';

@Injectable()
export class FilesService {
  public connection: MongoClient;
  public GridFS: GridFSBucket;

  constructor() {
    MongoClient.connect('mongodb://localhost:27017').then((client) => {
      this.connection = client;
      this.GridFS = new GridFSBucket(client.db('gridfs'), {
        bucketName: 'fs',
      });
    });
  }
  async findFile(id: ObjectId): Promise<GridFSFile> {
    const files = await this.GridFS.find({
      _id: id,
    }).toArray();
    if (!files[0]) {
      Logger.error(
        `File Not Found id: ${id}, status-code: ${HttpStatus.NOT_FOUND}`,
      );
      throw new HttpException('File Not Found.', HttpStatus.NOT_FOUND);
    }
    return toPromise(files[0]);
  }

  async getFileStream(id: ObjectId): Promise<GridFSBucketReadStream> {
    const fileStream = this.GridFS.openDownloadStream(id);
    return toPromise(fileStream);
  }

  async deleteFile(id: ObjectId) {
    const file = await this.findFile(id);
    await this.GridFS.delete(file._id);
    Logger.log(`File Deleted Successfully id: ${id}`);
  }
}
