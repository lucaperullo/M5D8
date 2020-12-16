const express = require("express");
const { getAttendees, writeAttendees } = require("../fsUtilities.js");
const uniqid = require("uniqid");
const sgMail = require("@sendgrid/mail");

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
      to: req.body.Email,
      from: "lucaperullo@outlook.it",
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

module.exports = attendeesRouter;
