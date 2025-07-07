import Visitor from "../Models/Visitors.js";

export const checkIn = async (req, res) => {  
    const { name, mobile, purpose } = req.body;

    if (!name || !mobile || !purpose) {
      return res.status(400).json({ success: false, message: 'Name, mobile, and purpose are required', });
    }
    const existingVisitor = await Visitor.findOne({ mobile, checkOutTime: { $exists: false }, });
    if (existingVisitor) {
      return res.status(400).json({ success: false, message: 'Visitor with this mobile number is already checked in', });
    }    
    const imageUrl = req.file?.path;

    const visitor = new Visitor({
      ...req.body,
      imageUrl, 
      checkInTime: new Date(),
      checkOutTime: undefined,
    });
    await visitor.save();
    return res.status(201).json({ success: true, message: 'Visitor checked in successfully', data: visitor, });
};


//CheckOut
export const checkOut = async (req, res) => {
  const { mobile } = req.body;

  if (!mobile || !/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit mobile number', })
 }
    const visitor = await Visitor.findOne({ mobile, checkOutTime: { $exists: false }, });
    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor not found or already checked out', });
    }
    const checkOutTime = new Date();
    visitor.checkOutTime = checkOutTime;

    await visitor.save();

    const durationInMs = new Date(visitor.checkOutTime) - new Date(visitor.checkInTime);
    const durationInMinutes = Math.floor(durationInMs / 60000);
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    return res.status(200).json({
      success: true,
      message: 'Checked out successfully',
      visitor: {
        name: visitor.name,
        mobile: visitor.mobile,
        check_in_time: visitor.checkInTime,
        check_out_time: visitor.checkOutTime,
        duration: `${hours}h ${minutes}m`,
      },
    });
};



// GET all visitors
export const getAllVisitors = async (req, res) => {
    const visitors = await Visitor.find().sort({ checkInTime: -1 });
    // console.log(visitors);    
    return res.status(200).json({ success: true, message: 'Visitor list fetched successfully', data: visitors, });
}

//get by visitor id
export const getVisitorById = async (req, res) => {
  const { id } = req.params;
  const visitor = await Visitor.findById(id);
  if (!visitor) {
     return res.status(404).json({ success: false, message: 'Visitor not found', });
  }
  res.status(200).json({
    success: true,
    data: visitor,
  });
};


export const updateVisitorIdInfo = async (req, res) => {
  const { id } = req.params;
  const { idType, idNumber } = req.body;
  if (!idType || !idNumber) {
    return res.status(400).json({ success: false, message: "ID Type and ID Number are required", });
  }
    const updatedVisitor = await Visitor.findByIdAndUpdate(
      {_id:id},
      { idType, idNumber },
      { new: true }
    );

    if (!updatedVisitor) {
      return res.status(404).json({ success: false, message: "Visitor not found" });
    }
    res.status(200).json({ success: true, message: "Visitor ID information updated successfully", data: updatedVisitor, });
};
