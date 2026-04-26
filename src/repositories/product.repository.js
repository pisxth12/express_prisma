import prisma from "../config/database.js";
import { BaseRepository } from "./base.repository.js";

export class ProductRepository extends BaseRepository{
    constructor(){
        super(prisma.product);
    }

    async findBySlug(slug){
        return await this.model.findUnique({
            where: { slug },
            include: {
                category : {
                    select : {id: true ,name: true, slug:  true }
                }
            }
        });
    }

    async findAllWithFilters(page, limit, filters = {}){
        const { isActive, categoryId, search } = filters;
        const skip = ( page - 1 ) *  limit;

        const where = {};
        if(isActive !== undefined) where.isActive = isActive;
        if(categoryId) where.category_id = categoryId;
        if(search) {
            where.OR = [
                { name: {contains: search , mode: 'insensitive'} },
                { slug: {contains: search , mode: 'insensitive'} },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        }

        const [data, total] = await Promise.all([
            this.model.findMany({
                where,
                skip,
                take:  limit,
                orderBy: { createdAt : 'desc'},
                include: {
                    category: {
                        select: { id: true, name: true, slug: true }
                    }
                }
            }),
            this.model.count({where})
        ]);
        return { data, total };

    }
}