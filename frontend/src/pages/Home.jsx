import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaChartLine, FaStore } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1556740734-7f958945582b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-red-900/40"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 animate-bounce">
          <FaStore /> Smart POS Solution
        </div>
        
        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-none">
          MANAGE YOUR BUSINESS <br /> 
          <span className="text-red-600 italic">FASTER & SMARTER</span>
        </h1>
        
        <p className="text-gray-300 text-sm md:text-lg max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          The ultimate Point of Sale system for tracking shifts, managing inventory, 
          and boosting sales with real-time analytics.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/login" 
            className="group flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-red-600/20 active:scale-95"
          >
            Launch POS System <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/salesman/dashboard" 
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
          >
            <FaChartLine /> View Analytics
          </Link>
        </div>

        {/* Floating Stats (Optional Visual Enhancement) */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-white/10 pt-10">
          <div className="text-left">
            <h4 className="text-white text-2xl font-black">100%</h4>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Accuracy</p>
          </div>
          <div className="text-left">
            <h4 className="text-white text-2xl font-black">24/7</h4>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Shift Tracking</p>
          </div>
          <div className="text-left hidden md:block">
            <h4 className="text-white text-2xl font-black">Cloud</h4>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Data Sync</p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-red-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[120px]"></div>
    </div>
  );
};

export default Home;