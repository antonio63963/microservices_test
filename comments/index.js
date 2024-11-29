const express = require("express");
const { randomBytes } = require("node:crypto");
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));

const commentsByPostId = {};

app.use('/*', (req, res, next) => {
  console.log('CHECKING: ', req.baseUrl);
  next();
})

app.get("/posts/:id/comments", (req, res, next) => {
  const { id } = req.params;
  res.send(commentsByPostId[id] || []);
});

app.post("/posts/:id/comments", async(req, res, next) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const postId = req.params.id;

  const comments = commentsByPostId[postId] || [];
  const createdComment = { id: commentId, postId: postId, content, status: 'pending' };

  comments.push(createdComment);
  console.log(comments)
  commentsByPostId[postId] = comments;
console.log('CREATED COMMENT: ', createdComment)
  await axios.post('http://localhost:4005/events', {
     type: 'CommentCreated',
     data: createdComment
  })

  res.status(201).send(comments);
});

app.post('/events', async(req, res) => {
  const {type, data } = req.body;

  if(type === 'CommentModerated') {
    const {id, status, postId} = data;
    console.log('Comments MODER: ', commentsByPostId)
    const comment = commentsByPostId[postId].find(c => c.id === id);
    comment.status = status;
    console.log('CommentModerated: ', comment)

     await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: comment
     })
  }

  res.send({})
})

app.listen(4001, () => console.log("Server has ran on port 4001"));

process.on('uncaughtException', function (err) {
  console.log('ERRROROR: ', err);
});