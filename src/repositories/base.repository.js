export class BaseRepository{
    constructor(model){
        this.model = model;
    }

    async findById(id, include = null){
        return await this.model.findUnique({
            where: { id },
            include
        });
    }

    async findAll(where = {}, orderBy = { createdAt: 'desc' } , include = null ){
        return await this.model.findMany({
            where,
            orderBy,
            include
        });
    }

    async findWithPagination(page, limit, where =  {} , orderBy = {createdAt:  'desc'}, include =  null){
        const skip = (page -1 ) * limit;

        const [data, total] = await Promise.all([
            this.model.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include
            }),
            this.model.count({where})
        ]);
        return { data , total };
    }

    async create(data) {
        return await this.model.create({data});
    }

    async update(id, data){
        return await this.model.update({
            where:{id},
            data
        });
    }

    async delete(id){
        return await this.model.delete({where:{id}});
    }

    async exists(where){
        const count = await this.model.count({where});
        return count > 0;
    }

}