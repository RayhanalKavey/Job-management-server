const express = require("express");
const router = express.Router();

module.exports = (reviewCollection) => {
  /** JS Docker
   * @api {get}
   * @apiDescription Get all reviews
   * @apiSuccess {Object[]} all the reviews
   */
  router.get("/", async (req, res) => {
    let query = {};
    const reviews = await reviewCollection.find(query).toArray();
    res.send(reviews);
  });

  router.post("/", async (req, res) => {
    const review = req.body;
    // console.log("Received post employer", user);
    const result = await reviewCollection.insertOne(review);
    res.send(result);
  });
  return router;
};
