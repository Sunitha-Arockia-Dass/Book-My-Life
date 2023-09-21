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
router.get("/", (req, res, next) => {
  Appointment.find()
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
  const profile = profileFindbyId(selectedProfileId).then((foundProfile) => {
  const profileName = foundProfile.name;
Appointment.create({appointmentName,appointmentType,appointmentDate,appointmentTime,appointmentwith,duration,profileName:profileName})
.then(createdAppt=>{
console.log(createdAppt)
console.log(createdAppt.formattedAppointmentDate)
  res.render("agenda/agendaDetails",{appt:createdAppt});
})

  })
});


/* module.exports */
module.exports = router;
