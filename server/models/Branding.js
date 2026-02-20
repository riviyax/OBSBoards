import mongoose from "mongoose";

const BrandingSchema = new mongoose.Schema({
  main: String,
  sub: String
});

export default mongoose.model("Branding", BrandingSchema);