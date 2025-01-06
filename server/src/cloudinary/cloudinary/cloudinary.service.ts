import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }
          console.log('Cloudinary upload success:', result);
          resolve(result);
        },
      );
  
      toStream(file.buffer).pipe(upload);
    })
  }


async getResourceDetails(assetId: string) {
  try {
    const resource = await v2.api.resources_by_asset_ids([assetId]);
    return resource.resources[0]?.public_id; 
  } catch (error) {
    throw error;
  }
}
async deleteImage(assetId: string) {
  try {
    const publicId = await this.getResourceDetails(assetId);
    if (!publicId) {
      throw new Error('Public ID not found for the given asset ID');
    }
    return await v2.uploader.destroy(publicId);
  } catch (error) {
    throw error;
  }
}

}
