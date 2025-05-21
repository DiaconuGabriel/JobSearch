import { Link, useNavigate } from "react-router-dom";
import logoutIcon from "../../assets/logout.png";

const NavbarComponent = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="w-full flex items-center justify-between h-16 fixed px-8 bg-gray-100 top-0 left-0">
      <div className="flex items-center gap-4 ml-auto">
        <div className="flex flex-col items-center relative group opacity-100 flex-shrink-0">
          <Link to="/account">
            <button
              type="button"
              className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-300"
            >
              <svg
                className="w-8 h-8 text-black group-hover:text-blue-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 -1 23 23"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
              </svg>
            </button>
          </Link>
          <span className="absolute left-1/2 -translate-x-1/2 mt-12.5 px-2 py-1.5 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap">
            Account Settings
          </span>
        </div>
        <div className="flex flex-col items-center relative group ">
          <button
            type="button"
            className="flex items-center justify-center flex-shrink-0"
            onClick={handleLogout}
          >
            <img src={logoutIcon} width={28} height={28} alt="Logout" className="flex-shrink-0" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 mt-10.5 px-2 py-1.5 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap z-20">
            Logout
          </span>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;