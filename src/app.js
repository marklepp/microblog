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

const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

const memorydb = { users: {}, emails: {} };

const newUserId = (function () {
  let i = 0;
  return function newUserId() {
    return i++;
  };
})();

function getUser(userId) {
  if (userId || userId === 0) {
    return memorydb.users[userId];
  } else {
    return undefined;
  }
}

function getUserByEmail(email) {
  const userId = memorydb.emails[email];
  return getUser(userId);
}

async function createUser(sanitizedUsername, validatedEmail, password) {
  const userId = newUserId();
  memorydb.users[userId] = {
    username: sanitizedUsername,
    email: validatedEmail,
    passwordhash: null,
  };
  memorydb.emails[validatedEmail] = userId;
  await bcrypt.hash(password, saltRounds, function (err, hash) {
    memorydb.users[userId].passwordhash = hash;
    console.log(memorydb.users[userId]);
  });

  return userId;
}

createUser("asdf", "asdf@asdf.com", "asdf");

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

app.use("/restricted*", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
});
app.use(express.static(path.join(__dirname, "..", "dist")));

app.get("/", (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, "..", "dist", "restricted.main.html"));
  } else {
    res.redirect("/login");
  }
});

["/login", "/register"].forEach((reqpath) => {
  app.get(reqpath, (req, res) => {
    if (req.session.user) {
      res.redirect("/");
    } else {
      res.sendFile(path.join(__dirname, "..", "dist", "login.html"));
    }
  });
});

app.post(
  "/login",
  // validate email and password
  body("email").trim().isEmail(),
  body("password").isLength({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = getUserByEmail(email);
    if (user) {
      bcrypt.compare(password, user.passwordhash).then(function (result) {
        if (result) {
          req.session.user = user;
          res.sendStatus(200);
        } else {
          res.status(401).json({ password: true });
        }
      });
    } else {
      res.status(401).json({ email: true });
    }
  }
);

app.post(
  "/register",
  body("username").trim().escape().isLength({ min: 1 }),
  body("email").trim().isEmail(),
  body("password").isLength({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;

    const emailFound = Boolean(getUserByEmail(email));

    if (emailFound) {
      console.log("found");
      return res.status(409).json({ email: emailFound });
    }

    createUser(username, email, password).then((userId) => {
      req.session.user = getUser(userId);
      res.sendStatus(200);
    });
  }
);

(function () {
  function destroySession(req, res, next) {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.sendStatus(200);
      }
    });
  }

  app.get("/logout", destroySession);
  app.post("/logout", destroySession);
})();

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
  res.write("<h1>error: " + err.status + "</h1>");
  res.end();
});

module.exports = app;
