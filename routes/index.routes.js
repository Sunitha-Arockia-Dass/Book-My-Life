const express = require('express');
const router = express.Router();

/*////////////////////////////////////////////////////////////// 
GET HOME PAGE
 */
router.get("/", (req, res, next) => {
  res.render("index");
});

// test error 500 page
router.get("/error500", (req, res, next) => {
  res.render("error");
});

// test error 404 page
router.get("/error404", (req, res, next) => {
  res.render("not-found");
});

/* module.exports */
module.exports = router;
