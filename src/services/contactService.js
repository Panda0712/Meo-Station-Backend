import { contactModel } from "~/models/contactModel";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from "~/utils/constants";

const createNew = async (data) => {
  try {
    const createdContact = await contactModel.createNew(data);

    const getNewContact = await contactModel.findOneById(
      createdContact.insertedId
    );

    return getNewContact;
  } catch (error) {
    throw error;
  }
};

const getListContacts = async (page, itemsPerPage, queryFilter) => {
  try {
    if (!page) page = DEFAULT_PAGE;
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE;

    const results = await contactModel.getListContacts(
      parseInt(page, 10),
      parseInt(itemsPerPage),
      queryFilter
    );

    return results;
  } catch (error) {
    throw error;
  }
};

const deleteContact = async (contactId) => {
  try {
    const deletedContact = await contactModel.deleteContact(contactId);

    return deletedContact;
  } catch (error) {
    throw error;
  }
};

export const contactService = {
  createNew,
  getListContacts,
  deleteContact,
};
