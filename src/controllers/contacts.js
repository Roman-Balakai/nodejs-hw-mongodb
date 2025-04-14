import createHttpError from 'http-errors';
import * as fs from 'node:fs/promises';
import path from 'path';

import {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
} from '../services/contacts.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

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
    let photo = null;

    if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
        const result = await uploadToCloudinary(req.file.path);

        photo = result.secure_url;
    } else {
        await fs.rename(
            req.file.path,
            path.resolve('src', 'uploads', req.file.filename),
        );

        photo = `http://localhost:3000/uploads/${req.file.filename}`;
    }
    const contact = { ...req.body, userId: req.user.id, photo };
    const result = await createContact(contact);

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: result,
    });
};

export async function updateContactController(req, res) {
    const { contactId } = req.params;
    let updatedData = { ...req.body };

    if (req.file) {
        let photo = null;

        if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
            const result = await uploadToCloudinary(req.file.path);
            photo = result.secure_url;
        } else {
            await fs.rename(
                req.file.path,
                path.resolve('src', 'uploads', req.file.filename),
            );
            photo = `http://localhost:3000/uploads/${req.file.filename}`;
        }

        updatedData.photo = photo;
    }

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
