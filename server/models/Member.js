import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema({
  name: String,
  role: String
});

export default mongoose.model("Member", MemberSchema);