const express = require("express");
const app = express();
const PORT = 8080;
// 1
app.set("view engine", "ejs");

// 4
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
// 9 need cookieParser middleware before we can do anything with cookies
var cookieParser = require('cookie-parser');
app.use(cookieParser());

//5 gererateRandomString()
const generateRandomString = function(n) {
  // Map to store 62 possible characters
  let map = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let shortUrl = "";
  
  // Convert given integer id to a base 62 number
  while (n) {
    let index = Math.floor(Math.random() * Math.floor(62));
    shortUrl += map[index];
    n --;
  }

  return shortUrl;
};

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
  let templateVars = {};
  // 2.1.1 declare the variable as an object
  if(req.body.username){
    templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  }else {
    templateVars = { urls: urlDatabase, username: "" };
    // res.redirect('/urls');
  }
  // console.log(username);
  res.render("urls_index", templateVars);
});

// 3.1 add a new GET route
// if we place this route after the /urls/:id definition,
// any calls to /urls/new will be handled by app.get("/urls/:id", ...)
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// 4.1 add a new POST route
// When our browser submits a POST request,
// the data in the request body is sent as a Buffer. While this data type is great for transmitting data, it's not readable for us humans.
app.post("/urls", (req, res) => {
  // log the content of the specified id in <input>
  // console.log(req.body);  // Log the POST request body to the console
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
  // 6.1 generate ramdom short URL
  let shortURL = generateRandomString(6);
  // 6.2 pair up and store
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls');
});

// 7 it receives a POST request to /urls it responds with a redirection to /urls/:shortURL, where shortURL is the random string we generated.
app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  console.log(longURL);
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL };
  res.render("urls_show", templateVars);
});

// 8 handle the delete POST delete function
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

// app.get('/login', function (req, res) {
//   // Cookies that have not been signed
//   console.log('Cookies: ', req.cookies)

//   // Cookies that have been signed
//   console.log('Signed Cookies: ', req.signedCookies)
// })

app.post("/login", (req, res) => {
  let username = req.body.username;
  // set the cookie here
  res.cookie('username', username);
  res.redirect('/urls');
});

// // 1.3 read HELLO route
// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.get('*', (request, response) => {
  response.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});