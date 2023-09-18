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
  

  


  module.exports={
    storeProfileId,
    calculateAge,
    profileFindbyId,
    
};