import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: [100, 'Name cannot exceed 100 characters'] },
    mobile: { type: String, required: [true, 'Mobile number is required'], validate: { validator: function (v) { return /^[0-9]{10}$/.test(v); }, message: props => `${props.value} is not a valid mobile number!` } },
    idType: { type: String, enum: ['aadhar', 'pan', 'passport', 'voter', 'license','other',], default: 'aadhar' },
    idNumber: { type: String, trim: true, sparse: true },
    purpose: { type: String, required: [true, 'Purpose is required'], trim: true, maxlength: [500, 'Purpose cannot exceed 500 characters'] },
    address: { type: String, trim: true, maxlength: [500, 'Address cannot exceed 500 characters'] },
    designation: { type: String, trim: true, maxlength: [100, 'Designation cannot exceed 100 characters'] },
    imageUrl: { type: String, trim: true },
    office: { type: String, required: [true, 'Office is required'] },
    checkInTime: { type: Date, default: Date.now },
    checkOutTime: { type: Date },
}, { timestamps: true });

const Visitor = mongoose.model("visitor", visitorSchema)
export default Visitor


