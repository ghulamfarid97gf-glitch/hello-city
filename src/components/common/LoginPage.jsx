import React, { useState } from "react";

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Simulate loading delay
    setTimeout(() => {
      const result = onLogin(formData.email, formData.password);
      if (!result.success) {
        setError(result.error);
      }
      setIsLoading(false);
    }, 500);
  };

  const loginStyles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      fontFamily: "Arial, sans-serif",
    },
    card: {
      backgroundColor: "white",
      padding: "2rem",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "400px",
    },
    title: {
      textAlign: "center",
      marginBottom: "2rem",
      color: "#333",
      fontSize: "1.5rem",
      fontWeight: "600",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    label: {
      color: "#555",
      fontSize: "0.9rem",
      fontWeight: "500",
    },
    input: {
      padding: "0.75rem",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "1rem",
      transition: "border-color 0.2s",
      outline: "none",
    },
    inputFocus: {
      borderColor: "#007bff",
    },
    button: {
      padding: "0.75rem",
      backgroundColor: isLoading ? "#ccc" : "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: isLoading ? "not-allowed" : "pointer",
      transition: "background-color 0.2s",
      marginTop: "0.5rem",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    error: {
      color: "#dc3545",
      fontSize: "0.875rem",
      textAlign: "center",
      marginTop: "0.5rem",
      padding: "0.5rem",
      backgroundColor: "#f8d7da",
      border: "1px solid #f5c6cb",
      borderRadius: "4px",
    },
    demoCredentials: {
      marginTop: "1.5rem",
      padding: "1rem",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      borderRadius: "4px",
      fontSize: "0.875rem",
    },
    demoTitle: {
      fontWeight: "600",
      marginBottom: "0.5rem",
      color: "#495057",
    },
    demoText: {
      margin: "0.25rem 0",
      color: "#6c757d",
    },
  };

  return (
    <div style={loginStyles.container}>
      <div style={loginStyles.card}>
        <h1 style={loginStyles.title}>Login to Dashboard</h1>

        <form onSubmit={handleSubmit} style={loginStyles.form}>
          <div style={loginStyles.inputGroup}>
            <label htmlFor="email" style={loginStyles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={loginStyles.input}
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div style={loginStyles.inputGroup}>
            <label htmlFor="password" style={loginStyles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={loginStyles.input}
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" style={loginStyles.button} disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          {error && <div style={loginStyles.error}>{error}</div>}
        </form>

        {/* <div style={loginStyles.demoCredentials}>
          <div style={loginStyles.demoTitle}>Demo Credentials:</div>
          <div style={loginStyles.demoText}>Email: admin@example.com</div>
          <div style={loginStyles.demoText}>Password: password123</div>
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;
