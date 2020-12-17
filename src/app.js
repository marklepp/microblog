const express = require("express");
const session = require("express-session");
const path = require("path");
const createError = require("http-errors");
//var express = require("express");
//var path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
//const Promise = require("bluebird");

// Include external files (edit as required)
//var indexRouter = require("./routes/index");
//var postsRouter = require("./routes/posts");

const app = express();

// Use logging and set settings - default
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.set('trust proxy', 1) // trust first proxy
app.use(
  session({
    secret: "asdf",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, sameSite: "strict" }, //trust proxy needed for secure: true
  })
);
// app.use(express.static(path.join(__dirname, "public")));

// Define routes (edit as required)
// app.use("/", indexRouter);
// app.use("/posts", postsRouter);

var sessn;
app.use("/restricted*", (req, res, next) => {
  if (req.session.email) {
    next();
  } else {
    res.redirect("/");
  }
});
app.use(express.static(path.join(__dirname, "..", "dist")));
app.get("/", (req, res) => {
  sessn = req.session;

  if (sessn.email) {
    res.sendFile(path.join(__dirname, "..", "dist", "restricted.main.html"));
  } else {
    res.sendFile(path.join(__dirname, "..", "dist", "login.html"));
    //res.sendFile(path.join(__dirname, "..", "login.html"));
  }
});

app.post("/login", (req, res, next) => {
  // validate email and password
  req.session.email = req.body.email;
  res.redirect("/");
});
app.post("/logout", (req, res, next) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

/*
var ssn;
app.get('/',function(req,res) { 
  ssn = req.session; 
  if(ssn.email) {
    res.redirect('/admin');
  } else {
    res.render('index.html');
  }
});
app.post('/login',function(req,res){
  ssn = req.session;
  ssn.email=req.body.email;
  res.end('done');
});
app.get('/admin',function(req,res){
  ssn = req.session;
  if(ssn.email) {
    res.write('<h1>Hello '+ssn.email+'</h1>');
    res.end('<a href="+">Logout</a>');
  } else {
    res.write('<h1>login first.</h1>');
    res.end('<a href="+">Login</a>');
  }
});
app.get('/logout',function(req,res){
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

*/

/*
// Connect to database
var db = require("./db");
db.connect(db.urlbuilder(), function (err) {
  if (err) {
    console.log("Unable to connect to Mongo.");
    process.exit(1);
  }
});
*/

// Catch 404 and forward to error handler - default
app.use(function (req, res, next) {
  next(createError(404));
});

// Register error handler - default
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render("error");
});

module.exports = app;
