const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

module.exports = function (applyCollection) {
  router.get("/", async (req, res) => {
    let query = {};
    const data = await applyCollection.find(query).toArray();
    res.send(data);
  });

  /** JS Docker
   * @api {get}
   * @apiDescription post a job apply for a registered job seeker
   * @apiSuccess {Object[]} all the jobs
   */
  router.post("/", async (req, res) => {
    const applyJob = req.body;
    const result = await applyCollection.insertOne(applyJob);
    res.send(result);
  });
  return router;
};
