import React from "react";
import { Outlet } from "react-router-dom";

const UserProfile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* কিচেন স্টাফের জন্য পুরো স্ক্রিন জুড়ে থাকবে */}
      <main className="w-full h-full p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default UserProfile;