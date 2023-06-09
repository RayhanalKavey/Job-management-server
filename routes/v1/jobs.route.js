const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

module.exports = function (jobCollection) {
  /** JS Docker
   * @api {get}
   * @apiDescription Get all Jobs
   * @apiSuccess {Object[]} all the jobs
   */
  router.get("/", async (req, res) => {
    let query = {};
    const jobs = await jobCollection
      .find(query)
      .sort({ currentDate: -1 })
      .toArray();
    res.send(jobs);
  });
  router.get("/fresherJobs", async (req, res) => {
    let query = {};
    let jobType = req.query.jobType;
    if (jobType === "fresher") {
      query = { fresherJob: true };
    }
    const jobs = await jobCollection
      .find(query)
      .sort({ currentDate: -1 })
      .limit(6)
      .toArray();
    res.send(jobs);
  });
  router.get("/experiencedJobs", async (req, res) => {
    let query = {};
    let jobType = req.query.jobType;
    if (jobType === "experienced") {
      query = { experiencedJob: true };
    }
    const jobs = await jobCollection
      .find(query)
      .sort({ currentDate: -1 })
      .limit(6)
      .toArray();
    res.send(jobs);
  });
  router.get("/applicant-job/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const job = await jobCollection.findOne(query);
    res.send(job);
  });
  router.get("/applied-jobs", async (req, res) => {
    const userId = req.query.userId;
    const jobs = await jobCollection
      .find({ "applicants.userId": userId })
      .sort({ currentDate: -1 })
      .toArray();
    res.send(jobs);
  });
  router.patch("/closeAJob/:id", async (req, res) => {
    console.log("hit");
    const id = req.params.id;
    console.log("req.params.id", id);

    const filter = { _id: new ObjectId(id) };

    const updatedDoc = {
      $set: { isClosed: true },
    };
    const result = await jobCollection.updateOne(filter, updatedDoc);

    res.send(result);
  });
  router.patch("/reopenAJob/:id", async (req, res) => {
    console.log("hit");
    const id = req.params.id;

    const filter = { _id: new ObjectId(id) };

    const updatedDoc = {
      $set: { isClosed: false },
    };
    const result = await jobCollection.updateOne(filter, updatedDoc);

    res.send(result);
  });
  router.get("/posted-jobs", async (req, res) => {
    const email = req.query.email;
    const jobs = await jobCollection
      .find({ email: email })
      .sort({ currentDate: -1 })
      .toArray();
    res.send(jobs);
  });
  router.get("/pagination", async (req, res) => {
    let query;
    let count;
    const page = req.query.page;
    const size = parseInt(req.query.size);
    const jobTypes = req.query.jobTypes;
    if (jobTypes) {
      if (jobTypes === "All Jobs") {
        query = {};
        const filteredJobs = await jobCollection.find(query).toArray();
        count = await filteredJobs.length;
      }
      if (jobTypes === "Fresher Jobs") {
        query = { fresherJob: true };
        const filteredJobs = await jobCollection.find(query).toArray();
        count = await filteredJobs.length;
      }
      if (jobTypes === "Experienced Jobs") {
        query = { experiencedJob: true };
        const filteredJobs = await jobCollection.find(query).toArray();
        count = await filteredJobs.length;
      }

      const jobs = await jobCollection
        .find(query)
        .skip(page * size)
        .limit(size)
        .toArray();
      // const count = await jobCollection.estimatedDocumentCount();

      res.send({ jobs, count });
    }
  });

  router.post("/", async (req, res) => {
    const job = req.body;
    const result = await jobCollection.insertOne(job);
    res.send(result);
  });
  router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await jobCollection.deleteOne(query);
    res.send(result);
  });
  router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const newJob = req.body;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updatedDoc = {
      $set: newJob,
    };
    const result = await jobCollection.updateOne(filter, updatedDoc, options);
    res.send(result);
  });
  router.patch("/jobApply", async (req, res) => {
    const jobId = req.body.applyJobId;
    const userId = req.body.applyUserId;
    const userEmail = req.body.applyUserEmail;
    const appliedTime = req.body.currentDate;

    const filter = { _id: new ObjectId(jobId) };
    const updatedDoc = {
      $push: { applicants: { userId, userEmail, appliedTime, jobId } },
    };
    const result = await jobCollection.updateOne(filter, updatedDoc);
    // if (result.acknowledged) {
    // res.send(result);
    // }
    res.send(result);
  });
  router.patch("/employerMessage", async (req, res) => {
    const jobId = req.body.jobId;
    const userId = req.body.userId;
    const message = req.body.message;
    const messageDate = req.body.messageDate;
    const filter = { _id: new ObjectId(jobId), "applicants.userId": userId };
    const updatedDoc = {
      $push: {
        "applicants.$.conversation": {
          text: message,
          time: messageDate,
          employerSender: true,
        },
      },
    };
    const result = await jobCollection.updateOne(filter, updatedDoc);
    res.send(result);
  });
  router.patch("/jobSeekerMessage", async (req, res) => {
    // console.log(req.body);
    const jobId = req.body.jobId;
    const userId = req.body.userId;
    const message = req.body.message;
    const messageDate = req.body.messageDate;
    const filter = { _id: new ObjectId(jobId), "applicants.userId": userId };
    const updatedDoc = {
      $push: {
        "applicants.$.conversation": {
          text: message,
          time: messageDate,
          jobSeekerSender: true,
        },
      },
    };
    const result = await jobCollection.updateOne(filter, updatedDoc);
    res.send(result);
  });

  return router;
};
