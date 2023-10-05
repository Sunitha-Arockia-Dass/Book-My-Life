const { Schema, model } = require("mongoose");
function dateFormatted(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}
function formatDate(inputDate) {
  const date = new Date(inputDate);
  
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}


const appointmentSchema = new Schema(
  {
    appointmentName: {
      type: String,
      required: true,
    },
    appointmentType: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: Date, 
      required: true,
    },
    appointmentTime: {
      type: String, 
      required: true,
    },
    appointmentwith: {
      type: String, 
    },
    duration: {
      type: Number, 
    },
    profileName:{
        type: String, 
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    // This object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);
appointmentSchema.virtual("formattedAppointmentDate").get(function () {
  return dateFormatted(this.appointmentDate);
});

appointmentSchema.virtual("formattedAppointmentDateUpdate").get(function () {
  return formatDate(this.appointmentDate);
});
 
const Appointment = model("Appointment", appointmentSchema);
  
  module.exports = Appointment;