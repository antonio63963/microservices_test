const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json({ expanded: true }));

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if ((type === "CommentCreated")) {
    data.status = data.status.includes("orangne") ? "rejected" : "approved";
    await axios.post("http://localhost:4005", {
      type: "CommentModerated",
      data: data,
    });
  }
  res.send({});
});

app.listen(4003, () => console.log("Moderation has ran on port 4003"));
