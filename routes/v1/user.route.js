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
  router.get("/applicant/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const user = await userCollection.find(query).toArray();
    const filteredInfo = user[0]?.regAsJobSeeker;

    // console.log(user);
    res.send(filteredInfo);
  });
  router.get("/current", async (req, res) => {
    const email = req.query.email;
    const user = await userCollection.find({ userEmail: email }).toArray();
    if (user[0] && email) {
      res.send({ status: true, user: user[0] });
    } else {
      res.send({ status: false });
    }
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
