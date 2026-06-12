import React from "react";
import { Outlet } from "react-router-dom";

const UserProfile = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default UserProfile;