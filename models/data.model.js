const { Schema, model } = require("mongoose");

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
  const createdAtDate = this.createdAt;

  const formattedDate = `${(createdAtDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${createdAtDate.getDate()
    .toString()
    .padStart(2, '0')}/${createdAtDate.getFullYear()}`;

  return formattedDate;
});

  const Data = model("Data", dataSchema);
  
  module.exports = Data;

