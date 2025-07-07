import mongoose from "mongoose";
import Admin from "../Models/admin.js";
import { config } from "dotenv";
config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const existing = await Admin.findOne({ email: "admin@yesindia.org" });
    if (existing) {
      console.log("Admin already exists");
    } else {
      await Admin.create({
        email: "admin@yesindia.org",
        password: "admin123",
      });
      console.log("Admin user seeded ✅");
    }
    mongoose.disconnect();

  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedAdmin();
