const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// User schema
const User = require("../models/User.model");

// middleware
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

/*////////////////////////////////////////////////////////////// 
GET SIGNUP PAGE
 */
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});
/*////////////////////////////////////////////////////////////// 
POST SIGNUP FORM
 */
router.post("/signup", isLoggedOut, (req, res) => {
  const { username, email, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });

    return;
  }

  if (password.length < 6) {
    res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });

    return;
  }

  
  // Create a new user - start by hashing the password
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // Create a user and save it in the database
      return User.create({ username, email, password: hashedPassword });
    })
    .then((user) => {
      res.render("auth/login");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Provide a valid username or email.",
        });
      } else {
        next(error);
      }
    });
});

/*////////////////////////////////////////////////////////////// 
GET LOGIN PAGE
 */
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

/*////////////////////////////////////////////////////////////// 
POST LOGIN FORM
 */
router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  // Check that username, and password are provided
  if (username === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage: "Please provide username and password.",
    });

    return;
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 6) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
        return;
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("auth/login", { errorMessage: "Wrong credentials." });
            return;
          }

          // Add the user object to the session object
          req.session.currentUser = user.toObject();
          // Remove the password field
          delete req.session.currentUser.password;

          res.redirect("/profile/profile");
        })
        .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
    })
    .catch((err) => next(err));
});

/*////////////////////////////////////////////////////////////// 
GET MY ACCOUNT PAGE
 */
router.get("/userProfile", isLoggedIn, (req, res) => {
  const user = req.session.currentUser;
  const username = user.username;
  User.find({ username })
    .then((foundProfile) => {
      res.render("auth/user", {
        userInSession: req.session.currentUser,
        user: foundProfile,
      });
    })
    .catch((error) => {
      console.log("error while finding user by id:", error);
    });
});

/*////////////////////////////////////////////////////////////// 
GET UPDATE A PROFILE PAGE
 */
router.get("/update/:id", isLoggedIn, (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId).then((user) => {
    res.render("auth/userUpdate", { userId, user: user });
  });
});

/*////////////////////////////////////////////////////////////// 
POST UPDATE A PROFILE FORM
*/
router.post("/update/:id", isLoggedIn, (req, res, next) => {
  const userId = req.params.id;
  let { username, email, password, newPassword } = req.body;

  //First check the password to allow update
  // Check that username, and password are provided
  if (username === "" || email === "" || password === "") {
    User.findById(userId).then((user) => {
      res.render("auth/userUpdate", {
        userId,
        user: user,
        errorMessage:
          "Make at least one change and confirm with your current password",
      });
    });
    return;
  }

  if (password.length < 6) {
    User.findById(userId).then((user) => {
      res.render("auth/userUpdate", {
        userId,
        user: user,
        errorMessage: "Your password needs to be at least 6 characters long.",
      });
    });
    return;
  }
  if (newPassword === "") {
    newPassword = password;
  }

  // Search the database for a user with the email submitted in the form
  User.findById(userId).then((user) => {
    // If the user isn't found, send an error message that user provided wrong credentials
    if (!user) {
      res
        .status(400)
        .render("/update/:id", { errorMessage: "Wrong credentials." });
      return;
    }

    // If user is found based on the username, check if the in putted password matches the one saved in the database
    bcrypt
      .compare(password, user.password)
      .then((isSamePassword) => {
        if (!isSamePassword) {
          res
            .status(400)
            .render("/update/:id", { errorMessage: "Wrong credentials." });
          return;
        }

        bcrypt
          .genSalt(saltRounds)
          .then((salt) => bcrypt.hash(newPassword, salt))
          .then((hashedPassword) => {
            // Create a user and save it in the database
            return User.findByIdAndUpdate(
              userId,
              { username, email, password: hashedPassword },
              { new: true }
            ).then((updatedUser) => {
              req.session.destroy((err) => {
                if (err) {
                  res
                    .status(500)
                    .render("auth/logout", { errorMessage: err.message });
                  return;
                }
                res.render("auth/login");
              });
            });
          })
          .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
      })
      .catch((err) => next(err));
  });
});

/*////////////////////////////////////////////////////////////// 
GET LOG OUT
 */
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message });
      return;
    }

    res.redirect("/");
  });
});

/* module.exports */
module.exports = router;
