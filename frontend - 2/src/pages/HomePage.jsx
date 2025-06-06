import React from "react";
import useLogout from "../hooks/UseLogout";

const HomePage = () => {

  const {logoutMutation, isPending, error} = useLogout();
  const handleLogout = (e) => {
    e.preventDefault();
    logoutMutation();
  }
  return (
    <div>
      <div className="border-b-2 border-gray-300">
        {/* One flex wrapper is enough; no need to nest */}
        <div className="flex justify-end w-full p-4">
          <button className="btn-md" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
