const { Schema, model } = require("mongoose");
function dateFormatted(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}
// TODO: Please make sure you edit the User model to whatever makes sense in this case
const dataSchema = new Schema(
  {
    height: {
      type: Number,
      required: true,
      
    },
    weight: {
      type: Number,
      required: true,
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    age:{
        type:Number
    },
    BMI:{
        type : Number ,  
    },
    profileName: {
      type: String, 
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

dataSchema.virtual('formattedCreatedAt').get(function () {
  
  return dateFormatted(this.createdAt);

  

});

  const Data = model("Data", dataSchema);
  
  module.exports = Data;

