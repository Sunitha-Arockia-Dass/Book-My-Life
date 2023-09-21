const Profile = require("../models/Profile.model");


const storeProfileId=(req, res, next)=> {
    const profileId = req.params.id;
    req.session.selectedProfileId = profileId;
    next();
  }


  const calculateAge=(dateOfBirth)=> {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    
  
    let age = today.getFullYear() - birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    const currentMonth = today.getMonth();
  
    // If the birthdate hasn't occurred this year yet, subtract 1 from the age
    if (currentMonth < birthMonth || (currentMonth === birthMonth && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  }
  
  const profileFindbyId = (profileId) => {
    return Profile.findById(profileId)
      .then((foundProfile) => {
        if (!foundProfile) {
          console.log("foundUser not found");
        }
        console.log(foundProfile);
        return foundProfile;
        //res.render("auth/userUpdate",{userId,user:foundUser})
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
      isUnderWeight=true;
    } 
    else if (BMI > 18.5 && BMI < 25) {
      currentWeight = "Normal weight";
      isNormalWeight = true;
    } 
    else if (BMI >= 25 && BMI < 30) {
      currentWeight = "Overweight";
      isOverWeight = true;
    }
     else if (BMI >= 30) {
      currentWeight = "Obese";
      isOverWeight = true;
    }
  
    return { currentWeight, isNormalWeight,isOverWeight, isUnderWeight};
  };
  

const optimalWeight=(currentWeight,BMI,weight)=>{
  if(currentWeight==="Overweight" || currentWeight==="Obese" ){

    weightToLose=weight*((BMI-24.9)/BMI)
    return weightToLose.toFixed(1)
  }
    else if (currentWeight==="Underweight"){
      weightToGain=weight*((18.5-BMI)/18.5)
      return weightToGain.toFixed(1)
 
    }
    else{
      return "You are in a healthy range of Weight."
    }
}


function dateFormatted(dateString) {
  // Create a new Date object from the input date string
  const date = new Date(dateString);

  // Extract the components of the date
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  // Construct the human-readable date string
  const formattedDate = `${month} ${day}, ${year}`;

  return formattedDate;
}


  module.exports={
    storeProfileId,
    calculateAge,
    profileFindbyId,
    isHealthyBmi,
    optimalWeight,
    dateFormatted,
};