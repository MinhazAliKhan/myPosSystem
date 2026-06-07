import React, { useState, useEffect } from "react";
import { useAuth } from "../store/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { FaLock, FaEnvelope, FaArrowLeft } from "react-icons/fa";

const Login = () => {
  const { login, isLogin, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLogin || !user) return;
    if (user.role?.toUpperCase() === "ADMIN") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/salesman", { replace: true });
    }
  }, [isLogin, user, navigate]);

  const validateField = (name, value) => {
    if (name === "email") {
      if (!value) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email.";
    }
    if (name === "password") {
      if (!value) return "Password is required.";
      if (value.trim().length < 6) return "Min 6 characters required.";
    }
    return null;
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    setFieldErrors(prev => ({ ...prev, email: validateField("email", val) || "" }));
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setFieldErrors(prev => ({ ...prev, password: validateField("password", val) || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setApiError("");

    const emailErr = validateField("email", email);
    const passErr = validateField("password", password);

    if (emailErr || passErr) {
      setFieldErrors({ email: emailErr, password: passErr });
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      toast.success("Welcome back!"); 
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid credentials";
      setApiError(errorMsg);
      toast.error(errorMsg); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden font-sans">
      
      {/* Background Image with Overlay (Same as Home) */}
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
            SECURE <br />
            <span className="text-red-600 italic">ACCESS</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md font-medium leading-relaxed">
            Enter your credentials to manage your store, track real-time sales, and handle shifts effortlessly.
          </p>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl">
            <div className="mb-8">
              <h3 className="text-2xl font-black text-white tracking-tight uppercase">Login</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Authorized Personnel Only</p>
            </div>

            {apiError && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 text-xs font-bold text-center">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors">
                  <FaEnvelope size={14} />
                </div>
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white text-xs font-bold placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all uppercase tracking-widest"
                />
                {fieldErrors.email && <p className="text-red-500 text-[9px] font-black mt-1 ml-2 uppercase tracking-tighter">{fieldErrors.email}</p>}
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors">
                  <FaLock size={14} />
                </div>
                <input
                  type="password"
                  placeholder="PASSWORD"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white text-xs font-bold placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all uppercase tracking-widest"
                />
                {fieldErrors.password && <p className="text-red-500 text-[9px] font-black mt-1 ml-2 uppercase tracking-tighter">{fieldErrors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-600/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Sign In Now"}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                Forgot access? <span className="text-white cursor-pointer hover:text-red-500 transition-colors">Contact Admin</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Blur Orbs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] z-0"></div>
    </div>
  );
};

export default Login;