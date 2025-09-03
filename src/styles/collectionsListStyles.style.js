// styles/collectionsListStyles.js

export const collectionsListStyles = {
  // Main container
  containerStyle: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    padding: "20px",
  },

  // Header styles
  headerStyle: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
  },

  headerContentStyle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  titleStyle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px",
  },

  subtitleStyle: {
    fontSize: "14px",
    color: "#6b7280",
  },

  buttonStyle: {
    padding: "12px 24px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderRadius: "8px",
    border: "none",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },

  buttonHoverStyle: {
    backgroundColor: "#1d4ed8",
  },

  // Stats styles
  statsStyle: {
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "16px",
  },

  statsGridStyle: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    fontSize: "14px",
  },

  // Error state styles
  errorContainerStyle: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "16px",
  },

  errorTitleStyle: {
    color: "#991b1b",
    fontWeight: "600",
    margin: "0 0 4px 0",
  },

  errorMessageStyle: {
    color: "#dc2626",
    marginTop: "4px",
  },

  errorButtonStyle: {
    marginTop: "12px",
    padding: "8px 16px",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },

  // No data state styles
  noDataContainerStyle: {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "48px",
    textAlign: "center",
  },

  noDataIconStyle: {
    fontSize: "48px",
    color: "#9ca3af",
    marginBottom: "16px",
  },

  noDataTitleStyle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px",
  },

  noDataMessageStyle: {
    color: "#6b7280",
    marginBottom: "24px",
  },

  // Table styles
  tableContainerStyle: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },

  tableHeaderStyle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #e5e7eb",
  },

  tableHeaderTitleStyle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
  },

  tableHeaderActionsStyle: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  scrollHintStyle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    backgroundColor: "#eff6ff",
    borderRadius: "6px",
    fontSize: "13px",
    color: "#1d4ed8",
    fontWeight: "500",
  },

  tableWrapperStyle: {
    overflowX: "auto",
    maxWidth: "100%",
    position: "relative",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
  },

  tableStyle: {
    width: "100%",
    minWidth: "2000px",
    borderCollapse: "collapse",
  },

  tableHeadStyle: {
    backgroundColor: "#f9fafb",
  },

  tableHeaderCellStyle: {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: "600",
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
    minWidth: "150px",
    whiteSpace: "nowrap",
  },

  stickyActionHeaderStyle: {
    position: "sticky",
    right: 0,
    backgroundColor: "#1f2937",
    padding: "12px 16px",
    textAlign: "center",
    fontWeight: "700",
    color: "#ffffff",
    borderLeft: "3px solid #374151",
    zIndex: 20,
    minWidth: "140px",
    boxShadow: "-4px 0 8px rgba(0,0,0,0.1)",
    fontSize: "14px",
  },

  tableBodyRowStyle: {
    borderBottom: "1px solid #e5e7eb",
  },

  evenRowStyle: {
    backgroundColor: "#ffffff",
  },

  oddRowStyle: {
    backgroundColor: "#f9fafb",
  },

  tableCellStyle: {
    padding: "12px 16px",
    color: "#374151",
    fontSize: "14px",
    maxWidth: "200px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    textAlign: "left",
  },

  stickyActionCellStyle: {
    position: "sticky",
    right: 0,
    padding: "12px 16px",
    borderLeft: "2px solid #e5e7eb",
    zIndex: 9,
  },

  actionButtonsStyle: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
  },

  editButtonStyle: {
    padding: "6px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    cursor: "pointer",
  },

  editButtonHoverStyle: {
    backgroundColor: "#dbeafe",
  },

  deleteButtonStyle: {
    padding: "6px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    cursor: "pointer",
  },

  deleteButtonHoverStyle: {
    backgroundColor: "#fee2e2",
  },

  deleteButtonDisabledStyle: {
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    cursor: "not-allowed",
    opacity: 0.5,
  },

  // Pagination styles
  paginationStyle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
  },

  paginationInfoStyle: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  itemsPerPageStyle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  selectStyle: {
    padding: "6px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
  },

  paginationTextStyle: {
    fontSize: "14px",
    color: "#6b7280",
  },

  paginationButtonsStyle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  pageButtonStyle: {
    padding: "8px 12px",
    margin: "0 4px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
  },

  activePageButtonStyle: {
    padding: "8px 12px",
    margin: "0 4px",
    border: "1px solid #2563eb",
    borderRadius: "6px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
  },

  disabledButtonStyle: {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  // Loading states
  loadingOverlayStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  loadingContentStyle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },

  spinnerStyle: {
    width: "32px",
    height: "32px",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingTextStyle: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "500",
  },

  // Small spinner for buttons
  smallSpinnerStyle: {
    width: "14px",
    height: "14px",
    border: "2px solid #6b7280",
    borderTop: "2px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  // Modal styles
  modalOverlayStyle: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  modalStyle: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    maxWidth: "400px",
    width: "90%",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },

  modalTitleStyle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px",
  },

  modalMessageStyle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "24px",
    lineHeight: "1.5",
  },

  modalButtonContainerStyle: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  },

  modalCancelButtonStyle: {
    padding: "10px 20px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    color: "#374151",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
  },

  modalConfirmButtonStyle: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
  },

  modalCancelButtonHoverStyle: {
    backgroundColor: "#f9fafb",
  },

  modalConfirmButtonHoverStyle: {
    backgroundColor: "#b91c1c",
  },
};
