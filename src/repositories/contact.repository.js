import prisma from "../config/database.js";
import { BaseRepository } from "./base.repository.js";

export class ContactRepository extends BaseRepository{
    constructor(){
        super(prisma.contact);
    }
    async findFirst(){
        return await this.model.findFirst();
    }

    async upsert(data){
        const existing = await this.findFirst();
        if(existing) return await this.update(existing.id, data);
        return await this.create(data);
    }
}