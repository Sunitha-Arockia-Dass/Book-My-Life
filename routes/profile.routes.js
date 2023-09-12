const express = require('express');
const router = express.Router();
const Profile = require("../models/Profile.model");
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");



/* GET home page */
router.get("/profile",isLoggedIn, (req, res, next) => {
  Profile.find()
  .then(foundProfile=>{
      res.render("profile/profile",{profile:foundProfile});

  })
  .catch(error=>{
    console.log("error while finding profiles:",error)
  })
  
  
  
});


router.get("/profileCreate", isLoggedIn, (req, res, next) => {
    res.render("profile/profileCreate");
  });


router.post('/profile',(req,res)=>{
const { name, age, profilePicture }=req.body

if(name === "" || age === "" ) {
    res.status(400).render("profile/profileCreate", {
        errorMessage:
          "Please provide your Name and Age.",
      });
  
      return;
}
Profile.create({name, age, profilePicture})
.then(createdProfile=>{
res.redirect("/profile/profile")
})
.catch(error=>{
    console.log('error while creating profile:', error)
})



})







module.exports = router;
