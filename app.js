// Basic Express set up
const express = require("express");
const app = express();
const compression = require("compression");
const getcontent = require("./getContent");

// compress all responses
app.use(compression());

// Body parser to recieve JSON data
const bodyParser = require("body-parser");

// Set bodyparsers to allow JSON
app.set("views", "./public");
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve files from the static directory /public
app.use(express.static("public"));

app.get("/", (req, res) => {
  getcontent()
    .then((data) => {
      res.render("index", {
        data: data,
      });
    })
    .catch((e) => {
      res.status(500).json({ error: "message", log: e });
    });
});

app.get("/error", (req, res) => {
  // res.send('Hello!');
});

// Express Port assignment
app.set("port", process.env.PORT || 5000);

// listen on port that was defined
const server = app.listen(app.get("port"), () => {
  let port = server.address().port;
  console.log(`Running on port  http://localhost:${port}`);
});
