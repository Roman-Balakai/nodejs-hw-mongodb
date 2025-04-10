import createHttpError from 'http-errors';

import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';


export async function getAllContactsController(req, res) {
    const contacts = await getAllContacts();
    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
    });
}

export async function getContactController(req, res) {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (contact === null) {
        throw createHttpError(404, 'Contact not found');
    }
    res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
}

export async function createContactController(req, res) {
    const contact = req.body;
    const result = await createContact(contact);
    res.json({
        status: 201,
        message: "Successfully created a contact!",
        data: result,
    });

}

export async function updateContactController(req, res) {
    const { contactId } = req.params;
    const contact = req.body;
    const result = await updateContact(contactId, contact);
    if (result === null) {
        throw createHttpError(404, 'Contact not found');
    }
    res.json({
        status: 200,
        message: "Successfully patched a contact!",
        data: result,
    });
}

export async function deleteContactController(req, res) {
    const { contactId } = req.params;
    const result = await deleteContact(contactId);
    if (result === null) {
        throw createHttpError(404, 'Contact not found');
    }
    res.status(204).end();
}