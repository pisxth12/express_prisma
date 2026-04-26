import { ProductService } from "../services/product.service.js";

const  productService = new ProductService();

export const getProducts = async (req, res, next) => {
    try {
        const page =  parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
        const categoryId = req.query.categoryId;
        const search = req.query.search;

        const result = await productService.getAllProducts(page, limit, { isActive, categoryId, search });
        res.setHeader('X-Total-Count', result.total);
        res.setHeader('X-Total-Pages', result.totalPages);
        res.setHeader('X-Current-Page', result.page);
        res.json(result.data);
    }catch (error) {
        next(error);
    }
};


export const getProductContactLink = async (req, res, next) => {
    try {
        const { slug } = req.params;  
        
        if (!slug) {
            return res.status(400).json({ error: 'Slug is required' });
        }

        const result = await productService.getProductContactLink(slug);
        res.json(result);
        
    } catch (error) {
        if (error.message === 'Product not available') {
            return res.status(404).json({ error: error.message });
        }
        next(error);
    }
};






export const getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if(!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    }catch (error) {
        next(error);    
    }
}

export const getProductBySlug = async (req, res, next) => {
    try {
        const product = await productService.getProductBySlug(req.params.slug);
        if(!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    }catch (error) {
        next(error);    
    }
}

export const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body, req.file?.path);
        res.status(201).json(product);
    }catch (error) {
        next(error);    
    }
};


export const updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body, req.file?.path);
        if(!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    }catch (error) {
        next(error);    
    }
};


export const deleteProduct = async (req, res, next) => {
    try {
        const deleted = await productService.deleteProduct(req.params.id);
        if(!deleted) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    }catch (error) {
        next(error);    
    }
}