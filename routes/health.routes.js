const express = require("express");
const axios = require("axios");

const router = express.Router();
const Data = require("../models/data.model");
const Profile = require("../models/Profile.model");
const {
  calculateAge,
  isHealthyBmi,
  optimalWeight,
  fetchRecipesData,
  fetchBmiReferenceData,
  findPercentile,
  calculateAgeInMonths,
  findCategory,
} = require("../middleware/functions");
const {isLoggedIn}=require("../middleware/route-guard")
const saveAndRenderResponse = (newData, foundProfile, res, isKid) => {
  Data.create(newData).then((currentData) => {
    Data.find({ profile: newData.profile }).then((profileDatas) => {
      const bmiData = profileDatas.map((data) => data.BMI);
      const ageData = profileDatas.map((data) => data.ageInMonths);
      const createdDates = profileDatas.map((data) => data.formattedCreatedAt);
      const bmiPercentile = profileDatas.map((data) => data.percentile);

      // Render the response, passing data only for adults or kids accordingly
      res.render("health/healthDetails", {
        data: profileDatas,
        currentData,
        bmiData: JSON.stringify(bmiData),
        createdDates: JSON.stringify(createdDates),
        bmiPercentile: JSON.stringify(bmiPercentile),
        ageData: JSON.stringify(ageData),
        currentWeight: newData.currentWeight,
        optimalWeightToBe: newData.optimalWeightToBe,
        profile: foundProfile,
        isAdult: !isKid,  
        percentile: newData.percentile, 
        category: newData.category, 
      });
    });
  }).catch((err) => {
    console.error(err);
    next(err);  // Handle any errors during data creation
  });
};
/*////////////////////////////////////////////////////////////// 
GET HEALTHIFY HOME PAGE
 */
router.get("/healthDetail/:id",isLoggedIn, (req, res, next) => {
  const selectedProfileId = req.params.id;
    Profile.findById(selectedProfileId)
    .then(profile=>{
  const dob = profile.dateOfBirth;
    const age = calculateAge(dob);
    const isAdult = age > 16;
    Data.find({ profile: selectedProfileId }).then((profileDatas) => {
      const bmiData = profileDatas.map((data) => data.BMI);
      const ageData = profileDatas.map((data) => data.ageInMonths);
      const createdDates = profileDatas.map((data) => data.formattedCreatedAt);
      const bmiPercentile = profileDatas.map((data) => data.percentile);
      res.render("health/healthDetails", {
        data: profileDatas,
        bmiData: JSON.stringify(bmiData),
        createdDates: JSON.stringify(createdDates),
        bmiPercentile: JSON.stringify(bmiPercentile),
        ageData: JSON.stringify(ageData),
        profile,
        isAdult,
      });
    });
  });
});

router.get("/health/:id", isLoggedIn,(req, res, next) => {
  const selectedProfileId = req.params.id;
  Profile.findById(selectedProfileId)
  .then(foundProfile=>{
  res.render("health/healthHome", { profile: foundProfile });
  });
});


router.post("/health/:id",isLoggedIn, async (req, res, next) => {
  const { height, weight } = req.body;
  const heightInMeters = height / 100;
  const selectedProfileId = req.params.id;
    Profile.findById(selectedProfileId)
    .then(foundProfile=>{  
  const profileName = foundProfile.name;
    const BMI = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    const currentWeight = isHealthyBmi(BMI);
    const optimalWeightToBe = optimalWeight(
      currentWeight.currentWeight,
      BMI,
      weight
    );
    const dob = foundProfile.dateOfBirth;
    const age = calculateAge(dob);
    const ageMonths = calculateAgeInMonths(dob);
    const isAdult = age > 20;
    const newData = {
      height,
      weight,
      profile: selectedProfileId,
      age: age,
      BMI,
      profileName: profileName,
      currentWeight,
      optimalWeightToBe
    };

    if (!isAdult) {
      findPercentile(foundProfile.gender, ageMonths, BMI)
        .then((percentile) => {
          const category = findCategory(percentile);
          newData.percentile = percentile;
          newData.ageInMonths = ageMonths;
          newData.category = category;
          saveAndRenderResponse(newData, foundProfile, res, true);
        })
        .catch(next);  
    } else {
      newData.percentile = null;  
      newData.category = null;    
      newData.ageInMonths = null; 
      saveAndRenderResponse(newData, foundProfile, res, false);
    }
    });
  });

router.get("/weighLoss-paleo",isLoggedIn, (req, res, next) => {
  res.render("health/paleoWeightLoss");
});
router.get("/recipe/:recipeName",isLoggedIn, (req, res, next) => {
  fetchRecipesData().then((recipes) => {
    const mealName = req.params.recipeName;
    const myRecipe = recipes.find((recipe) => recipe.title === mealName);
    res.render("health/recipe", { myRecipe });
  });
});
router.get("/weighLoss-vegetarian",isLoggedIn, (req, res, next) => {
  res.render("health/vegetarianWeightLoss");
});

router.get("/weighLoss-vegan",isLoggedIn, (req, res, next) => {
  res.render("health/veganWeightLoss");
});
router.get("/weighGain-paleo",isLoggedIn, (req, res, next) => {
  res.render("health/paleoWeightGain");
});
router.get("/weighGain-vegetarian",isLoggedIn, (req, res, next) => {
  res.render("health/vegetarianWeightGain");
});
router.get("/weighGain-vegan",isLoggedIn, (req, res, next) => {
  res.render("health/veganWeightGain");
});

/* module.exports */
module.exports = router;
