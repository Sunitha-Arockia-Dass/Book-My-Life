const express = require("express");
const router = express.Router();
const Appointment = require("../models/agenda.model");
const Profile = require("../models/Profile.model");
const {
    agendaSelectedProfileId
} = require("../middleware/functions");
const {isLoggedIn,isAuthenticated}=require("../middleware/route-guard")

/*////////////////////////////////////////////////////////////// 
GET HOME PAGE
 */

router.get("/agenda",isLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  const userId = user._id;
    Appointment.find({ user: userId })
  .sort({ appointmentDate: 1 })
    .then((foundAppointment) => {
      res.render("agenda/agendaDetails", {
        appt: foundAppointment,
      });
    });
  });
router.post("/agenda",isLoggedIn, agendaSelectedProfileId, (req,res,next)=>{
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
  Profile.findById(selectedProfileId).then((foundProfile) => {
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
router.get("/agendaDetail", isLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  const userId = user._id;

  Appointment.find({ user: userId })
    .sort({ appointmentDate: 1 })
    // .select('appointmentName appointmentType appointmentDate formattedAppointmentDate') 
    .then((foundAppointments) => {
      res.json(foundAppointments);
    })
    .catch((error) => {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ error: "An error occurred while fetching appointments" });
    });
});

router.get("/agendaDelete/:id",isLoggedIn, (req, res, next) => {
  const appointmentId = req.params.id;
  const user = req.session.currentUser;
  const userId = user._id
  Appointment.findByIdAndDelete(appointmentId).then((appointment) => {
    Appointment.find({user:userId})
    .sort({ appointmentDate: 1 })
    .then((foundAppointment) => {
      res.redirect("/agenda/agenda");
       });
  });
});

router.get("/agendaUpdate/:id",isLoggedIn, (req, res, next) => {
  const selectedProfileId = req.params.id;
  Appointment.findById(selectedProfileId).then((foundAppointment) => {
    console.log("appointmentDate",foundAppointment.appointmentDate)
    console.log("formattedAppointmentDateUpdate",foundAppointment.formattedAppointmentDateUpdate)
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
    Appointment.find({ user:userId})
    .sort({ appointmentDate: 1 })
    .then((foundAppointment) => {
      res.redirect("/agenda/agenda");
    });
      });
  });

/* module.exports */
module.exports = router;
