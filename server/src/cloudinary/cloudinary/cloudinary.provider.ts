import { v2 } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'cloudinary',
  useFactory: () => {
    return v2.config({
      cloud_name: process.env.CLOUDINARY_NAME || 'luixaviles',
      api_key: process.env.CLOUDINARY_API_KEY || '392635498516357',
      api_secret:
        process.env.CLOUDINARY_API_SECRET || '0ksCM92kfVsWkO8ajNBpThtdu58',
    });
  },
};
