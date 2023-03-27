const express = require("express");
const router = express.Router();

module.exports = (blogsCollection) => {
  /** JS Docker
   * @api {get}
   * @apiDescription Get all users
   * @apiSuccess {Object[]} all the users
   */
  router.get("/", async (req, res) => {
    let query = {};
    const blogs = await blogsCollection.find(query).toArray();
    res.send(blogs);
  });

  router.post("/", async (req, res) => {
    const blog = req.body;
    // console.log("Received post employer", user);
    const result = await blogsCollection.insertOne(blog);
    res.send(result);
  });
  return router;
};
