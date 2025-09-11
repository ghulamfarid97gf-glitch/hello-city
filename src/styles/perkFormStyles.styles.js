// Styles
export const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "20px",
};

export const formSectionStyle = {
  backgroundColor: "#ffffff",
  padding: "24px",
  marginBottom: "24px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

export const sectionTitleStyle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#111827",
  marginBottom: "16px",
  paddingBottom: "8px",
  borderBottom: "2px solid #e5e7eb",
};

export const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "16px",
};

export const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  marginTop: "5px",
};

export const labelStyle = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#374151",
  textAlign: "left",
};

export const buttonStyle = {
  padding: "12px 24px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  border: "none",
  transition: "background-color 0.2s",
};

export const primaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#2563eb",
  color: "#ffffff",
};

export const secondaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#6b7280",
  color: "#ffffff",
};

export const errorStyle = {
  color: "#ef4444",
  fontSize: "12px",
  marginTop: "2px",
};
