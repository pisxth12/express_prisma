import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: 'ecommerce/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        transformation: [
            { width: 1920, height: 1080, crop: 'limit', quality: 'auto' },
            { fetch_format: 'auto' }
        ],
        public_id: (req, res) => {
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(7);
            return `product-${timestamp}-${random}`;
        }
    },
});


export const upload = multer({
    storage,
    limits:{
        fieldSize: 5 * 1024 * 1024 ,// 5mb
        fields: 1
    },
    fileFilter: (req, file , cb) => {
        const allowedTypes =  /jpeg|jpg|png|webp|avif/;
        if(allowedTypes.test(file.mimetype)){
            cb(null, true);
        }else{
            cb(new Error('Only image files are allowed'));
        }
    }
});

export const deleteImage = async (imageUrl) => {
    try{
        if(!imageUrl) return;
          const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
          await cloudinary.uploader.destroy(publicId);
    }catch(error){
         console.error('Error deleting image:', error);
    }
}
export default cloudinary;