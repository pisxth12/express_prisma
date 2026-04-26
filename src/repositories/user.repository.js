import prisma from "../config/database.js";
import { BaseRepository } from "./base.repository.js";

export class UserRepository extends BaseRepository {
    constructor(){
        super(prisma.user);
    }

    async findByEmail(email){
        return await this.model.findUnique({
            where: {email}
        });
    }

async findById(id){
    return await this.model.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            email: true
        }
    });
}

    async findByUsername(username){
        return await this.model.findUnique({
            where: {username}
        });
    }

    async createUser(userData){
        return user = await this.model.create(userData);

       
        return {
            id: user.id,
            username: user.username,
            email: user.email,
        };
    }
}