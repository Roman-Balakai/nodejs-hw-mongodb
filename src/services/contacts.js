import { contactsCollection } from "../db/models/contact.js";

export async function getAllContacts({ page, perPage, sortBy, sortOrder, }) {
    const skip = page > 0 ? (page - 1) * perPage : 0;
    const contactsQuery = contactsCollection.find();

    const [totalItems, data] = await Promise.all([
        contactsCollection.countDocuments(contactsQuery),
        contactsQuery
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(perPage),
    ]);
    const totalPages = Math.ceil(totalItems / perPage);
    return {
        data,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page > totalPages,
    };
};

export function getContactById(contactId) {
    return contactsCollection.findById(contactId);
};

export function createContact(contact) {
    return contactsCollection.create(contact);
};

export function updateContact(contactId, contact) {
    return contactsCollection.findByIdAndUpdate(contactId, contact, { new: true });
};
export function deleteContact(contactId) {
    return contactsCollection.findByIdAndDelete(contactId);
};