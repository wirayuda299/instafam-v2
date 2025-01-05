import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary/cloudinary.service';

@Controller('api/v1/image')
export class UploadController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('files'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadImage(file);
  }

  @Delete('delete')
  deleteImage(@Body('id') id:string){
    console.log(id)
    return this.cloudinaryService.deleteImage(id)
  }
}
