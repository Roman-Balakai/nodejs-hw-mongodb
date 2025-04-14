import express from "express";


import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { createContactController, deleteContactController, getAllContactsController, getContactController, updateContactController } from "../controllers/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";
import { upload } from '../middlewares/upload.js';
import { validateBody } from "../middlewares/validateBody.js";

import { contactSchema, updateContactSchema } from "../validation/contacts.js";


const router = express.Router();

const jsonParser = express.json();

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:contactId', isValidId, ctrlWrapper(getContactController));

router.post('/', upload.single('photo'), jsonParser, validateBody(contactSchema), ctrlWrapper(createContactController));

router.patch('/:contactId', isValidId, upload.single('photo'), jsonParser, validateBody(updateContactSchema), ctrlWrapper(updateContactController));

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;