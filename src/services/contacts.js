import { contactsCollection } from '../db/models/contact.js';

export async function getAllContacts({ page, perPage, sortBy, sortOrder, userId, filter = {} }) {
    const query = { ...filter, userId };
    const skip = page > 0 ? (page - 1) * perPage : 0;
    const contactsQuery = contactsCollection.find(query);

    const [totalItems, data] = await Promise.all([
        contactsCollection.countDocuments(query),
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
        hasNextPage: page < totalPages,
    };
}

export function getContactById(contactId, userId) {
    return contactsCollection.findOne({ _id: contactId, userId });
}

export function createContact(contact) {
    return contactsCollection.create(contact);
}

export function updateContact(contactId, contact, userId) {
    return contactsCollection.findOneAndUpdate(
        { _id: contactId, userId },
        contact,
        { new: true }
    );
}

export function deleteContact(contactId, userId) {
    return contactsCollection.findOneAndDelete({ _id: contactId, userId });
}
