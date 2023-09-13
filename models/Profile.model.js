const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const profileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      required: true,
    },
    
    profilePicture: {
        type: String, 
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaUX6RE32_W5lqul-ipUqg4BM2SH1bNXQnHlzz0mvHaw&s',
        required: false,
      },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Profile = model("Profile", profileSchema);

module.exports = Profile;
