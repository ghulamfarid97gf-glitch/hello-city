import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navbarStyles } from "../../styles/navbarStyles.style";

const Navbar = ({ onLogout }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { name: "Perks", path: "/", collectionId: "689046505062d22cb6485ac6" },
    {
      name: "Free Offers",
      path: "/offers",
      collectionId: "686cd18f382b5b2f1dcc787b",
    },
    {
      name: "Elite Offers",
      path: "/elite-offers",
      collectionId: "68c9944867e93829d28f767f",
    },
    {
      name: "Non-Member Offers",
      path: "/non-members-offers",
      collectionId: "68cab08b7569afdf5b23fd30",
    },
    {
      name: "Places",
      path: "/places",
      collectionId: "688b15b04ee8c4d17f71c5c3",
    },
  ];

  const getNavLinkStyle = (item) => {
    const isActive = location.pathname === item.path;
    const isHovered = hoveredItem === item.name;

    let style = {
      ...navbarStyles.navLink,
      ...(isActive ? navbarStyles.activeNavLink : navbarStyles.inactiveNavLink),
    };

    if (!isActive && isHovered) {
      style = {
        ...style,
        ...navbarStyles.navLinkHover,
      };
    }

    return style;
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onLogout();
    }
  };

  // Logout button styles
  const logoutButtonStyle = {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "background-color 0.2s",
    marginLeft: "1rem",
  };

  const logoutButtonHoverStyle = {
    backgroundColor: "#c82333",
  };

  return (
    <nav style={navbarStyles.nav}>
      <div style={navbarStyles.container}>
        <div style={navbarStyles.flexContainer}>
          <div style={navbarStyles.leftSection}>
            <h1 style={navbarStyles.title}>Webflow Dashboard</h1>
            <div style={navbarStyles.navItems}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  style={getNavLinkStyle(item)}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right section with logout button */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={handleLogout}
              style={logoutButtonStyle}
              onMouseEnter={(e) => {
                Object.assign(e.target.style, logoutButtonHoverStyle);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.target.style, logoutButtonStyle);
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
