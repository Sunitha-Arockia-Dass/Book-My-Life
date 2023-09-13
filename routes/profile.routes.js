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
router.post('/profile',(req,res)=>{
  const { name, age, profilePicture }=req.body
  console.log(profilePicture)
  
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

router.get("/profileCreate", isLoggedIn, (req, res, next) => {
      res.render("profile/profileCreate",{isNewProfile:true});
  });

  router.get("/profileUpdate/:id", isLoggedIn, (req, res, next) => {
    const profileId = req.params.id
    Profile.findById(profileId)
    .then(foundProfile=>{
if(!foundProfile)
{
  console.log ('foundProfile not found')
}
      res.render("profile/profileCreate",{isNewProfile:false,profileId,profile:foundProfile});
    })
    .catch(error=>{
      console.log("error while finding user by id:",error)
    })
  });
  router.post("/profileUpdate/:id", isLoggedIn, (req, res, next) => {
    const profileId = req.params.id
    console.log(profileId)
    const { name, age, profilePicture }=req.body
  Profile.findByIdAndUpdate(profileId,{ name, age, profilePicture },{new:true})
  .then(updatedProfile=>{
    console.log(updatedProfile)
    res.redirect('/profile/profile')
  })
  .catch(error=>{
    console.log("error while updating profiles:",error)
  })
  })



router.get("/profileDelete/:id", isLoggedIn, (req, res, next) => {
  const profileId = req.params.id
  Profile.findByIdAndDelete(profileId)
  .then(updatedProfile=>{
    res.redirect('/profile/profile')
  })
  .catch(error=>{
    console.log("error while updating profiles:",error)
  })
});





module.exports = router;
