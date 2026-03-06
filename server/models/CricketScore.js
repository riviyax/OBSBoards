import mongoose from "mongoose";

const BallSchema = new mongoose.Schema({
  run: { type: Number, default: 0 }, // 0, 1, 2, 3, 4, 6
  isWicket: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const OverSchema = new mongoose.Schema({
  balls: [BallSchema]
}, { _id: false });

const CricketScoreSchema = new mongoose.Schema({
  team: { type: String, required: true },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  overs: [OverSchema], // completed overs
  currentOver: [BallSchema], // ongoing over
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("CricketScore", CricketScoreSchema);
