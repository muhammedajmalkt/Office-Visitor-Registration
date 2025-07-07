import mongoose from "mongoose";
import {hash,compare} from "bcrypt"

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, },
  password: { type: String, required: true, }, }
  , { timestamps: true });



adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);
  next();
});

//compare
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
