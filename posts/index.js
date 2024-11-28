const express = require("express");
const {randomBytes} = require('node:crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));

const posts = {};

app.use('/*', (req, res, next) => {
  console.log('CHECK ROUTE: ', req.baseUrl)
  next();
});

app.get("/posts", (req, res, next) => {
  console.log('POSTS: ', posts)
  res.send(posts);
});

app.post("/posts", async(req, res, next) => {
  const id = randomBytes(4).toString('hex');
  const {title} = req.body;

  posts[id] = {
    id,
    title
  };
  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: {
      id,
      title
    },
  })
  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Received Event: ', req.body.type);

  res.send({})
})

app.listen(4000, () => console.log("Servers has ran on port 4000"));
