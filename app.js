// Basic Express set up
const express = require("express");
var cors = require('cors');
const app = express();
const compression = require("compression");

const routes = require("./routes/routes");
// compress all responses
app.use(compression());
// use it before all route definitions
app.use(cors({origin: 'http://localhost:3000'}));
// Body parser to recieve JSON data
const bodyParser = require("body-parser");

// Set bodyparsers to allow JSON
app.set("views", "./public");
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve files from the static directory /public
app.use(express.static("public"));

// where all calls will go to 
app.use('/', routes);

// Express Port assignment
app.set("port", process.env.PORT || 3030);

// listen on port that was defined
const server = app.listen(app.get("port"), () => {
  let port = server.address().port;
  console.log(`Running on port  http://localhost:${port}`);
});
