const { reset } = require("nodemon");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});
//1. Make sure the fields are filled out
router.post("/signup", (req, res, next) => {
  if (!req.body.usernmae || !req.body.password) {
    res.render("signup", { message: "Username and Password required" });
  }
  //2. make sure the username/email is not already taken
  User.findOne({ username: req.body.username }).then((foundUser) => {
    if (foundUser) {
      res.render("signup", { message: "User name is taken" });
    } else {
      //3. Hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      console.log("SALT", salt);

      const hashedPass = bcrypt.hashSync(req.body.password, salt);
      console.log("hashedPass", hashedPass);
      //4. Create the user
      User.create({
        username: req.body.username,
        password: hashedPass,
      })
        .then((createdUser) => {
          res.json(createdUser);
        })
        .catch((err) => {
          console.log("Error creating user".err.message);
        });
    }
  });
});

module.exports = router;
