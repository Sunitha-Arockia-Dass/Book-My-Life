const express = require("express");
const router = express.Router();
const Data = require("../models/data.model");
const Profile = require("../models/Profile.model");
const {
  storeProfileId,
  calculateAge,
  profileFindbyId,
} = require("../middleware/functions");
/*////////////////////////////////////////////////////////////// 
GET HEALTHIFY HOME PAGE
 */
router.get("/health", (req, res, next) => {
  res.render("health/healthHome");
});

router.post("/health", async (req, res, next) => {
  const { height, weight } = req.body;
  const heightInMeters = height / 100;
  const selectedProfileId = req.session.selectedProfileId;
  const profile = profileFindbyId(selectedProfileId).then((foundProfile) => {
    console.log(foundProfile);
    const profileName = foundProfile.name;
    const BMI = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    console.log(BMI);
    Profile.findById(selectedProfileId).then((foundProfile) => {
      const dob = foundProfile.dateOfBirth;
      const age = calculateAge(dob);
      console.log(age);
      Data.create({
        height,
        weight,
        profile: selectedProfileId,
        age: age,
        BMI,
        profileName: profileName,
      }).then((currentData) => {
        Data.find({ profile: selectedProfileId }).then((profileDatas) => {
          res.render("health/healthDetails", {
            data: profileDatas,
            currentData,
          });
        });
      });
    });
  });
});

router.get("/healthDetail", (req, res, next) => {
  const selectedProfileId = req.session.selectedProfileId;
  Data.find({ profile: selectedProfileId })
  .then((profileDatas) => {
  Data.find({ profile: selectedProfileId })
  .then((profileDatas) => {
    console.log(typeof profileDatas.createdAt)
    profileDatas.forEach(profileData=>{

        const createdAtDate = new Date(profileData.createdAt);

        // Format the createdAt date
        const formattedDate = `${(createdAtDate.getMonth() + 1).toString().padStart(2, '0')}/${createdAtDate.getDate().toString().padStart(2, '0')}/${createdAtDate.getFullYear()}`;
        
        // Update profileData.createdAt with the formatted date
        profileData.createdAt = formattedDate;
        console.log(profileData.createdAt)

    })
    console.log( "first creation date:",profileDatas[0].createdAt)
  
    res.render("health/healthDetails", { data: profileDatas });

  })
})
});

/* module.exports */
module.exports = router;
