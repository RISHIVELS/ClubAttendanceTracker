import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearUser } from "../feature/user/userSlice";
import { toast } from "react-toastify";
import axios from "../axios";

const Navigation = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dispatch = useDispatch();

  const logout = async () => {
    try {
      // Alternative syntax
      const res = await axios({
        method: "GET",
        url: "/api/v1/coordinators/logout",
        withCredentials: true,
      });

      localStorage.removeItem("user");
      toast.success("Logout successful");
      dispatch(clearUser());
    } catch (err) {
      console.error("Logout error:", err);
      localStorage.removeItem("user");
      dispatch(clearUser());
      toast.success("Logged out successfully");
    } finally {
      const cookiesToClear = ["token"];

      cookiesToClear.forEach((cookieName) => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure;`;
      });
    }
  };

  return (
    <header className="flex items-center justify-between border-b border-base-300 px-4 py-4 sm:px-6 lg:px-10">
      {/* Logo Section */}
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 text-primary">
          <svg
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <Link to="/" className="text-xl font-bold text-base-content">
          Club Hub
        </Link>
      </div>

      {/* Desktop Navigation - Hidden on mobile */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8">
        <Link
          to="/"
          className="text-sm font-medium text-base-content hover:text-primary transition-colors"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-sm font-medium text-base-content hover:text-primary transition-colors"
        >
          About
        </Link>
        <button
          className="btn btn-outline btn-sm lg:btn-md hover:btn-primary"
          onClick={logout}
        >
          <span className="truncate">Logout</span>
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div className="dropdown dropdown-end md:hidden">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu menu-sm bg-base-100 rounded-box z-50 w-52 p-2 shadow border border-base-300 mt-2"
        >
          <li>
            <Link to="/" className="text-base-content hover:text-primary">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-base-content hover:text-primary">
              About
            </Link>
          </li>
          <li className="border-t border-base-300 mt-2 pt-2">
            <button
              className="btn btn-outline btn-sm btn-block justify-start hover:btn-primary"
              onClick={logout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navigation;
