import { ContactService } from "../services/contact.service.js";

const contactService = new ContactService();

export const getContactInfo = async (req, res, next) => {
    try {
        const contactInfo = await contactService.getContactInfo();
        res.json(contactInfo);
    } catch (error) {
        next(error);
    }
};

export const updateContactInfo = async (req, res, next) => {
    try {
        const updatedContactInfo = await contactService.updateContactInfo(req.body);
        res.json(updatedContactInfo);
    } catch (error) {
        next(error);
    }
};