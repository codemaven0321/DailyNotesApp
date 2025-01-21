import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

const MenuBar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // For showing/hiding the MenuBar
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle scrolling to show/hide the MenuBar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop.current) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop; // Prevent negative scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-blue-600 text-white p-4 shadow-lg transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link to="/" className="text-2xl font-bold hover:text-blue-300">
            DailyVoiceNotesApp
          </Link>
        </div>
        <div>
          {user ? (
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-none rounded-lg text-sm font-medium border-2 focus:outline-none focus:ring focus:ring-red-300"
            >
              Sign Out
            </button>
          ) : (
            <div className="relative inline-block" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="px-4 py-2 rounded-lg border-2 text-sm font-medium focus:outline-none focus:ring focus:ring-gray-300"
              >
                Menu
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white text-gray-800 rounded-lg shadow-lg z-10">
                  <Link
                    to="/"
                    className="flex justify-start items-center block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaSignInAlt size={18} />
                    <p className="p-2">Login</p>
                  </Link>
                  <Link
                    to="/register"
                    className="flex justify-start items-center block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaUserPlus size={18} />
                    <p className="p-2">Register</p>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;
