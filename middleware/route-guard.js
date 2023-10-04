const isAuthenticated = (req, res, next) => {
    res.locals.isAuthenticated = !!req.session.currentUser;
    next();
  };
  
  const isLoggedIn = (req, res, next) => {
    
    if (!req.session.currentUser) {
      res.locals.isLoggedIn = false;
      res.locals.isLoggedOut = false;
  
      res.locals.isLoggedOut = true;
      return res.redirect("/auth/login");
    } else {
      const userId = req.session.currentUser._id;
      Profile.find({ user: userId })
        .then((foundProfile) => {
          res.locals.isLoggedIn = true;
          res.locals.profile = foundProfile;
          next();
        })
        .catch((error) => {
          console.log("error while finding profiles:", error);
          res.locals.profile = null;
          next();
        });
    }
  };
  const isLoggedOut = (req, res, next) => {
    
    if (req.session.currentUser) {
      res.locals.isLoggedIn = true;
      res.locals.isLoggedOut = true;
      console.log("User is logged in", res.locals.isLoggedIn);
      return res.redirect("/");
    }
    next();
  };