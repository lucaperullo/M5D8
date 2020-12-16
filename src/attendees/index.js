const express = require("express");
const { getAttendees, writeAttendees } = require("../fsUtilities.js");
const uniqid = require("uniqid");
const sgMail = require("@sendgrid/mail");
const { join } = require("path");
const { createReadStream } = require("fs-extra");
const { pipeline } = require("stream");
const { Transform } = require("json2csv");

const attendeesRouter = express.Router();

attendeesRouter.post("/", async (req, res, next) => {
  try {
    console.log(1);
    const attDB = await getAttendees();
    console.log(2);
    attDB.push({
      ...req.body,
      ID: uniqid(),
    });
    console.log(3);
    await writeAttendees(attDB);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: req.body.Email,
      from: "thepoopatroopa@gmail.com",
      subject: "You're Great!",
      text: "and everybody knows it!",
      html: "<strong>and everybody knows it!</strong>",
    };

    await sgMail.send(msg);

    res.send("SENT");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

attendeesRouter.get("/export/csv", (req, res, next) => {
  try {
    const pathToJson = join(__dirname, "attendees.json"); //CREATING PATH TO JSON FILE
    const jsonReadableStream = createReadStream(pathToJson); //CREATES SOURCE FOR PIPELINE
    //SOURCE IS THE FILE THAT WE'RE SENDING

    const json2csv = new Transform({
      fields: ["FirstName", "Surname", "ToA", "Email", "ID"],
    }); //TURNS JSON FILE INTO A CSV FILE WITH THE FIELDS AS COLUMNS

    res.setHeader("Content-Disposition", "attachment; filename=export.csv"); //SETS ENDPOINT TO DOWNLOAD THE FILES IN THE RESPONSE
    pipeline(jsonReadableStream, json2csv, res, (err) => {
      if (err) {
        console.log(err);
        next(err);
      } else {
        console.log("THIS ONE WORKS");
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = attendeesRouter;
