import React from "react";

const OpenShiftUI = ({ onOpen }) => {
  return (
    <div className="bg-white p-10 rounded-xl shadow-md text-center border-t-8 border-red-500">
      <div className="mb-6 text-red-100">
         <span className="text-6xl text-red-500 font-bold">!</span>
      </div>
      <h2 className="text-2xl font-black text-gray-800 mb-2">Register is Closed</h2>
      <p className="text-gray-500 mb-8 italic">Your daily opening cash is fixed at 200 TK.</p>
      
      <button 
        onClick={onOpen}
        className="bg-red-600 text-white px-12 py-3 rounded-full font-bold text-lg hover:bg-red-700 transition-all shadow-lg active:scale-95"
      >
        START MY SHIFT
      </button>
    </div>
  );
};

export default OpenShiftUI;