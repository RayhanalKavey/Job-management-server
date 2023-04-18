const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const dbConnect = require("./utils/dbConnect");
const jobsRoutes = require("./routes/v1/jobs.route");
const userRoutes = require("./routes/v1/user.route");
const reviewRoutes = require("./routes/v1/review.route");
const blogRoutes = require("./routes/v1/blog.route");

require("dotenv").config();
require("colors");

const app = express();
const port = process.env.PORT || 5005;

// Get dummy jobs from jobs.json file
// const jobs = require("./jobs.json");

//Middleware
app.use(cors());
app.use(express.json());

/*=========================
 //Connect to the database
  =========================  */
dbConnect()
  .then((client) => {
    /* ----------------------------------
    * All collection and API call start
    ----------------------------------- */

    try {
      /* ----Job Collection and Jobs API call---- */
      const jobCollection = client.db("jobManagement").collection("jobs");
      app.use("/api/v1/jobs", jobsRoutes(jobCollection));

      /* ----User Collection and User API call---- */
      const userCollection = client.db("jobManagement").collection("user");
      app.use("/api/v1/user", userRoutes(userCollection));

      /* ----User review Collection and review API call---- */
      const reviewCollection = client.db("jobManagement").collection("reviews");
      app.use("/api/v1/reviews", reviewRoutes(reviewCollection));
      /* ----Blog Collection and blog API call---- */
      const blogsCollection = client.db("jobManagement").collection("blogs");
      app.use("/api/v1/blogs", blogRoutes(blogsCollection));

      // testing server
      app.get("/api/v1", (req, res) => {
        res.send("Welcome to the Job Management server.");
      });
      app.get("/", (req, res) => {
        res.send(
          "Welcome to the Job Management server. base starting route= http....../api/v1"
        );
      });
    } finally {
    }

    /* --------------------------------
    * All collection and API call end
    --------------------------------- */

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
