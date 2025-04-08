import { contactModel } from "../db/models/contact.js";

export const getAllContacts = async () => {
    const contacts = await contactModel.find();
    return contacts;
};

export const getContactById = async (id) => {
    const contact = await contactModel.findById(id);
    return contact;
};
