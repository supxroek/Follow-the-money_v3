import React from "react";
import { useNavigate } from "react-router-dom";

// Accept user and logout as props
const Header = ({ user, logout }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Follow the Money's
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Display user picture and name */}
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition"
                onClick={handleProfileClick}
              >
                {user?.pictureUrl && (
                  <img
                    src={user.pictureUrl}
                    alt={user.displayName}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="text-sm text-gray-700">
                  {user?.displayName}
                </span>
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-500 cursor-pointer"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
