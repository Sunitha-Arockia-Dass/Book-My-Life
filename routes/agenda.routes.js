const express = require("express");
const router = express.Router();
const Appointment = require("../models/agenda.model");
const Profile = require("../models/Profile.model");
const {
  storeProfileId,
  calculateAge,
  profileFindbyId,
  isHealthyBmi,
  optimalWeight,
  isAuthenticated,
  isLoggedIn,agendaSelectedProfileId
} = require("../middleware/functions");

/*////////////////////////////////////////////////////////////// 
GET HOME PAGE
 */

router.get("/agenda", (req, res, next) => {
  const user = req.session.currentUser;
  const userId = user._id;
    Appointment.find({ user: userId }).then((foundAppointment) => {
      res.render("agenda/agendaDetails", {
        appt: foundAppointment,
      });
    });
  });
router.post("/agenda", agendaSelectedProfileId, (req,res,next)=>{
  const selectedProfileId = req.body.selectedProfileId;
  req.session.selectedProfileId = selectedProfileId;
  res.redirect("/agenda/agenda")
})
router.get("/agendaCreate",isLoggedIn, (req, res, next) => {
  const selectedProfileId = req.session.selectedProfileId

  res.render("agenda/agendaCreate", { id: selectedProfileId });
});

router.post("/agendaCreate",isLoggedIn,(req, res, next) => {
  const {
    appointmentName,
    appointmentType,
    appointmentDate,
    appointmentTime,
    appointmentwith,
    duration,
  } = req.body;
  const selectedProfileId = req.session.selectedProfileId ;
    const user = req.session.currentUser;
  const userId = user._id;
  profileFindbyId(selectedProfileId).then((foundProfile) => {
    const profileName = foundProfile.name;
    Appointment.create({
      appointmentName,
      appointmentType,
      appointmentDate,
      appointmentTime,
      appointmentwith,
      duration,
      profileName: profileName,
      user: userId,
    }).then((createdAppt) => {
      Appointment.find({ user: userId })
        .sort({ appointmentDate: 1 })
        .then((appointments) => {
          res.render("agenda/agendaDetails", {
            appt: appointments,
            id: selectedProfileId,
          });
        });
    });
  });
});
router.get("/agendaDetail",isLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  const userId = user._id
  Appointment.find({user:userId}).then((foundAppointment) => {
    res.json(foundAppointment);
  });
});

router.get("/agendaDelete/:id",isLoggedIn, (req, res, next) => {
  const appointmentId = req.params.id;
  const user = req.session.currentUser;
  const userId = user._id
  Appointment.findByIdAndDelete(appointmentId).then((appointment) => {
    Appointment.find({user:userId}).then((foundAppointment) => {
      res.redirect("/agenda/agenda");
       });
  });
});

router.get("/agendaUpdate/:id",isLoggedIn, (req, res, next) => {
  const selectedProfileId = req.params.id;
  Appointment.findById(selectedProfileId).then((foundAppointment) => {
    res.render("agenda/agendaUpdate", {
      appointment: foundAppointment,
      id: selectedProfileId,
    });
  });
});

router.post("/agendaUpdate/:id",isLoggedIn, (req, res, next) => {
  const {
    appointmentName,
    appointmentType,
    appointmentDate,
    appointmentTime,
    appointmentwith,
    duration,
  } = req.body;
  const id = req.params.id;
  const user = req.session.currentUser;
  const userId = user.id;
  const selectedProfileId = req.params.id;
  Appointment.findByIdAndUpdate(
    id,
    {
      appointmentName,
      appointmentType,
      appointmentDate,
      appointmentTime,
      appointmentwith,
      duration,
      user: userId,
    },
    { new: true }
  ).then((updatedAppt) => {
    Appointment.find({ user:userId}).then((foundAppointment) => {
      res.redirect("/agenda/agenda");
    });
      });
  });

/* module.exports */
module.exports = router;
