import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCollections } from "../../services/webflow/useWebflow";
import webflowService from "../../services/webflow/webflowService";
import Loading from "./Loading";
import { toast } from "react-toastify";

// Constants - move these to constants/index.js
const COLLECTIONS = {
  PERKS: "689046505062d22cb6485ac6", // Update this to your actual collection ID
};

// Confirmation Modal Component
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  const overlayStyle = {
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
  };

  const modalStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    maxWidth: "400px",
    width: "90%",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  };

  const titleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px",
  };

  const messageStyle = {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "24px",
    lineHeight: "1.5",
  };

  const buttonContainerStyle = {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  };

  const cancelButtonStyle = {
    padding: "10px 20px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    color: "#374151",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
  };

  const confirmButtonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={titleStyle}>{title}</h3>
        <p style={messageStyle}>{message}</p>
        <div style={buttonContainerStyle}>
          <button
            style={cancelButtonStyle}
            onClick={onClose}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#f9fafb")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#ffffff")}
          >
            {cancelText}
          </button>
          <button
            style={confirmButtonStyle}
            onClick={onConfirm}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#b91c1c")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#dc2626")}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const CollectionsList = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [perkToDelete, setPerkToDelete] = useState(null);

  // Use collections hook to get items from the collection
  const { collections, loading, error, refetch } = useCollections(
    COLLECTIONS.PERKS,
    true
  );

  // Handle delete functionality
  const handleDeleteClick = (perkId) => {
    setPerkToDelete(perkId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!perkToDelete) return;

    setDeleteLoading(perkToDelete);
    setShowDeleteModal(false);

    try {
      const result = await webflowService.deleteCollectionItem(
        COLLECTIONS.PERKS,
        perkToDelete
      );

      if (result.success) {
        toast.success("Perk deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        // Refetch the data to update the list
        refetch();
      } else {
        toast.error(`Failed to delete perk: ${result.error.message}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error(`Error deleting perk: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setDeleteLoading(null);
      setPerkToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setPerkToDelete(null);
  };

  const handleEdit = (perkId) => {
    navigate(`/perks/edit/${perkId}`);
  };

  const handleRefetch = async () => {
    try {
      await refetch();
      toast.success("Data refreshed successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to refresh data", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Pagination logic
  const totalItems = collections ? collections.length : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedItems = collections
    ? collections.slice(startIndex, endIndex)
    : [];

  const getTableColumns = (items) => {
    if (!items || items.length === 0) return [];

    const coreFields = [
      "id",
      "isDraft",
      "isArchived",
      "lastPublished",
      "lastUpdated",
      "createdOn",
    ];

    // Define your preferred order for field data columns
    const preferredFieldOrder = [
      "name",
      "perk-title",
      "type-of-perk",
      "member-role",
      "original-price",
      "price-you-pay-hellocity-to-get-it",
      "percent-off-this-deal-gives-you",
      "location",
      "start-date",
      "end-date",
      "thumbnail-image",
      "slug",
      // Add other fields in your preferred order
      "perk-name",
      "small-description",
      "perks-short-description",
      "description",
      "location-address",
      "point-to-place",
      "event-name",
      "time",
      "how-much-you-save",
      "how-much-you-would-pay-at-the-place",
      "plan-wise-coupen",
      "ticket-link",
      "location-link",
      "event-link",
      "video-link",
    ];

    // Get all available field data keys
    const fieldDataKeys = new Set();
    items.forEach((item) => {
      if (item.fieldData) {
        Object.keys(item.fieldData).forEach((key) => fieldDataKeys.add(key));
      }
    });

    // Order fieldData columns based on preferred order
    const orderedFieldDataColumns = [];
    const availableFieldDataKeys = Array.from(fieldDataKeys);

    // Add fields in preferred order (if they exist)
    preferredFieldOrder.forEach((field) => {
      if (availableFieldDataKeys.includes(field)) {
        orderedFieldDataColumns.push(field);
      }
    });

    // Add any remaining fields that weren't in the preferred order
    availableFieldDataKeys.forEach((field) => {
      if (!preferredFieldOrder.includes(field)) {
        orderedFieldDataColumns.push(field);
      }
    });

    // Return columns in custom order: ordered field data + core fields
    return [...orderedFieldDataColumns, ...coreFields];
  };

  const formatCellValue = (value, key) => {
    if (value === null || value === undefined) return "-";

    // Handle different data types
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (
      key.includes("date") ||
      key.includes("Published") ||
      key.includes("Updated") ||
      key.includes("createdOn")
    ) {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }

    if (typeof value === "object") {
      if (key === "thumbnail-image" && value.url) {
        return value.url;
      }
      if (key === "video-link" && value.url) {
        return value.url;
      }
      return JSON.stringify(value);
    }

    if (typeof value === "string" && value.includes("<")) {
      // Strip HTML for display
      return value.replace(/<[^>]*>/g, "").substring(0, 100) + "...";
    }

    return String(value);
  };

  const getCellValue = (item, column) => {
    if (
      [
        "id",
        "isDraft",
        "isArchived",
        "lastPublished",
        "lastUpdated",
        "createdOn",
      ].includes(column)
    ) {
      return formatCellValue(item[column], column);
    }
    return formatCellValue(item.fieldData?.[column], column);
  };

  // Styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    padding: "20px",
  };

  const headerStyle = {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
  };

  const headerContentStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px",
  };

  const subtitleStyle = {
    fontSize: "14px",
    color: "#6b7280",
  };

  const buttonStyle = {
    padding: "12px 24px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderRadius: "8px",
    border: "none",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
  };

  const statsStyle = {
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "16px",
  };

  const statsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    fontSize: "14px",
  };

  const tableContainerStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  };

  const tableWrapperStyle = {
    overflowX: "auto",
    maxWidth: "100%",
    position: "relative",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
  };

  const tableStyle = {
    width: "100%",
    minWidth: "2000px", // Ensures horizontal scroll
    borderCollapse: "collapse",
  };

  const paginationStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
  };

  const selectStyle = {
    padding: "6px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
  };

  const pageButtonStyle = {
    padding: "8px 12px",
    margin: "0 4px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
  };

  const activePageButtonStyle = {
    ...pageButtonStyle,
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderColor: "#2563eb",
  };

  return (
    <div style={containerStyle}>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Perk"
        message="Are you sure you want to delete this perk? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Header */}
      <div style={headerStyle}>
        <div style={headerContentStyle}>
          <div>
            <h2 style={titleStyle}>Perks Management</h2>
            <p style={subtitleStyle}>Collection ID: {COLLECTIONS.PERKS}</p>
          </div>
          <button
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onClick={() => navigate("/perks/add")}
          >
            + Add New Perk
          </button>
        </div>
      </div>

      {/* Stats */}
      {collections && collections.length > 0 && (
        <div style={statsStyle}>
          <div style={statsGridStyle}>
            <div>
              <span style={{ color: "#6b7280" }}>Total Perks: </span>
              <span style={{ fontWeight: "600" }}>{collections.length}</span>
            </div>
            <div>
              <span style={{ color: "#6b7280" }}>Draft: </span>
              <span style={{ fontWeight: "600" }}>
                {collections.filter((p) => p.isDraft).length}
              </span>
            </div>
            <div>
              <span style={{ color: "#6b7280" }}>Published: </span>
              <span style={{ fontWeight: "600" }}>
                {collections.filter((p) => !p.isDraft).length}
              </span>
            </div>
            <div>
              <span style={{ color: "#6b7280" }}>Archived: </span>
              <span style={{ fontWeight: "600" }}>
                {collections.filter((p) => p.isArchived).length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && <Loading text="Loading perks..." />}

      {/* Error State */}
      {error && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          <h3 style={{ color: "#991b1b", fontWeight: "600" }}>
            Error loading perks
          </h3>
          <p style={{ color: "#dc2626", marginTop: "4px" }}>{error.message}</p>
          <button
            style={{
              marginTop: "12px",
              padding: "8px 16px",
              backgroundColor: "#dc2626",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => {
              refetch();
              toast.info("Retrying to load perks...", {
                position: "top-right",
                autoClose: 2000,
              });
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* No Perks State */}
      {!loading && !error && (!collections || collections.length === 0) && (
        <div
          style={{
            backgroundColor: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "48px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              color: "#9ca3af",
              marginBottom: "16px",
            }}
          >
            📋
          </div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            No perks found
          </h3>
          <p style={{ color: "#6b7280", marginBottom: "24px" }}>
            Get started by creating your first perk
          </p>
          <button style={buttonStyle} onClick={() => navigate("/perks/add")}>
            Create First Perk
          </button>
        </div>
      )}

      {/* Table */}
      {collections && collections.length > 0 && (
        <div style={tableContainerStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#111827",
                margin: 0,
              }}
            >
              Perks Data ({collections.length})
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  backgroundColor: "#eff6ff",
                  borderRadius: "6px",
                  fontSize: "13px",
                  color: "#1d4ed8",
                  fontWeight: "500",
                }}
              >
                <span>⟵ Scroll horizontally to view all columns</span>
              </div>
              <button
                style={{ ...buttonStyle, padding: "8px 16px" }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#1d4ed8")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
                onClick={handleRefetch}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  {getTableColumns(collections).map((column) => (
                    <th
                      key={column}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: "600",
                        color: "#374151",
                        borderBottom: "1px solid #e5e7eb",
                        minWidth: "150px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {column}
                    </th>
                  ))}
                  {/* Sticky Actions Column */}
                  <th
                    style={{
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
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((item, index) => (
                  <tr
                    key={item.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {getTableColumns(collections).map((column) => (
                      <td
                        key={column}
                        style={{
                          padding: "12px 16px",
                          color: "#374151",
                          fontSize: "14px",
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          textAlign: "left",
                        }}
                      >
                        <span title={getCellValue(item, column)}>
                          {getCellValue(item, column)}
                        </span>
                      </td>
                    ))}
                    {/* Sticky Actions Column */}
                    <td
                      style={{
                        position: "sticky",
                        right: 0,
                        backgroundColor:
                          index % 2 === 0 ? "#ffffff" : "#f9fafb",
                        padding: "12px 16px",
                        borderLeft: "2px solid #e5e7eb",
                        zIndex: 9,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={() => handleEdit(item.id)}
                          style={{
                            padding: "6px",
                            border: "none",
                            borderRadius: "4px",
                            backgroundColor: "#eff6ff",
                            color: "#2563eb",
                            cursor: "pointer",
                          }}
                          onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#dbeafe")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#eff6ff")
                          }
                          title="Edit"
                        >
                          <svg
                            style={{ width: "14px", height: "14px" }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.id)}
                          disabled={deleteLoading === item.id}
                          style={{
                            padding: "6px",
                            border: "none",
                            borderRadius: "4px",
                            backgroundColor:
                              deleteLoading === item.id ? "#f3f4f6" : "#fef2f2",
                            color:
                              deleteLoading === item.id ? "#6b7280" : "#dc2626",
                            cursor:
                              deleteLoading === item.id
                                ? "not-allowed"
                                : "pointer",
                            opacity: deleteLoading === item.id ? 0.5 : 1,
                          }}
                          onMouseOver={(e) => {
                            if (deleteLoading !== item.id) {
                              e.target.style.backgroundColor = "#fee2e2";
                            }
                          }}
                          onMouseOut={(e) => {
                            if (deleteLoading !== item.id) {
                              e.target.style.backgroundColor = "#fef2f2";
                            }
                          }}
                          title={
                            deleteLoading === item.id ? "Deleting..." : "Delete"
                          }
                        >
                          {deleteLoading === item.id ? (
                            <div
                              style={{
                                width: "14px",
                                height: "14px",
                                border: "2px solid #6b7280",
                                borderTop: "2px solid transparent",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite",
                              }}
                            />
                          ) : (
                            <svg
                              style={{ width: "14px", height: "14px" }}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={paginationStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ fontSize: "14px", color: "#6b7280" }}>
                  Items per page:
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={selectStyle}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                Showing {startIndex + 1} - {endIndex} of {totalItems} entries
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  ...pageButtonStyle,
                  opacity: currentPage === 1 ? 0.5 : 1,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else {
                  const start = Math.max(1, currentPage - 2);
                  const end = Math.min(totalPages, start + 4);
                  pageNum = start + i;
                  if (pageNum > end) return null;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={
                      currentPage === pageNum
                        ? activePageButtonStyle
                        : pageButtonStyle
                    }
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                style={{
                  ...pageButtonStyle,
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CollectionsList;
