import mongoose from "mongoose";
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone:{type:String},
  password: { type: String, required: true },
  avatar: {
    type: String,
  },
  userType:{type:String,},
  
  
  
});

export default mongoose.model("User", userSchema);