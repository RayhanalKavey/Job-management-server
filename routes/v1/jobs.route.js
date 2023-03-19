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

  return router;
};
