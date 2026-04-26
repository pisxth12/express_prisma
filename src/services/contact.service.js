import { ContactRepository } from "../repositories/contact.repository.js";

export class ContactService {
    constructor() {
        this.contactRepository = new ContactRepository();
    }

    async getContactInfo() {
        let contactInfo = await this.contactRepository.findFirst();
        if (!contactInfo) {
            contactInfo = await this.contactRepository.create({});
        }
        return contactInfo;
    }

    async updateContactInfo(data) {
        return await this.contactRepository.upsert(data);
    }
}