const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json({ expanded: true }));

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if ((type === "CommentCreated")) {
    data.status = data.content.includes("orangne") ? "rejected" : "approved";
    console.log('CommentCreated: ', data);
  const resp = await axios.post("http://localhost:4005/events", {
      type: "CommentModerated",
      data: data,
    });
    console.log("RESP: ", resp)
    res.send({});
  }
});

app.listen(4003, () => console.log("Moderation has ran on port 4003"));

process.on('uncaughtException', function (err) {
  console.log('ERRROROR: ', err);
});