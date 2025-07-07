import jwt from "jsonwebtoken";
import Admin from "../Models/admin.js";

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const admin = await Admin.findOne({ email });
  if (!admin)
    return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await admin.matchPassword(password);
  if (!isMatch)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d", });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({ message: "Login successful", admin: { id: admin._id, email: admin.email, }, });
};



//logout
export const logoutAdmin = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: "none",
    sameSite: "Lax",
  });

  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

//current loged admin
export const logedAdmin = async (req, res) => {
  const adminId = req.admin.id
  
  const admin = await Admin.findById(adminId).select("-password")
  if (!admin) {
    res.status(404).json({ success: false, message: "Admin not found" })
  }  
  res.status(200).json({ success: true, message: "Admin data fetched successfully", data: admin })
}
