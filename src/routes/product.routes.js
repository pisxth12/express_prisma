import express from "express";
import { createProduct, deleteProduct, getProductById, getProductBySlug, getProductContactLink, getProducts, updateProduct } from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { handlerUploadError, uploadSingle } from "../middleware/upload.middleware.js";

const router = express.Router();


//Public routes 
router.get('/',getProducts);
router.get('/:id', getProductById);
router.get('/:slug/contact', getProductContactLink);
router.get('/slug/:slug', getProductBySlug);


router.post('/', protect, uploadSingle, handlerUploadError, createProduct);
router.put('/:id', protect, uploadSingle, handlerUploadError, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;