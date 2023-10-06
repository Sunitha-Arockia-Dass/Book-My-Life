const express = require("express");
const router = express.Router();
const fileUploader = require("../config/cloudinary.config");
// Profile schema
const Profile = require("../models/Profile.model");
const Data = require("../models/data.model");
const { storeProfileId, calculateAge } = require("../middleware/functions");
const { isLoggedOut, isLoggedIn } = require("../middleware/route-guard");

/*////////////////////////////////////////////////////////////// 
GET PROFILE PAGE
 */
router.get("/profile", isLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  const userId = user._id;
  Profile.find({ user: userId })
    .then((foundProfile) => {
      res.render("profile/profile", { profile: foundProfile });
    })
    .catch((error) => {
      console.log("error while finding profiles:", error);
    });
});

/*////////////////////////////////////////////////////////////// 
GET CREATE PROFILE PAGE
 */
router.get("/profileCreate", isLoggedIn, (req, res, next) => {
  res.render("profile/profileCreate", { isNewProfile: true });
});

/*////////////////////////////////////////////////////////////// 
POST NEW PROFILE FORM
 */
router.post(
  "/profile",
  fileUploader.single("profilePicture"),
  isLoggedIn,
  (req, res) => {
    const { name, dob, gender } = req.body;
    const user = req.session.currentUser;
    const userId = user._id;
    if (name === "" || dob === "") {
      res.status(400).render("profile/profileCreate", {
        errorMessage: "Please provide your Name and Age.",
      });

      return;
    }
    // create the profile
    if (!req.file) {
      Profile.create({ name, dateOfBirth: dob, gender, user: userId })
        .then((createdProfile) => {
          res.redirect("/profile/profile");
        })
        .catch((error) => {
          console.log("error while creating profile:", error);
        });
    } else {
      const profilePicture = req.file.path;
      Profile.create({
        name,
        dateOfBirth: dob,
        gender,
        profilePicture,
        user: userId,
      })
        .then((createdProfile) => {
          res.redirect("/profile/profile");
        })
        .catch((error) => {
          console.log("error while creating profile:", error);
        });
    }
  }
);

/*////////////////////////////////////////////////////////////// 
GET UPDATE A PROFILE PAGE
 */
router.get("/profileUpdate/:id", isLoggedIn, (req, res, next) => {
  const profileId = req.params.id;
  Profile.findById(profileId).then((profile) => {
    res.render("profile/profileUpdate", { profileId, profile: profile });
  });
});

/*////////////////////////////////////////////////////////////// 
POST UPDATE A PROFILE FORM
 */
router.post(
  "/profileUpdate/:id",
  fileUploader.single("profilePicture"),
  isLoggedIn,
  (req, res, next) => {
    const profileId = req.params.id;
    const { name, age } = req.body;
    if (name === "" || age === "") {
      Profile.findById(profileId).then((profile) => {
        res.render("profile/profileUpdate", {
          profileId,
          profile: profile,
          errorMessage:
            "All fields are mandatory. Please provide your name and age.",
        });
      });

      return;
    }
    if(req.file){
      const profilePicture = req.file.path;

      Profile.findByIdAndUpdate(
        profileId,
        { name, age, profilePicture },
        { new: true }
        )
        .then((updatedProfile) => {
          res.redirect("/profile/profile");
        })
        .catch((error) => {
          console.log("error while updating profiles:", error);
        });
      }
      else{
        Profile.findByIdAndUpdate(
        profileId,
        { name, age },
        { new: true }
        )
        .then((updatedProfile) => {
          res.redirect("/profile/profile");
        })
        .catch((error) => {
          console.log("error while updating profiles:", error);
        });
      }
  }
);

/*////////////////////////////////////////////////////////////// 
GET DELETE A PROFILE
 */
router.get("/profileDelete/:id", isLoggedIn, (req, res, next) => {
  const profileId = req.params.id;
  Profile.findByIdAndDelete(profileId)
    .then((updatedProfile) => {
      Data.deleteMany({ profile: profileId }).then((deletedData) => {
        res.redirect("/profile/profile");
      });
    })
    .catch((error) => {
      console.log("error while updating profiles:", error);
    });
});

/*////////////////////////////////////////////////////////////// 
GET A PROFILE DETAIL
 */
router.get(
  "/profileDetail/:id",
  isLoggedIn,
  storeProfileId,
  (req, res, next) => {
    const profileId = req.params.id;

    Profile.findById(profileId)
      .then((updatedProfile) => {
        const dob = updatedProfile.dateOfBirth;
        const age = calculateAge(dob);
        const isAdult = age > 16
        res.render("profile/profileDetail", { profile: updatedProfile, age,isAdult });
      })
      .catch((error) => {
        console.log("error while finding profiles:", error);
      });
  }
);

/* module.exports */
module.exports = router;
