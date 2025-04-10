import express from "express";


import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { createContactController, deleteContactController, getAllContactsController, getContactController, updateContactController } from "../controllers/contacts.js";


const router = express.Router();

const jsonParser = express.json();

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:contactId', ctrlWrapper(getContactController));

router.post('/', jsonParser, ctrlWrapper(createContactController));

router.patch('/:contactId', jsonParser, ctrlWrapper(updateContactController));

router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;