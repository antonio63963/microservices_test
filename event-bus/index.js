const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.post("/events", (req, res) => {
  const event = req.body;
  console.log(req.body);

  axios.post("http://localhost:4000/events", event);
  axios.post("http://localhost:4001/events", event);
  axios.post("http://localhost:4002/events", event);
  axios.post("http://localhost:4003/events", event);

  res.send({ status: "ok" });
});

app.listen(4005, () => console.log("Server EventBus has ran on port 4005"));
