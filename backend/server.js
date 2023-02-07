const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { readdirSync } = require("fs");
const dotenv = require("dotenv");
const { log } = require("console");
dotenv.config();

let allowed = ["http://localhost:3000", "some other link"];

function options(req, res) {
  let tmp;

  let origin = req.header("Origin");
  if (allowed.indexOf(origin) > -1) {
    tmp = {
      origin: true,
      optionSuccessStatus: 200,
    };
  } else {
    tmp = {
      origin: "stupid",
    };
  }
  res(null, tmp);
}

const app = express();
app.use(cors(options));

// routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

//database
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => console.log("Error connecting to mongodb", error));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`API is running on port ${PORT}..`);
});
