// styles/appStyles.js

export const appStyles = {
  appContainer: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
  },
  mainContent: {
    maxWidth: "80rem",
    margin: "0 auto",
    padding: "2rem 1rem",
  },
  pageHeader: {
    marginBottom: "2rem",
  },
  pageTitle: {
    fontSize: "1.875rem",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "0.5rem",
    margin: "0 0 0.5rem 0",
  },
  pageDescription: {
    color: "#6b7280",
    fontSize: "1rem",
    margin: 0,
  },
};

// Responsive styles
export const responsiveAppStyles = {
  "@media (min-width: 640px)": {
    mainContent: {
      padding: "2rem 1.5rem",
    },
  },
  "@media (min-width: 1024px)": {
    mainContent: {
      padding: "2rem 2rem",
    },
  },
};
