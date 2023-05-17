require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const path = require("path");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const flash = require("connect-flash");



app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "images")));

app.set("view engine", "ejs");
app.set("views", "views");

// const store = new MongoDBStore({
//   uri: process.env.DB_URL,
//   collection: "sessions",
// });

// app.use(
//   session({
//     secret:
//       "This is a secretThis is a secretThis is a secretThis is a secretThis is a secretThis is a secret",
//     saveUninitialized: true,
//     store: store,
//   })
// );



app.listen(port, (err) => {
  console.log(`server listen on port ${port} `);
});
