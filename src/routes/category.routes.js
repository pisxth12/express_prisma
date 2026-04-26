import express from "express";
import { createCategory, deleteCategory, getCategories, getCategoryById, getCategoryBySlug, updateCategory } from "../controllers/category.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get('/',getCategories);
router.get('/slug/:slug',getCategoryBySlug);
router.get('/:id',getCategoryById);
router.post('/',protect ,createCategory);
router.put('/:id',protect ,updateCategory);
router.delete('/:id',protect ,deleteCategory);

export default router