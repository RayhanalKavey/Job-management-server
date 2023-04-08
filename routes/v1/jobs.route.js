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
    const jobs = await jobCollection.find(query).toArray();
    res.send(jobs);
  });
  router.get("/applied-jobs", async (req, res) => {
    let query = {};
    const userId = req.query.userId;
    const jobs = await jobCollection
      .find({ "applicants.userId": userId })
      .sort({ currentDate: -1 })
      .toArray();

    res.send(jobs);
  });
  router.get("/pagination", async (req, res) => {
    let query = {};
    const page = req.query.page;
    const size = parseInt(req.query.size);
    const jobs = await jobCollection
      .find(query)
      .skip(page * size)
      .limit(size)
      .toArray();
    const count = await jobCollection.estimatedDocumentCount();
    res.send({ jobs, count });
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

    const appliedTime = new Date();
    const filter = { _id: new ObjectId(jobId) };
    const updatedDoc = {
      $push: { applicants: { userId, userEmail, appliedTime } },
    };
    const result = await jobCollection.updateOne(filter, updatedDoc);
    // if (result.acknowledged) {
    // res.send(result);
    // }
    res.send(result);
  });

  return router;
};
