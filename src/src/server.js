const express = require("express");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");
const {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers");

const attendeesRoutes = require("./attendees");

const server = express();

const port = process.env.PORT || 3001;

server.use(express.json());
server.use(cors());

//ROUTES

server.use("/attendees", attendeesRoutes);

// ERROR HANDLERS

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.log(listEndpoints(server));

server.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    console.log("Running on cloud on port", port);
  } else {
    console.log("Running locally on port", port);
  }
});
