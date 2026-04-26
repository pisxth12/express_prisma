import { CategoryService } from "../services/category.service.js";

const categoryService = new CategoryService();

// យក export ចេញពីក្នុង class
export class CategoryController {
    async getCategories(req, res, next) {  
        try {
            const includeProducts = req.query.includeProducts === 'true';
            const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
            const categories = await categoryService.getAllCategories(includeProducts, isActive);
            res.json(categories);
        } catch (error) {
            next(error);
        }
    }
}

export const getCategories = async (req, res, next) => {
    try {
        const includeProducts = req.query.includeProducts === 'true';
        const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
        const categories = await categoryService.getAllCategories(includeProducts, isActive);
        res.json(categories);
    } catch (error) {
        next(error);
    }
};


export const getCategoryById = async (req, res, next) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        if(!category) return res.status(404).json({ error: 'Category not found' });
        res.json(category);
    } catch (error) {
        next(error);
    }
}

export const getCategoryBySlug = async (req, res, next) => {
    try {
        const category = await categoryService.getCategoryBySlug(req.params.slug);
        if(!category) return res.status(404).json({ error: 'Category not found' });
        res.json(category);
    } catch (error) {
        next(error);
    }
}

export const createCategory = async (req, res, next) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
}

export const updateCategory = async (req, res, next) => {
    try{
        const category = await categoryService.updateCategory(req.params.id, req.body);
        if(!category) return res.status(404).json({ error: 'Category not found' });
        res.json(category);
    } catch (error) {
        next(error);
    }
}

export const deleteCategory = async (req, res, next) => {
    try {
        const result = await categoryService.deleteCategory(req.params.id);
        if (!result.success) {
            return res.status(400).json({ error: result.message });
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}