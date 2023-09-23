

const Profile = require("../models/Profile.model");

module.exports = (req, res, next) => {
  if (!req.session.currentUser) {
    res.locals.isLoggedIn = false;
    return res.redirect("/auth/login");
  }

  else{

    const userId = req.session.currentUser._id;
    Profile.find({ user: userId })
    .then((foundProfile) => {
      res.locals.isLoggedIn = true;
      res.locals.profile = foundProfile;
      next();
    })
    .catch((error) => {
      console.log("error while finding profiles:", error);
      res.locals.isLoggedIn = true;
      res.locals.profile = null;
      next();
    });
  }
};



