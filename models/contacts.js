const fs = require("fs/promises");
const path = require("path");
const { v4 } = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");

const getAllContacts = async () => {
  const data = await fs.readFile(contactsPath);
  const allContacts = JSON.parse(data);
  return allContacts;
};

const getContactById = async (contactId) => {
  const allContacts = await getAllContacts();
  const contactById = allContacts.find((contact) => contact.id === contactId);
  return contactById;
};

const removeContact = async (contactId) => {
  const allContacts = await getAllContacts();
  const index = allContacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  const resultContactsList = allContacts.filter((_, idx) => index !== idx);
  await fs.writeFile(contactsPath, JSON.stringify(resultContactsList));
  return allContacts[index];
};

const addContact = async (body) => {
  const allContacts = await getAllContacts();
  const newContact = { id: v4(), ...body };
  allContacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const allContacts = await getAllContacts();
  const index = allContacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  allContacts[index] = { ...body, id: contactId };

  await fs.writeFile(contactsPath, JSON.stringify(allContacts));
  return allContacts[index];
};

module.exports = {
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
