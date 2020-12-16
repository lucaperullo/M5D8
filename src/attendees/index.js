const express = require("express");
const { getAttendees, writeAttendees } = require("../fsUtilities.js");
const uniqid = require("uniqid");
const sgMail = require("@sendgrid/mail");
const { join } = require("path");
const { createReadSteam, createReadStream } = require("fs-extra");
const { pipeline } = require("stream");
const { Transform } = require("json2csv");

const attendeesRouter = express.Router();

attendeesRouter.post("/", async (req, res, next) => {
  try {
    const attDB = await getAttendees();

    attDB.push({
      ...req.body,
      ID: uniqid(),
    });
    await writeAttendees(attDB);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: "lucaperullo@outlook.it",
      from: "lucanontiscordar@gmail.com",
      subject: "prova",
      text: "ha",
      html: "<strong>and yo</strong>",
    };

    await sgMail.send(msg);
    res.send("EMAIL SENT!");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

attendeesRouter.get("/export/csv", (req, res, next) => {
  try {
    const pathToJson = join(__dirname, "attendees.json");
    const jsonReadableStream = createReadStream(pathToJson);

    const json2csv = new Transform({
      fields: ["FirstName", "Surname", "ToA", "Email", "ID"],
    });
    res.setHeader("Content-Disposition", "attachment; filname=export.csv");
    pipeline(jsonReadableStream, json2csv, res, (err) => {
      next(err);
    });
  } catch (error) {
    next(error);
  }
});

module.exports = attendeesRouter;
