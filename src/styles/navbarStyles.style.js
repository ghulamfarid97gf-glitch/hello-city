// styles/navbarStyles.js

export const navbarStyles = {
  nav: {
    backgroundColor: "#ffffff",
    boxShadow:
      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    borderBottom: "1px solid #e5e7eb",
  },
  container: {
    maxWidth: "80rem",
    margin: "0 auto",
    padding: "0 1rem",
  },
  flexContainer: {
    display: "flex",
    justifyContent: "space-between",
    height: "4rem",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
  },
  navItems: {
    display: "flex",
    gap: "1rem",
  },
  navLink: {
    padding: "0.5rem 0.75rem",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    textDecoration: "none",
    transition: "all 0.2s ease",
    cursor: "pointer",
  },
  activeNavLink: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
  },
  inactiveNavLink: {
    color: "#6b7280",
  },
  navLinkHover: {
    color: "#374151",
    backgroundColor: "#f3f4f6",
  },
};

// For media queries, you can add responsive styles
export const responsiveNavbarStyles = {
  // Small screens
  "@media (min-width: 640px)": {
    container: {
      padding: "0 1.5rem",
    },
  },
  // Large screens
  "@media (min-width: 1024px)": {
    container: {
      padding: "0 2rem",
    },
  },
};
