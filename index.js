const connectionOptions = {
  connectionString:
    "postgres://default:gnY4I5WejGJA@ep-blue-voice-680699.us-east-1.postgres.vercel-storage.com:5432/verceldb",
  ssl: true,
};

const express = require("express");
const pgp = require("pg-promise")();
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const registration = require("./registration");
const login = require("./login");
const quiz = require("./quiz");
const submit = require("./submit");
const profile = require("./profile");
const reset_password = require("./reset_password");

const app = express();
const db = pgp(connectionOptions);

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/api/login", login(db));
app.post("/api/register", registration(db));
app.get("/api/quiz", quiz(db));
app.post("/api/submit", submit(db));
app.get("/api/profile", profile(db));
app.post("/api/reset_password", reset_password(db));

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
