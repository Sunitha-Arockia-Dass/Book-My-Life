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
router.get("/health", (req, res, next) => {
    console.log("hello")
  res.render("health/healthHome");
});

router.post("/health", async (req, res, next) => {
  const { height, weight } = req.body;
  const heightInMeters = height / 100;
  const selectedProfileId = req.session.selectedProfileId;
  const profile = profileFindbyId(selectedProfileId).then((foundProfile) => {
    const profileName = foundProfile.name;
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

router.get("/healthDetail", (req, res, next) => {
  const selectedProfileId = req.session.selectedProfileId;
  
  Data.find({ profile: selectedProfileId })
  .then((profileDatas) => {
    console.log(profileDatas)
    const bmiData = profileDatas.map((data) => data.BMI);
    const createdDates = profileDatas.map((data) => data.formattedCreatedAt);   
    res.render("health/healthDetails", { data: profileDatas, bmiData: JSON.stringify(bmiData), 
        createdDates: JSON.stringify(createdDates) });

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


/* module.exports */
module.exports = router;
