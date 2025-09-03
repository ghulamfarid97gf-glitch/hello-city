import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCollections } from "../../services/webflow/useWebflow";
import webflowService from "../../services/webflow/webflowService";
import Loading from "./Loading";
import { toast } from "react-toastify";
import { collectionsListStyles } from "../../styles/collectionsListStyles.style";

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

  return (
    <div style={collectionsListStyles.modalOverlayStyle} onClick={onClose}>
      <div
        style={collectionsListStyles.modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={collectionsListStyles.modalTitleStyle}>{title}</h3>
        <p style={collectionsListStyles.modalMessageStyle}>{message}</p>
        <div style={collectionsListStyles.modalButtonContainerStyle}>
          <button
            style={collectionsListStyles.modalCancelButtonStyle}
            onClick={onClose}
            onMouseOver={(e) =>
              Object.assign(
                e.target.style,
                collectionsListStyles.modalCancelButtonHoverStyle
              )
            }
            onMouseOut={(e) =>
              Object.assign(
                e.target.style,
                collectionsListStyles.modalCancelButtonStyle
              )
            }
          >
            {cancelText}
          </button>
          <button
            style={collectionsListStyles.modalConfirmButtonStyle}
            onClick={onConfirm}
            onMouseOver={(e) =>
              Object.assign(
                e.target.style,
                collectionsListStyles.modalConfirmButtonHoverStyle
              )
            }
            onMouseOut={(e) =>
              Object.assign(
                e.target.style,
                collectionsListStyles.modalConfirmButtonStyle
              )
            }
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const CollectionsList = ({ collectionId }) => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [perkToDelete, setPerkToDelete] = useState(null);

  // Use collections hook to get items from the collection
  const { collections, loading, error, refetch } = useCollections(
    collectionId,
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
        collectionId,
        perkToDelete
      );

      if (result.success) {
        toast.success("Item deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        refetch();
      } else {
        toast.error(`Failed to delete item: ${result.error.message}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error(`Error deleting item: ${error.message}`, {
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
    // Dynamic navigation based on current path
    const currentPath = window.location.pathname;
    if (currentPath.includes("/offers")) {
      navigate(`/offers/edit/${perkId}`);
    } else if (currentPath.includes("/places")) {
      navigate(`/places/edit/${perkId}`);
    } else {
      navigate(`/perks/edit/${perkId}`);
    }
  };

  const handleAddNew = () => {
    // Dynamic navigation based on current path
    const currentPath = window.location.pathname;
    if (currentPath.includes("/offers")) {
      navigate("/offers/add");
    } else if (currentPath.includes("/places")) {
      navigate("/places/add");
    } else {
      navigate("/perks/add");
    }
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

  // Get collection type for display
  const getCollectionType = () => {
    const currentPath = window.location.pathname;
    if (currentPath.includes("/offers")) return "Offers";
    if (currentPath.includes("/places")) return "Places";
    return "Perks";
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

    const fieldDataKeys = new Set();
    items.forEach((item) => {
      if (item.fieldData) {
        Object.keys(item.fieldData).forEach((key) => fieldDataKeys.add(key));
      }
    });

    const orderedFieldDataColumns = [];
    const availableFieldDataKeys = Array.from(fieldDataKeys);

    preferredFieldOrder.forEach((field) => {
      if (availableFieldDataKeys.includes(field)) {
        orderedFieldDataColumns.push(field);
      }
    });

    availableFieldDataKeys.forEach((field) => {
      if (!preferredFieldOrder.includes(field)) {
        orderedFieldDataColumns.push(field);
      }
    });

    return [...orderedFieldDataColumns, ...coreFields];
  };

  const formatCellValue = (value, key) => {
    if (value === null || value === undefined) return "-";

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

  return (
    <div style={collectionsListStyles.containerStyle}>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${getCollectionType().slice(0, -1)}`}
        message={`Are you sure you want to delete this ${getCollectionType().toLowerCase().slice(0, -1)}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Header */}
      <div style={collectionsListStyles.headerStyle}>
        <div style={collectionsListStyles.headerContentStyle}>
          <div>
            <h2 style={collectionsListStyles.titleStyle}>
              {getCollectionType()} Management
            </h2>
            <p style={collectionsListStyles.subtitleStyle}>
              Collection ID: {collectionId}
            </p>
          </div>
          <button
            style={collectionsListStyles.buttonStyle}
            onMouseOver={(e) =>
              Object.assign(
                e.target.style,
                collectionsListStyles.buttonHoverStyle
              )
            }
            onMouseOut={(e) =>
              Object.assign(e.target.style, collectionsListStyles.buttonStyle)
            }
            onClick={handleAddNew}
          >
            + Add New {getCollectionType().slice(0, -1)}
          </button>
        </div>
      </div>

      {/* Stats */}
      {collections && collections.length > 0 && (
        <div style={collectionsListStyles.statsStyle}>
          <div style={collectionsListStyles.statsGridStyle}>
            <div>
              <span style={{ color: "#6b7280" }}>
                Total {getCollectionType()}:{" "}
              </span>
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
      {loading && <Loading text="Loading data..." />}

      {/* Error State */}
      {error && (
        <div style={collectionsListStyles.errorContainerStyle}>
          <h3 style={collectionsListStyles.errorTitleStyle}>
            Error loading {getCollectionType().toLowerCase()}
          </h3>
          <p style={collectionsListStyles.errorMessageStyle}>{error.message}</p>
          <button
            style={collectionsListStyles.errorButtonStyle}
            onClick={() => {
              refetch();
              toast.info(
                `Retrying to load ${getCollectionType().toLowerCase()}...`,
                {
                  position: "top-right",
                  autoClose: 2000,
                }
              );
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* No Data State */}
      {!loading && !error && (!collections || collections.length === 0) && (
        <div style={collectionsListStyles.noDataContainerStyle}>
          <div style={collectionsListStyles.noDataIconStyle}>📋</div>
          <h3 style={collectionsListStyles.noDataTitleStyle}>
            No {getCollectionType().toLowerCase()} found
          </h3>
          <p style={collectionsListStyles.noDataMessageStyle}>
            Get started by creating your first{" "}
            {getCollectionType().toLowerCase().slice(0, -1)}
          </p>
          <button
            style={collectionsListStyles.buttonStyle}
            onClick={handleAddNew}
          >
            Create First {getCollectionType().slice(0, -1)}
          </button>
        </div>
      )}

      {/* Table */}
      {collections && collections.length > 0 && (
        <div style={collectionsListStyles.tableContainerStyle}>
          <div style={collectionsListStyles.tableHeaderStyle}>
            <h3 style={collectionsListStyles.tableHeaderTitleStyle}>
              {getCollectionType()} Data ({collections.length})
            </h3>
            <div style={collectionsListStyles.tableHeaderActionsStyle}>
              <div style={collectionsListStyles.scrollHintStyle}>
                <span>⟵ Scroll horizontally to view all columns</span>
              </div>
              <button
                style={{
                  ...collectionsListStyles.buttonStyle,
                  padding: "8px 16px",
                }}
                onMouseOver={(e) =>
                  Object.assign(
                    e.target.style,
                    collectionsListStyles.buttonHoverStyle
                  )
                }
                onMouseOut={(e) =>
                  Object.assign(e.target.style, {
                    ...collectionsListStyles.buttonStyle,
                    padding: "8px 16px",
                  })
                }
                onClick={handleRefetch}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div style={collectionsListStyles.tableWrapperStyle}>
              <table style={collectionsListStyles.tableStyle}>
                <thead style={collectionsListStyles.tableHeadStyle}>
                  <tr>
                    {getTableColumns(collections).map((column) => (
                      <th
                        key={column}
                        style={collectionsListStyles.tableHeaderCellStyle}
                      >
                        {column}
                      </th>
                    ))}
                    <th style={collectionsListStyles.stickyActionHeaderStyle}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((item, index) => (
                    <tr
                      key={item.id}
                      style={{
                        ...collectionsListStyles.tableBodyRowStyle,
                        ...(index % 2 === 0
                          ? collectionsListStyles.evenRowStyle
                          : collectionsListStyles.oddRowStyle),
                      }}
                    >
                      {getTableColumns(collections).map((column) => (
                        <td
                          key={column}
                          style={collectionsListStyles.tableCellStyle}
                        >
                          <span title={getCellValue(item, column)}>
                            {getCellValue(item, column)}
                          </span>
                        </td>
                      ))}
                      <td
                        style={{
                          ...collectionsListStyles.stickyActionCellStyle,
                          backgroundColor:
                            index % 2 === 0 ? "#ffffff" : "#f9fafb",
                        }}
                      >
                        <div style={collectionsListStyles.actionButtonsStyle}>
                          <button
                            onClick={() => handleEdit(item.id)}
                            style={collectionsListStyles.editButtonStyle}
                            onMouseOver={(e) =>
                              Object.assign(
                                e.target.style,
                                collectionsListStyles.editButtonHoverStyle
                              )
                            }
                            onMouseOut={(e) =>
                              Object.assign(
                                e.target.style,
                                collectionsListStyles.editButtonStyle
                              )
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
                              ...collectionsListStyles.deleteButtonStyle,
                              ...(deleteLoading === item.id
                                ? collectionsListStyles.deleteButtonDisabledStyle
                                : {}),
                            }}
                            onMouseOver={(e) => {
                              if (deleteLoading !== item.id) {
                                Object.assign(
                                  e.target.style,
                                  collectionsListStyles.deleteButtonHoverStyle
                                );
                              }
                            }}
                            onMouseOut={(e) => {
                              if (deleteLoading !== item.id) {
                                Object.assign(
                                  e.target.style,
                                  collectionsListStyles.deleteButtonStyle
                                );
                              }
                            }}
                            title={
                              deleteLoading === item.id
                                ? "Deleting..."
                                : "Delete"
                            }
                          >
                            {deleteLoading === item.id ? (
                              <div
                                style={collectionsListStyles.smallSpinnerStyle}
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

            {/* Table Loading Overlay */}
            {loading && (
              <div style={collectionsListStyles.loadingOverlayStyle}>
                <div style={collectionsListStyles.loadingContentStyle}>
                  <div style={collectionsListStyles.spinnerStyle}></div>
                  <span style={collectionsListStyles.loadingTextStyle}>
                    Loading {getCollectionType().toLowerCase()}...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div style={collectionsListStyles.paginationStyle}>
            <div style={collectionsListStyles.paginationInfoStyle}>
              <div style={collectionsListStyles.itemsPerPageStyle}>
                <span style={collectionsListStyles.paginationTextStyle}>
                  Items per page:
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={collectionsListStyles.selectStyle}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div style={collectionsListStyles.paginationTextStyle}>
                Showing {startIndex + 1} - {endIndex} of {totalItems} entries
              </div>
            </div>

            <div style={collectionsListStyles.paginationButtonsStyle}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  ...collectionsListStyles.pageButtonStyle,
                  ...(currentPage === 1
                    ? collectionsListStyles.disabledButtonStyle
                    : {}),
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
                        ? collectionsListStyles.activePageButtonStyle
                        : collectionsListStyles.pageButtonStyle
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
                  ...collectionsListStyles.pageButtonStyle,
                  ...(currentPage === totalPages
                    ? collectionsListStyles.disabledButtonStyle
                    : {}),
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animation */}
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
