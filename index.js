const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const dbConnect = require("./utils/dbConnect");

require("dotenv").config();
require("colors");

const app = express();
const port = process.env.PORT || 5003;

// const jobs = require("./jobs.json");

//Middleware
app.use(cors());
app.use(express.json());

/*=========================
 //Connect to the database
  =========================  */
dbConnect()
  .then((client) => {
    const jobCollection = client.db("jobManagement").collection("jobs");

    // console.log(client);

    app.get("/", (req, res) => {
      res.send("Welcome to the Job Management server.");
    });

    // Start the server once connected to the database
    app.listen(port, () => {
      console.log(
        `Job management server in running on port: ${port}`.rainbow.bgWhite
      );
    });
  })
  .catch((error) => {
    console.log("Error connecting to the database:", error);
  });
