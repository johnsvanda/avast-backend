const express = require("express");
const app = express();
const axios = require("axios");
const fs = require("fs");

app.use(express.json());

app.get("/accounts", (req, res) => {
  let data = fs.existsSync("./accounts.json")
    ? fs.readFileSync("accounts.json")
    : [];

  res.send(data);
});

app
  .get("/mockAccounts", (req, res) => {
    let responseData;
    axios
      .get("https://swapi.dev/api/people")
      .then((response) => {
        responseData = response.data;
        res.send(responseData);
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .on("error", (err) => {
    console.log("Error: " + err.message);
  });

app.post("/registerAccount", (req, res) => {
  const newData = req.body;

  /* fs.appendFile("./accounts.json", JSON.stringify(newData, null, 2), (err) =>
    console.log(err)
  ); */

  let prevData;
  if (fs.existsSync("./accounts.json")) {
    let data = fs.readFileSync("accounts.json");
    prevData = JSON.parse(data);
  } else {
    prevData = [];
  }

  prevData.push(newData);
  fs.writeFile("accounts.json", JSON.stringify(prevData, null, 2), (err) =>
    console.error(err)
  );

  res.status(200).send("Your account has been successfully registered.");
});

const listener = app.listen(process.env.PORT || 4000, (req) => {
  console.log("Server is running..", listener.address().port);
});
