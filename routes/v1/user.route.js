const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

module.exports = (userCollection) => {
  /** JS Docker
   * @api {get}
   * @apiDescription Get all users
   * @apiSuccess {Object[]} all the users
   */
  router.get("/", async (req, res) => {
    let query = {};
    const users = await userCollection.find(query).toArray();
    res.send(users);
  });
  router.post("/", async (req, res) => {
    const user = req.body;
    // console.log("Received post employer", user);
    const result = await userCollection.insertOne(user);
    res.send(result);
  });
  router.patch("/employer", async (req, res) => {
    const id = req.body._id;
    const newUser = req.body;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: { isEmployer: true, regAsEmployer: newUser },
    };

    const result = await userCollection.updateOne(filter, updatedDoc);
    res.send(result);
  });
  router.patch("/jobSeeker", async (req, res) => {
    const id = req.body._id;
    const newUser = req.body;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: { isJobSeeker: true, regAsJobSeeker: newUser },
    };

    const result = await userCollection.updateOne(filter, updatedDoc);
    res.send(result);
  });
  return router;
};
