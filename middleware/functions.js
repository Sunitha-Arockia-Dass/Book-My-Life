const Profile = require("../models/Profile.model");
const axios = require("axios");

const isAuthenticated = (req, res, next) => {
  res.locals.isAuthenticated = !!req.session.currentUser;
  next();
};

const isLoggedIn = (req, res, next) => {
  
  if (!req.session.currentUser) {
    return res.redirect("/auth/login");
  } else {
    
        next();
   
  }
};
const isLoggedOut = (req, res, next) => {
  
  if (req.session.currentUser) {
    
    return res.redirect("/");
  }
  next();
};
const storeProfileId = (req, res, next) => {
  const profileId = req.params.id;
  req.session.selectedProfileId = profileId;
  next();
};
function agendaSelectedProfileId(req, res, next) {
  const selectedProfileId = req.body.selectedProfileId;
  req.locals = req.locals || {};
  req.locals.selectedProfileId = selectedProfileId;
  next();
}

const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let age = today.getFullYear() - birthDate.getFullYear();
  const birthMonth = birthDate.getMonth();
  const currentMonth = today.getMonth();

  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

const calculateAgeInMonths = (dob) => {
  const currentDate = new Date();
  dob = new Date(dob); 

  const yearsDiff = currentDate.getFullYear() - dob.getFullYear();
  const monthsDiff = currentDate.getMonth() - dob.getMonth();

  const ageInMonths = yearsDiff * 12 + monthsDiff;

  return ageInMonths;
};

const profileFindbyId = (profileId) => {
  return Profile.findById(profileId)
    .then((foundProfile) => {
      if (!foundProfile) {
        console.log("foundUser not found");
      }
      console.log(foundProfile);
      return foundProfile;
    })
    .catch((error) => {
      console.log("error while finding profile by id:", error);
    });
};

const isHealthyBmi = (BMI) => {
  let currentWeight;
  let isNormalWeight = false;
  let isOverWeight = false;
  let isUnderWeight = false;

  if (BMI <= 18.5) {
    currentWeight = "Underweight";
    isUnderWeight = true;
  } else if (BMI > 18.5 && BMI < 25) {
    currentWeight = "Normal weight";
    isNormalWeight = true;
  } else if (BMI >= 25 && BMI < 30) {
    currentWeight = "Overweight";
    isOverWeight = true;
  } else if (BMI >= 30) {
    currentWeight = "Obese";
    isOverWeight = true;
  }

  return { currentWeight, isNormalWeight, isOverWeight, isUnderWeight };
};

const optimalWeight = (currentWeight, BMI, weight) => {
  if (currentWeight === "Overweight" || currentWeight === "Obese") {
    weightToLose = weight * ((BMI - 24.9) / BMI);
    return weightToLose.toFixed(1);
  } else if (currentWeight === "Underweight") {
    weightToGain = weight * ((18.5 - BMI) / 18.5);
    return weightToGain.toFixed(1);
  } else {
    return "You are in a healthy range of Weight.";
  }
};

function dateFormatted(dateString) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  const formattedDate = `${month} ${day}, ${year}`;

  return formattedDate;
}

async function fetchRecipesData() {
  const recipes = [];
  try {
    const response = await axios.get(
      "  https://crowded-erin-seahorse.cyclic.app/recipes"
    );
    recipes.push(...response.data);
    console.log("Recipe data fetched and populated.");
    return recipes;
  } catch (error) {
    console.error("Error fetching recipe data:", error);
  }
}

const fetchBmiReferenceData = async () => {
  try {
    const boysData = await axios.get("https://crowded-erin-seahorse.cyclic.app/boys");
    const girlsData = await axios.get("https://crowded-erin-seahorse.cyclic.app/girls");
    return { boysData, girlsData };
  } catch (error) {
    console.error("Error fetching bmi data:", error);
    throw error;
  }
};
const findCategory = (percentile) => {
  let currentWeightKid;
  let isNormalWeight = false;
  let isOverWeight = false;
  let isUnderWeight = false;
  let isObese=false
  if (percentile < 5) {
    currentWeightKid= "Underweight";
    isUnderWeight=true
  } else if (percentile >= 5 && percentile <= 85) {
    currentWeightKid= "Normal";
    isNormalWeight=true
  } else if(percentile >= 85 && percentile <= 95) {
    currentWeightKid= "OverWeight";
    isOverWeight=true
  }
  else{
    currentWeightKid="Obesity"
  isObese=true
}
  return { currentWeightKid, isNormalWeight, isOverWeight, isUnderWeight ,isObese};

};
const findPercentile = async (gender, ageMonths, bmi) => {
  try {
    const response = await fetchBmiReferenceData();
    // console.log("response.boysData:",response.boysData)
    // console.log("response.girlsData:",response.girlsData)
    let bmiData;
    if (gender === "male") {
      bmiData = response.boysData.data;
    } else if (gender === "female") {
      bmiData = response.girlsData.data;
    }
    const ageIndex = bmiData.ageMonths.indexOf(ageMonths);
    console.log("ageIndex",ageIndex)
    if (ageIndex === -1) {
      return null;
    }

    const bmiPercentile1 = bmiData.percentile.first[ageIndex];
    const bmiPercentile3 = bmiData.percentile.third[ageIndex];
    const bmiPercentile5 = bmiData.percentile.fifth[ageIndex];
    const bmiPercentile15 = bmiData.percentile.fifteenth[ageIndex];
    const bmiPercentile25 = bmiData.percentile.twentyfifth[ageIndex];
    const bmiPercentile50 = bmiData.percentile.fiftyth[ageIndex];
    const bmiPercentile75 = bmiData.percentile.seventyfifth[ageIndex];
    const bmiPercentile85 = bmiData.percentile.eightyfifth[ageIndex];
    const bmiPercentile95 = bmiData.percentile.ninetyfifth[ageIndex];
    const bmiPercentile97 = bmiData.percentile.ninetyseventh[ageIndex];
    const bmiPercentile99 = bmiData.percentile.ninetynineth[ageIndex];
    let percentile;
    switch (true) {
      case bmi < bmiPercentile1:
        percentile = 1;
        break;
      case bmi < bmiPercentile3:
        percentile = 3;
        break;
      case bmi < bmiPercentile5:
        percentile = 5;
        break;
      case bmi < bmiPercentile15:
        percentile = 15;
        break;
      case bmi < bmiPercentile25:
        percentile = 25;
        break;
      case bmi < bmiPercentile50:
        percentile = 50;
        break;
      case bmi < bmiPercentile75:
        percentile = 75;
        break;
      case bmi < bmiPercentile85:
        percentile = 85;
        break;
      case bmi < bmiPercentile95:
        percentile = 95;
        break;
      case bmi < bmiPercentile97:
        percentile = 97;
        break;
      case bmi < bmiPercentile99:
        percentile = 99;
        break;
      default:
        percentile = 99;
        break;
    }
    return percentile; 
  } catch (error) {
    console.error("Error fetching BMI data:", error);
    throw error;
  }
};

module.exports = {
  storeProfileId,
  calculateAge,
  profileFindbyId,
  isHealthyBmi,
  optimalWeight,
  dateFormatted,
  fetchRecipesData,
  isLoggedIn,
  isLoggedOut,
  isAuthenticated,
  fetchBmiReferenceData,
  findPercentile,
  calculateAgeInMonths,
  findCategory,
  agendaSelectedProfileId
};
