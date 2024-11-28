const express = require("express");
const cors = require("cors");

const app = express();

const posts = {};

app.use(cors());
app.use(express.json({ extended: true }));

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type == "PostCreated") {
    const { id } = data;
    posts[id] = { ...data, comments: [] };
  }
  if (type == "CommentCreated") {
    const { postId, content, id, status } = data;
    posts[postId].comments.push({ id, content, status });
  }

  res.send({});
});

app.listen(4002, () => {
  console.log("Server Query started on port ", 4002);
});
