import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navbarStyles } from "../../styles/navbarStyles.style";
// import { navbarStyles } from "../styles/navbarStyles";

const Navbar = () => {
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
