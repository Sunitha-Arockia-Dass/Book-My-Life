const express = require('express');
const router = express.Router();
const Appointment=require("../models/agenda.model")
const Profile = require("../models/Profile.model");
const {
  storeProfileId,
  calculateAge,
  profileFindbyId,
  isHealthyBmi,
  optimalWeight,
} = require("../middleware/functions");

/*////////////////////////////////////////////////////////////// 
GET HOME PAGE
 */
router.get("/agenda/:id", (req, res, next) => {
  const selectedProfileId = req.params.id
  const user = req.session.currentUser;
  const userId = user._id;
  Appointment.find({ user: userId })
  .then(foundAppointment=>{

    res.render("agenda/agendaDetails",{appt:foundAppointment});
  })
});

router.get("/agendaCreate", (req, res, next) => {
  res.render("agenda/agendaCreate");
});

router.post("/agendaCreate", (req, res, next) => {
  const {appointmentName,appointmentType,appointmentDate,appointmentTime,appointmentwith,duration} = req.body
  const selectedProfileId = req.session.selectedProfileId;
  const user = req.session.currentUser;
  const userId = user._id;
  const profile = profileFindbyId(selectedProfileId).then((foundProfile) => {
  const profileName = foundProfile.name;
Appointment.create({appointmentName,appointmentType,appointmentDate,appointmentTime,appointmentwith,duration,profileName:profileName,user: userId})
.then(createdAppt=>{
Appointment.find({ profileName: profileName })
.sort({ appointmentDate: 1 }) 
.then(appointments=>{

  res.render("agenda/agendaDetails",{appt:appointments});
})
})

  })
});
router.get("/agendaDetail", (req, res, next) => {
  Appointment.find()
  .then(foundAppointment=>{

    res.json(foundAppointment)  })
});

router.get("/agendaUpdate/:id", (req, res, next) => {
  const id=req.params.id
  Appointment.findById(id)
  .then(foundAppointment=>{

    res.render("agenda/agendaUpdate",{appointment:foundAppointment}) 
   })
});
router.post("/agendaUpdate/:id", (req, res, next) => {
const {appointmentName,appointmentType,appointmentDate,appointmentTime,appointmentwith,duration} = req.body
const id=req.params.id
  const selectedProfileId = req.session.selectedProfileId;

  const user = req.session.currentUser;
  const userId = user._id;
  const profile = profileFindbyId(selectedProfileId).then((foundProfile) => {
    console.log(foundProfile)
  const profileName = foundProfile.name;
Appointment.create(id,{appointmentName,appointmentType,appointmentDate,appointmentTime,appointmentwith,duration,profileName:profileName,user: userId},{new:true})
.then(createdAppt=>{
Appointment.find({ profileName: profileName })
.sort({ appointmentDate: 1 }) 
.then(appointments=>{

  res.render("agenda/agendaDetails",{appt:appointments});
})
})

})
})



/* module.exports */
module.exports = router;
