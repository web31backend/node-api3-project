const express = require('express');

const router = express.Router();

let db = require("../users/userDb");
let postDB = require("../posts/postDb");

router.post('/', validateUser, (req, res) => { // completed
  // do your magic!
  // console.log(req.user, "req.user");
  db.insert(req.user)
  .then(newUser => {
    res.status(201).json(newUser)
  })
  .catch(err => res.status(500).json({ error: "Post request denied, must be unique" }))
});

router.post('/:id/posts', validatePost, (req, res) => { // completed
  // do your magic!
  postDB.insert(req.post)
  .then(newPost => {
    res.status(201).json(newPost);
  })
  .catch( err => res.status(500).json({ errrorMessage: "Could not add post" }));
});

router.get('/', (req, res) => { // completed
  // do your magic!
  db.get()
  .then(users => {
    res.status(200).json(users);
  })
  .catch( err => {
    res.status(500).json({ errrorMessage: "Could not process request" });
  })
});

router.get('/:id', validateUserId, (req, res) => {// completed
  // do your magic!
  res.status(200).json(req.user);

});

router.get('/:id/posts', validateUserId, (req, res) => {// completed
  // do your magic!
  db.getUserPosts(req.params)
  .then(posts => {
    res.status(200).json(posts);
    
  })
  .catch(err => res.status(500).json( { errrorMessage: "Could not get posts for user " }));
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  db.remove(req.params)
  .then(deletedIDs => {
    if (deletedIDs > 0) {
      res.status(200).json({ message: `removed user with id: ${req.params}` })
    } else {
      res.status(500).json({ errorMessage: "Could not remove user" });
    }
  })
  .catch(err => res.status(500).json({ errorMessage: "Could not remove user" }));
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  console.log(req.params, req.body)
  db.update(req.params, req.body)
  .then(count => {
    if (count > 0) {
      res.status(200).json(req.body)
    } else {
      res.status(500).json({ errorMessage: "Could not change user data22" })
    }
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Could not change user data11" })
  })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  let id = req.params.id
  db.getById(id)
  .then(user => {
      if(user) {
          req.user = user;
          req.params = id; 
          next();
      } else {
          res.status(404).json({ message: `Could not find user with id ${id}`})
      }
  })
  .catch(err => {
      console.log(err, "500 at validating ID GET")
      res.status(500).json({ errrorMessage: "Could not validate user id" });
  })
}

function validateUser(req, res, next) {
  // do your magic!
  let newUser = req.body;
  req.user = newUser;
  if(!newUser) {
    res.status(400).json({ error: "missing user data" });
  } else if(!newUser.name) {
    res.status(404).json({ error: "missing required name field"});
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  // do your magic!
  let id = req.params.id;
  let newPost = req.body;

  req.post = {...newPost, user_id: id};
  req.params = id;

  if(!newPost) {
    res.status(400).json({ message: "missing require post data" });
  } else if(!newPost.text) {
    res.status(400).json({ message: "missing required text field" })
  } else {
    next();
  }

}

module.exports = router;
