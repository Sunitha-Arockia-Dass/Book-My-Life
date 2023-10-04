const express = require("express");
const axios = require("axios");

const router = express.Router();
const Data = require("../models/data.model");
const Profile = require("../models/Profile.model");
const {
  storeProfileId,
  calculateAge,
  isHealthyBmi,
  optimalWeight,
  dateFormatted,
  fetchRecipesData,
  fetchBmiReferenceData,
  findPercentile,
  calculateAgeInMonths,
  findCategory,
  isLoggedIn
} = require("../middleware/functions");
/*////////////////////////////////////////////////////////////// 
GET HEALTHIFY HOME PAGE
 */
router.get("/healthDetail/:id",isLoggedIn, (req, res, next) => {
  const selectedProfileId = req.params.id;
    Profile.findById(selectedProfileId)
    .then(profile=>{
  const dob = profile.dateOfBirth;
    const age = calculateAge(dob);
    const isAdult = age > 20;
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
    findPercentile(foundProfile.gender, ageMonths, BMI).then((percentile) => {
      const category = findCategory(percentile);
      const newData = {
        height,
        weight,
        profile: selectedProfileId,
        age: age,
        BMI,
        profileName: profileName,
      };
      if (!isAdult) {
        newData.percentile = percentile;
        newData.ageInMonths = ageMonths;
      }
        Data.create(newData).then((currentData) => {
          Data.find({ profile: selectedProfileId }).then((profileDatas) => {
            const bmiData = profileDatas.map((data) => data.BMI);
            const ageData = profileDatas.map((data) => data.ageInMonths);
            const createdDates = profileDatas.map(
              (data) => data.formattedCreatedAt
            );
            const bmiPercentile = profileDatas.map((data) => data.percentile);
            res.render("health/healthDetails", {
              data: profileDatas,
              currentData,
              bmiData: JSON.stringify(bmiData),
              createdDates: JSON.stringify(createdDates),
              bmiPercentile: JSON.stringify(bmiPercentile),
              ageData: JSON.stringify(ageData),
              currentWeight,
              optimalWeightToBe,
              profile: foundProfile,
              isAdult,
              percentile,
              category,
            });
          });
        });
      });
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
