const express = require("express");
const router = express.Router();

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
  return router;
};
