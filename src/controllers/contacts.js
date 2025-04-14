import createHttpError from 'http-errors';

import {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export async function getAllContactsController(req, res) {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const response = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        userId: req.user.id,
        filter,
    });

    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data: response,
    });
};

export async function getContactController(req, res) {
    const { contactId } = req.params;
    const contact = await getContactById(contactId, req.user.id);

    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
};

export async function createContactController(req, res) {
    const contact = { ...req.body, userId: req.user.id };
    const result = await createContact(contact);

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: result,
    });
};

export async function updateContactController(req, res) {
    const { contactId } = req.params;
    const updatedData = req.body;

    const result = await updateContact(contactId, updatedData, req.user.id);
    if (!result) {
        throw createHttpError(404, 'Contact not found');
    }

    res.json({
        status: 200,
        message: "Successfully updated contact!",
        data: result,
    });
}

export async function deleteContactController(req, res) {
    const { contactId } = req.params;
    const result = await deleteContact(contactId, req.user.id);

    if (!result) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(204).end();
}
