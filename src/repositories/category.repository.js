import prisma from "../config/database.js";
import { BaseRepository } from "./base.repository.js";

export class CategoryRepository extends BaseRepository{
    constructor(){
        super(prisma.category);
    }

    async findBySlug(slug){
        return await this.model.findUnique({
            where: { slug },
            include :{
                products: {
                    where: { isActive:  true },
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
        });
    }

    async hasProducts(categoryId){
        const count = await prisma.product.count({
            where:{ category_id: categoryId },
        });
        return count > 0;
    }
}