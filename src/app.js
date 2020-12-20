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

const { MAX_POST_LENGTH } = require(path.join(__dirname, "public", "js", "constants"));

const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

const passworddb = { users: [] };
const memorydb = { users: [], emailToUserId: {}, posts: [], comments: [] };

const idGenerator = function () {
  let i = 0;
  return function newId() {
    return i++;
  };
};

const newUserId = idGenerator();
const newPostId = idGenerator();
const newCommentId = idGenerator();

function getUser(userId) {
  if (userId || userId === 0) {
    return memorydb.users[userId];
  } else {
    return undefined;
  }
}

function getUserByEmail(email) {
  const userId = memorydb.emailToUserId[email];
  return getUser(userId);
}

async function createUser(sanitizedUsername, validatedEmail, password) {
  const userId = newUserId();
  memorydb.users[userId] = {
    id: userId,
    username: sanitizedUsername,
    email: validatedEmail,
    created: Date.now(),
  };
  passworddb.users[userId] = {
    passwordhash: null,
  };
  memorydb.emailToUserId[validatedEmail] = userId;
  await bcrypt.hash(password, saltRounds, function (err, hash) {
    passworddb.users[userId].passwordhash = hash;
    console.log(memorydb.users[userId]);
  });

  return userId;
}

async function createPost(postUserId, sanitizedContent) {
  const postId = newPostId();
  memorydb.posts[postId] = {
    id: postId,
    userId: postUserId,
    content: sanitizedContent,
    comments: [],
    created: Date.now(),
  };
  return postId;
}

function getPost(postId) {
  return memorydb.posts[postId];
}
function getFullPost(postId) {
  let post = getPost(postId);
  return { ...post, user: getUser(post.userId), comments: getFullComments(postId) };
}
function getComments(postId) {
  return memorydb.posts[postId].comments.map((id) => memorydb.comments[id]);
}
function getFullComments(postId) {
  return getComments(postId).map((com) => ({ ...com, user: getUser(com.userId) }));
}
function getFullComment(comment) {
  return { ...comment, user: getUser(comment.userId) };
}

function addCommentToPost(commenterId, sanitizedContent, postId) {
  const commentId = newCommentId();
  memorydb.comments[commentId] = {
    id: commentId,
    content: sanitizedContent,
    userId: commenterId,
    postId: postId,
    created: Date.now(),
  };
  memorydb.posts[postId].comments.push(commentId);
  return commentId;
}

function getPosts(from, to, descending) {
  let posts = [];
  if (descending) {
    const len = memorydb.posts.length;
    posts = memorydb.posts.slice(len - to, len - from);
    posts.reverse();
  } else {
    posts = memorydb.posts.slice(from, to);
  }
  posts = posts.map((post) => ({
    id: post.id,
    user: getUser(post.userId),
    comments: getFullComments(post.id),
    content: post.content,
  }));
  return posts;
}

function getPostsSince(creationTime) {
  return memorydb.posts
    .filter((post) => post.created > creationTime)
    .map((post) => getFullPost(post.id));
}

function partitionByPostId(comments) {
  var obj = {};
  comments.forEach((comment) => {
    if (!obj[comment.postId]) {
      obj[comment.postId] = [];
    }
    obj[comment.postId].push(comment);
  });
  return obj;
}

function getCommentsSince(postIds, creationTime) {
  return partitionByPostId(
    memorydb.comments
      .filter((comment) => comment.created > creationTime && postIds.includes(comment.postId))
      .map(getFullComment)
  );
}

createUser("Microblog-team", "team@microblog.com", "microblog-team").then((userId) => {
  createPost(userId, "Hello!");
});
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

function mustBeLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
}

function mustBeLoggedOut(req, res, next) {
  if (req.session.user) {
    res.redirect("/");
  } else {
    next();
  }
}

app.use("/restricted*", mustBeLoggedIn);
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
  mustBeLoggedOut,
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
      bcrypt.compare(password, passworddb.users[user.id].passwordhash).then(function (result) {
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
  mustBeLoggedOut,
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

app.post(
  "/posts",
  mustBeLoggedIn,
  body("from").isInt(),
  body("to").isInt(),
  body("descending").isBoolean(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { from, to, descending } = req.body;
    const posts = getPosts(from, to, descending);
    res.json({ posts });
  }
);

app.get("/user", mustBeLoggedIn, (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.json(null);
  }
});

app.post(
  "/post",
  mustBeLoggedIn,
  body("content").escape().isLength({ min: 1 }),
  body("userId"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { userId, content } = req.body;
    content = content.slice(0, MAX_POST_LENGTH);
    createPost(userId, content).then((postId) => res.json(getFullPost(postId)));
  }
);

app.post("/newposts", mustBeLoggedIn, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { postIds } = req.body;
  const firstId = postIds[0];
  const lastId = postIds[postIds.length - 1];
  //  const { firstId, lastId } = req.body;
  const posts = postIds.map(getPost);
  const lastPost = Math.max(...posts.map((p) => p.created));
  res.json({ newPosts: getPostsSince(lastPost), posts: postIds.map(getFullPost) });
});

app.post("/post/id", mustBeLoggedIn, body("postId").isInt(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { postId } = req.body;
  res.json(getFullPost(postId));
});

app.post(
  "/comment",
  mustBeLoggedIn,
  body("content").escape().isLength({ min: 1 }),
  body("postId").isInt(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { postId, content } = req.body;
    addCommentToPost(req.session.user.id, content, postId);
    res.sendStatus(200);
  }
);

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
  res.write("<h1>error: " + (err.status || 500) + "</h1>");
  res.end();
});

module.exports = app;
