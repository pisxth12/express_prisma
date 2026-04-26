import { CategoryRepository } from "../repositories/category.repository.js";

export class CategoryService {
    constructor() {
        this.categoryRepository = new CategoryRepository();
    }

    async getAllCategories(includeProducts = false, isActive) {
        const where = isActive !== undefined ? { isActive } : {};
        
        if (includeProducts) {
            return await this.categoryRepository.findAll(
                where, 
                { createdAt: 'desc' }, 
                {
                    products: {
                        where: { isActive: true },
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            original_price: true,
                            discount_price: true,
                            image_url: true
                        }
                    }
                }
            );
        }
        
        return await this.categoryRepository.findAll(where);
    }

    async getCategoryById(id) {
        return await this.categoryRepository.findById(id, {
            products: {
                where: { isActive: true },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    original_price: true,
                    discount_price: true,
                    image_url: true
                }
            }
        });
    }

    async getCategoryBySlug(slug) {
        return await this.categoryRepository.findBySlug(slug);
    }

    async createCategory(data) {
        return await this.categoryRepository.create({
            ...data,
            isActive: data.isActive ?? true
        });
    }

    async updateCategory(id, data) {
        const existingCategory = await this.categoryRepository.findById(id);
        if (!existingCategory) return null;
        return await this.categoryRepository.update(id, data);
    }

    async deleteCategory(id) {
        const existingCategory = await this.categoryRepository.findById(id);
        if (!existingCategory) return null;

        const hasProducts = await this.categoryRepository.hasProducts(id);
        if (hasProducts) {
            return { success: false, message: 'Cannot delete category with existing products' };
        }

        await this.categoryRepository.delete(id);
        return { success: true };
    }
}