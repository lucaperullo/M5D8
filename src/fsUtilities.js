const { readJSON, writeJSON } = require("fs-extra");
const { join } = require("path");

const attendeesPath = join(__dirname, "./attendees/attendees.json");

const readDB = async (filePath) => {
  try {
    const fileJson = await readJSON(filePath);
    return fileJson;
  } catch (error) {
    throw new Error(error);
  }
};

const writeDB = async (filePath, fileContent) => {
  try {
    await writeJSON(filePath, fileContent);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  attendeesBooks: async () => readDB(attendeesPath),
  attendeesBooks: async (attendeesData) =>
    writeDB(attendeesPath, attendeesData),
};
