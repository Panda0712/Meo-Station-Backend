import { StatusCodes } from "http-status-codes";
import { contactService } from "~/services/contactService";

const createNew = async (req, res, next) => {
  try {
    const createdContact = await contactService.createNew(req.body);

    res.status(StatusCodes.CREATED).json(createdContact);
  } catch (error) {
    next(error);
  }
};

const getListContacts = async (req, res, next) => {};

const deleteContact = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;

    const deletedContact = await contactService.deleteContact(contactId);

    res.status(StatusCodes.OK).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const contactController = {
  createNew,
  getListContacts,
  deleteContact,
};
