const express = require("express");
const axios = require('axios')

const router = express.Router();
const Data = require("../models/data.model");
const Profile = require("../models/Profile.model");
const {
  storeProfileId,
  calculateAge,
  profileFindbyId,
  isHealthyBmi,
  optimalWeight,
  dateFormatted,
  fetchRecipesData,
} = require("../middleware/functions");
/*////////////////////////////////////////////////////////////// 
GET HEALTHIFY HOME PAGE
 */
router.get("/health/:id", (req, res, next) => {
  const selectedProfileId = req.params.id;
  const profile = profileFindbyId(selectedProfileId).then((foundProfile) => {

    console.log("foundProfile",foundProfile)
    console.log("foundProfile's",foundProfile.id)
    res.render("health/healthHome",{profile:foundProfile});
  })
});

router.post("/health/:id", async (req, res, next) => {
  const { height, weight } = req.body;
  const heightInMeters = height / 100;
  const selectedProfileId = req.params.id;
  console.log("selectedProfileId",selectedProfileId)
  const profile = profileFindbyId(selectedProfileId).then((foundProfile) => {
    console.log("foundProfile",foundProfile)
    const profileName = foundProfile.name;
    console.log("profileName",profileName)
    const BMI = (weight / (heightInMeters * heightInMeters)).toFixed(2);
   const currentWeight= isHealthyBmi(BMI) 
   const optimalWeightToBe=optimalWeight(currentWeight.currentWeight,BMI,weight)
    Profile.findById(selectedProfileId).then((foundProfile) => {
      const dob = foundProfile.dateOfBirth;
      const age = calculateAge(dob);
      Data.create({
        height,
        weight,
        profile: selectedProfileId,
        age: age,
        BMI,
        profileName: profileName,
      }).then((currentData) => {
        Data.find({ profile: selectedProfileId })
        .then((profileDatas) => {
          const bmiData = profileDatas.map((data) => data.BMI);
           const createdDates = profileDatas.map((data) => data.formattedCreatedAt);
           res.render("health/healthDetails", {
            data: profileDatas,
            currentData,
            bmiData: JSON.stringify(bmiData), 
            createdDates: JSON.stringify(createdDates),
            currentWeight,
            optimalWeightToBe
          });
        });
      });
    });
  });
});

router.get("/healthDetail/:id", (req, res, next) => {
  const selectedProfileId = req.params.id;
  profileFindbyId(selectedProfileId).then((profile) => {
    
    Data.find({ profile: selectedProfileId })
    .then((profileDatas) => {
      const bmiData = profileDatas.map((data) => data.BMI);
      
      const createdDates = profileDatas.map((data) => data.formattedCreatedAt);   
      res.render("health/healthDetails", { data: profileDatas, bmiData: JSON.stringify(bmiData), 
        createdDates: JSON.stringify(createdDates),profile });
        
      });
  })

});
router.get("/weighLoss-paleo", (req, res, next) => {
    res.render("health/paleoWeightLoss")

});
router.get("/recipe/:recipeName", (req, res, next) => {
  const recipes=fetchRecipesData()
  .then(recipes=>{
    const mealName = req.params.recipeName
    const myRecipe = recipes.find((recipe) => recipe.title === mealName);
    res.render("health/recipe",{myRecipe})
  })
});
router.get("/weighLoss-vegetarian", (req, res, next) => {
 
  res.render("health/vegetarianWeightLoss")
});

router.get("/weighLoss-vegan", (req, res, next) => {
 
  res.render("health/veganWeightLoss")
});
router.get("/weighGain-paleo", (req, res, next) => {
 
  res.render("health/paleoWeightGain")
});
router.get("/weighGain-vegetarian", (req, res, next) => {
 
  res.render("health/vegetarianWeightGain")
});
router.get("/weighGain-vegan", (req, res, next) => {
 
  res.render("health/veganWeightGain")
});


/* module.exports */
module.exports = router;
