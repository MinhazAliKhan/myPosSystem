import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaArrowLeft } from "react-icons/fa";

const Registration = () => {
  const { register } = useAuth();
  const initialState = {
    userName: "",
    email: "",
    phone: "",
    password: "",
    role: "SALESMAN"
  };

  const [formData, setFormData] = useState(initialState);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "userName":
        if (!value) return "Username is required.";
        if (value.trim().length < 2) return "Min 2 characters required.";
        break;
      case "email":
        if (!value) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email.";
        break;
      case "phone":
        if (!value) return "Phone is required.";
        if (!/^\d{10,15}$/.test(value)) return "Enter 10–15 digits.";
        break;
      case "password":
        if (!value) return "Password is required.";
        if (value.trim().length < 6) return "Min 6 characters required.";
        break;
      default:
        return null;
    }
    return null;
  };

  const validateForm = (data) => {
    const errors = {};
    for (let key in data) {
      const err = validateField(key, data[key]);
      if (err) errors[key] = err;
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const fieldError = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: fieldError || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setApiError("");

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      setFormData(initialState);
      setFieldErrors({});
      toast.success("Registration successful!");
    } catch (error) {
      const data = error.response?.data;
      let errorMsg = data?.extra ? data.extra.join("\n") : (data?.message || "Registration failed.");
      setApiError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden font-sans">
      
      {/* Background Image Overlay (Same as Home/Login) */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1556740734-7f958945582b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Branding Text */}
        <div className="hidden lg:block text-left">
          <Link to="/" className="inline-flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest mb-6 hover:text-red-400 transition-colors">
            <FaArrowLeft size={10} /> Back to Home
          </Link>
          <h1 className="text-6xl font-black text-white tracking-tighter leading-none mb-6">
            JOIN THE <br />
            <span className="text-red-600 italic">CREW</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md font-medium leading-relaxed">
            Create your account to start managing shifts and accessing our advanced POS dashboard features.
          </p>
        </div>

        {/* Right Side: Registration Form */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            <div className="mb-6">
              <h3 className="text-2xl font-black text-white tracking-tight uppercase">Register</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Setup Your Account Profile</p>
            </div>

            {apiError && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-4 text-xs font-bold text-center whitespace-pre-line">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors">
                  <FaUser size={14} />
                </div>
                <input
                  name="userName"
                  placeholder="USERNAME"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 pl-12 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all uppercase tracking-widest"
                />
                {fieldErrors.userName && <p className="text-red-500 text-[9px] font-black mt-1 ml-2 uppercase tracking-tighter">{fieldErrors.userName}</p>}
              </div>

              {/* Email */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors">
                  <FaEnvelope size={14} />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 pl-12 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all uppercase tracking-widest"
                />
                {fieldErrors.email && <p className="text-red-500 text-[9px] font-black mt-1 ml-2 uppercase tracking-tighter">{fieldErrors.email}</p>}
              </div>

              {/* Phone */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors">
                  <FaPhone size={14} />
                </div>
                <input
                  name="phone"
                  placeholder="PHONE NUMBER"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 pl-12 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all uppercase tracking-widest"
                />
                {fieldErrors.phone && <p className="text-red-500 text-[9px] font-black mt-1 ml-2 uppercase tracking-tighter">{fieldErrors.phone}</p>}
              </div>

              {/* Password */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors">
                  <FaLock size={14} />
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="PASSWORD"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 pl-12 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all uppercase tracking-widest"
                />
                {fieldErrors.password && <p className="text-red-500 text-[9px] font-black mt-1 ml-2 uppercase tracking-tighter">{fieldErrors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-600/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Register Now"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                Already member? <NavLink to="/login" className="text-white hover:text-red-500 transition-colors">Login Here</NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] z-0"></div>
    </div>
  );
};

export default Registration;