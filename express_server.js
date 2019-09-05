const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// 1. check if the server is response-able / successfully set 
// 1.1 read HOME route
app.get("/",(req, res) => {
  res.send("Hello!");
});

// 1.2 read URLS route
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// 2.1 add a new route handler for "/urls"
app.get("/urls", (req, res) => {
  // 2.1.1 declare the variable as an object
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL };
  res.render("urls_show", templateVars);
});

// 1.3 read HELLO route
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});