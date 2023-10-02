const { Schema, model } = require("mongoose");
const Data = require("../models/data.model");
function dateFormatted(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const profileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique:true
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
    },
    profilePicture: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaUX6RE32_W5lqul-ipUqg4BM2SH1bNXQnHlzz0mvHaw&s",
      required: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);
profileSchema.virtual("formatteddateOfBirth").get(function () {
  return dateFormatted(this.dateOfBirth);
});



const Profile = model("Profile", profileSchema);

module.exports = Profile;
