const express = require("express");
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

  return router;
};
