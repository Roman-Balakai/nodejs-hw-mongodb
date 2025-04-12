import createHttpError from 'http-errors';

import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export async function getAllContactsController(req, res) {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);

    const response = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
    });
    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data: response,
    });
}

export async function getContactController(req, res) {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (contact === null) {
        throw new createHttpError.NotFound('Contact not found');
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
        data: result.value,
    });

}

export async function updateContactController(req, res) {
    const { contactId } = req.params;
    const contact = req.body;
    const result = await updateContact(contactId, contact);
    if (result === null) {
        throw new createHttpError.NotFound('Contact not found');
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
        throw new createHttpError.NotFound('Contact not found');
    }
    res.status(204).end();
}