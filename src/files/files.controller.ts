import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Response,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from '../common/storage.utils';
import { FilesService } from './files.service';
import { ObjectId } from 'mongodb';
import { ObjectIdTransformer } from './transformers/objectid.transformer';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: storage }))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return file;
  }

  @Get(':id')
  @UsePipes(new ObjectIdTransformer())
  async getFile(
    @Param('id') id: ObjectId,
    @Response({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    const file = await this.filesService.findFile(id);
    const fileStream = await this.filesService.getFileStream(id);
    res.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${file.filename}"`,
    });
    return new StreamableFile(fileStream);
  }

  @Delete(':id')
  @UsePipes(new ObjectIdTransformer())
  async deleteFile(@Param('id') id: ObjectId) {
    await this.filesService.deleteFile(id);
  }
}
