const isAuthenticated = (req, res, next) => {
  res.locals.isAuthenticated = !!req.session.currentUser;
  next();
};

const isLoggedIn = (req, res, next) => {
  
  if (!req.session.currentUser) {
    return res.redirect("/auth/login");
  } else {
    
        next();
   
  }
};
const isLoggedOut = (req, res, next) => {
  
  if (req.session.currentUser) {
    
    return res.redirect("/");
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
  isAuthenticated}