import { contactsCollection } from "../db/models/contact.js";

export function getAllContacts() {
    return contactsCollection.find();
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