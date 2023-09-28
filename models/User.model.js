const { Schema, model } = require("mongoose");
function dateFormatted(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}


// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      // trim: true,
    },
    email: {
      type: String,
      required: true,
      // unique: true,
      // trim: true,
      // lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

userSchema.virtual("formattedcreatedAt").get(function () {
  return dateFormatted(this.createdAt);
});
userSchema.virtual("formattedupdatedAt").get(function () {
  return dateFormatted(this.updatedAt);
});

const User = model("User", userSchema);

module.exports = User;
