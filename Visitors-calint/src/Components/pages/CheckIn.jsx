import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import { Camera, User, Smartphone, Home, Briefcase, ClipboardList, Check } from 'lucide-react';
import logoImage from '../../assets/logo.png';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const CheckIn = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    idType: 'aadhar',
    idNumber: '',
    purpose: '',
    address: '',
    designation: '',
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const webcamRef = useRef(null);
  const audioRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState('user');

  const idTypes = [
    { value: 'aadhar', label: 'Aadhar' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'license', label: 'Drivers License' },
    { value: 'voter', label: 'Voter ID' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      setIsMobile(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent));
    };

    checkMobile();

    const requestCameraPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraError(false);
      } catch (err) {
        console.error('Camera permission denied:', err);
        setCameraError(true);
        alert('Camera access is required for visitor registration. Please allow camera access.');
      }
    };

    requestCameraPermission();

    const audio = new Audio('/welcome-audio.mp3');
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const switchCamera = () => {
    setCameraFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setPhoto(imageSrc);
        setStep(2);
      } else {
        alert('Failed to capture photo. Please try again.');
      }
    } else {
      alert('Camera not available or not initialized properly.');
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setStep(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Convert base64 image to a File object
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!photo || !formData.name || !formData.mobile || !formData.purpose) {
    alert("All required fields must be filled.");
    return;
  }
  const photoFile = dataURLtoFile(photo, "visitor-photo.jpg");
  const formDataToSend = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    formDataToSend.append(key, value);
  });
  formDataToSend.append("photo", photoFile);
  setLoading(true)
  try {
    const res = await axiosInstance.post("/visitors/checkin", formDataToSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setSuccess(true); 
    toast.success(res.data.message || "Check-in successful!");

    if (audioRef.current) audioRef.current.play();
  } catch (err) {
    console.error("Submission Error:", err);
    toast.error(err.response?.data?.message || err.message || "An error occurred");
  } finally {
    setLoading(false); 
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-3 sm:p-6 flex items-center justify-center w-screen">
      <motion.div 
        className="w-full max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-white-600 to-white-800 text-white p-5 flex flex-col items-center">
          <img 
            src={logoImage} 
            alt="YES INDIA FOUNDATION Logo" 
            className="h-20 mb-3 "
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-center tracking-wide text-blue-900 p-2">YES INDIA FOUNDATION</h1>
          <h2 className="text-xl sm:text-2xl font-bold text-center tracking-wide text-blue-900 p-2">Delhi Office</h2>
          <p className="text-base sm:text-lg mt-1 font-medium text-gray-600">Visitor Register</p>
        </div>

        {success ? (
          <motion.div 
            className="p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-3">Check-In Successful!</h2>
            <p className="text-gray-600 text-lg">Welcome to YES INDIA FOUNDATION.</p>
          </motion.div>
        ) : (
          <>
            {step === 1 ? (
              <div className="p-5">
                <div className="mb-5">
                  <p className="text-center text-gray-700 mb-3 font-medium">Please look at the camera and take your photo</p>
                  <div className="relative rounded-xl overflow-hidden bg-gray-200 w-full h-64 sm:h-80 shadow-inner">
                    {cameraError ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <p className="text-red-500 text-center p-4">
                          Camera access denied. Please enable camera permissions and refresh the page.
                        </p>
                      </div>
                    ) : (
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ 
                          facingMode: cameraFacingMode,
                          width: { ideal: 1280 },
                          height: { ideal: 720 }
                        }}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  {isMobile && (
                    <div className="mt-2 text-center">
                      <button
                        type="button"
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm inline-flex items-center"
                        onClick={switchCamera}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                        </svg>
                        Switch Camera
                      </button>
                    </div>
                  )}
                </div>
                <motion.button
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center text-base sm:text-lg font-medium shadow-md"
                  whileTap={{ scale: 0.95 }}
                  onClick={capturePhoto}
                  disabled={cameraError}
                >
                  <Camera className="mr-2" size={18} /> Capture Photo
                </motion.button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5">
                <div className="mb-5">
                  <p className="text-center text-gray-700 mb-3 font-medium">Preview your photo</p>
                  <div className="relative rounded-xl overflow-hidden bg-gray-200 w-40 h-40 mx-auto mb-3 shadow-md">
                    {photo && <img src={photo} alt="Captured" className="w-full h-full object-cover" />}
                  </div>
                  <div className="text-center">
                    <button 
                      type="button" 
                      className="text-blue-600 text-sm font-medium hover:text-blue-800" 
                      onClick={retakePhoto}
                    >
                      Retake Photo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div className="sm:col-span-2">
                    <label className=" text-gray-700 font-medium mb-1 flex items-center">
                      <User className="mr-2 text-blue-600" size={18} /> Full Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className=" text-gray-700 font-medium mb-1 flex items-center">
                      <Smartphone className="mr-2 text-blue-600" size={18} /> Mobile Number <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      pattern="[0-9]{10}"
                      className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      placeholder="10 digit mobile number"
                      required
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className=" text-gray-700 font-medium mb-1 flex items-center">
                      <Home className="mr-2 text-blue-600" size={18} /> Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      rows="3"
                      placeholder="Enter your address"
                    ></textarea>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className=" text-gray-700 font-medium mb-1 flex items-center">
                      <Briefcase className="mr-2 text-blue-600" size={18} /> Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      placeholder="Enter your designation (e.g., Manager, Student)"
                    />
                  </div>
                  
                  <div>
                    <label className=" text-gray-700 font-medium mb-1 flex items-center">
                      <ClipboardList className="mr-2 text-blue-600" size={18} /> ID Type
                    </label>
                    <select
                      name="idType"
                      value={formData.idType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300  text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    >
                      {idTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">ID Number</label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg  text-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      placeholder="If applicable"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className=" text-gray-700 font-medium mb-1 flex items-center">
                      <ClipboardList className="mr-2 text-blue-600" size={18} /> Purpose of Visit <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      rows="3"
                      placeholder="Please mention your purpose of visit"
                      required
                    ></textarea>
                  </div>
                </div>
                
                <motion.button
                  type="submit"
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center text-base sm:text-lg font-medium shadow-md"
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : 'Check In'}
                </motion.button>
              </form>
            )}
          </>
        )}
        
        <div className="border-t border-gray-200 p-4 sm:p-5 text-center bg-gray-50">
          <Link to="/checkout" className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm sm:text-base">
            Need to Check Out? Click here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckIn;
