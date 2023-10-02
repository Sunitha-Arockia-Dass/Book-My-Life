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
} = require("../middleware/functions");

/*////////////////////////////////////////////////////////////// 
GET HOME PAGE
 */
router.get("/agenda", (req, res, next) => {
  const user = req.session.currentUser;
  const userId = user._id;
  profileFindbyId(selectedProfileId).then((foundProfile) => {
    const profileName = foundProfile.name;

    Appointment.find({ profileName: profileName }).then((foundAppointment) => {
      res.render("agenda/agendaDetails", { appt: foundAppointment });
    });
  });
});

router.get("/agenda/:id", (req, res, next) => {
  const selectedProfileId = req.params.id;
  const user = req.session.currentUser;
  const userId = user._id;
  profileFindbyId(selectedProfileId).then((foundProfile) => {
    const profileName = foundProfile.name;

    Appointment.find({ profileName: profileName }).then((foundAppointment) => {
      res.render("agenda/agendaDetails", {
        appt: foundAppointment,
        id: selectedProfileId,
      });
    });
  });
});

router.get("/agendaCreate/:id", (req, res, next) => {
  const selectedProfileId = req.params.id;

  res.render("agenda/agendaCreate", { id: selectedProfileId });
});

router.post("/agendaCreate/:id", (req, res, next) => {
  const {
    appointmentName,
    appointmentType,
    appointmentDate,
    appointmentTime,
    appointmentwith,
    duration,
  } = req.body;
  const selectedProfileId = req.params.id;
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
      Appointment.find({ profileName: profileName })
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
router.get("/agendaDetail", (req, res, next) => {
  Appointment.find().then((foundAppointment) => {
    res.json(foundAppointment);
  });
});

router.get("/agendaDelete/:id", (req, res, next) => {
  const appointmentId = req.params.id;
  Appointment.findByIdAndDelete(appointmentId).then((foundAppointment) => {
    res.redirect("/agenda/agenda");
  });
});

router.get("/agendaUpdate/:id", (req, res, next) => {
  const selectedProfileId = req.params.id;
  Appointment.findById(selectedProfileId).then((foundAppointment) => {
    res.render("agenda/agendaUpdate", {
      appointment: foundAppointment,
      id: selectedProfileId,
    });
  });
});

router.post("/agendaUpdate/:id", (req, res, next) => {
  const {
    appointmentName,
    appointmentType,
    appointmentDate,
    appointmentTime,
    appointmentwith,
    duration,
    profileName,
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
  ).then((createdAppt) => {
    Appointment.find({ profileName: profileName })
      .sort({ appointmentDate: 1 })
      .then((appointments) => {
        res.render("agenda/agendaDetails", {
          appt: appointments,
          id: selectedProfileId,
        });
      });
  });
});
// });

/* module.exports */
module.exports = router;
