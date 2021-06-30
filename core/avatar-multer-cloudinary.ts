import { cloudinary } from './cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import multer from 'multer';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avatars',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 120, height: 120, crop: 'fill', gravity: 'north' }],
  },
});

export default multer({ storage });
