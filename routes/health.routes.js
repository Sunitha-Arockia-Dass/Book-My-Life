const express = require("express");
const axios = require('axios')
const spoonacularApiKey = 'cd85c553603e4e08b988f42f0efdfe19'
const router = express.Router();
const Data = require("../models/data.model");
const Profile = require("../models/Profile.model");
const {
  storeProfileId,
  calculateAge,
  profileFindbyId,
  isHealthyBmi,
  optimalWeight,
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
   const weightToLose=optimalWeight(BMI,weight)
   console.log(currentWeight)
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
            weightToLose
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
    const bmiData = profileDatas.map((data) => data.BMI);
    const createdDates = profileDatas.map((data) => data.formattedCreatedAt);   
    res.render("health/healthDetails", { data: profileDatas, bmiData: JSON.stringify(bmiData), 
        createdDates: JSON.stringify(createdDates) });

  })

});

router.get("/random-meal",(req,res,next)=>{

    axios
    .get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${spoonacularApiKey}&query=salad&number=50`)
    .then((response) => {
      const randomMeal = response.data.results;
     console.log(randomMeal);
      res.json(randomMeal)
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching the data.' });
    });
})

/* module.exports */
module.exports = router;
