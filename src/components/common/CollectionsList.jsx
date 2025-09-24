import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCollections } from "../../services/webflow/useWebflow";
import { useCollectionFields } from "../../services/webflow/useWebflow"; // Add this import
import webflowService from "../../services/webflow/webflowService";
import Loading from "./Loading";
import { toast } from "react-toastify";
import { collectionsListStyles } from "../../styles/collectionsListStyles.style";
import { displayArray } from "../../constants";

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

  console.log("collectionId ", collectionId);

  // Use collection fields hook to get the schema
  const {
    collectionsFields,
    loading: fieldsLoading,
    error: fieldsError,
  } = useCollectionFields(collectionId, true);

  // Create field mapping from slug to display name
  const fieldMapping = useMemo(() => {
    if (!collectionsFields?.fields) return {};

    const mapping = {};
    collectionsFields.fields.forEach((field) => {
      mapping[field.slug] = field.displayName;
    });

    // Add core fields that are not in the schema
    mapping.id = "ID";
    mapping.isDraft = "Draft Status";
    mapping.isArchived = "Archived Status";
    mapping.lastPublished = "Last Published";
    mapping.lastUpdated = "Last Updated";
    mapping.createdOn = "Created On";

    return mapping;
  }, [collectionsFields]);

  // Handle delete functionality
  const handleDeleteClick = (perk) => {
    setPerkToDelete(perk);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!perkToDelete?.id) return;

    setDeleteLoading(perkToDelete);
    setShowDeleteModal(false);

    try {
      const result = await webflowService.deleteCollectionItem(
        collectionId,
        perkToDelete
      );

      console.log("result ", result);

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
    } else if (currentPath.includes("/elite")) {
      navigate(`/elite-offers/edit/${perkId}`);
    } else if (currentPath.includes("/non-member")) {
      navigate(`/non-members-offers/edit/${perkId}`);
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
    } else if (currentPath.includes("/elite")) {
      navigate("/elite-offers/add");
    } else if (currentPath.includes("/non-member")) {
      navigate("/non-members-offers/add");
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
    if (currentPath.includes("/elite")) return "Elites";
    if (currentPath.includes("/non-members")) return "Non Members";
    return "Perks";
  };

  // Enhanced table columns generation with custom field ordering
  const getTableColumns = (items) => {
    if (!items || items.length === 0) return [];

    const coreFields = [
      "isDraft",
      "isArchived",
      "lastPublished",
      "lastUpdated",
      "createdOn",
    ];

    // Get field data keys from actual items
    const fieldDataKeys = new Set();
    items.forEach((item) => {
      if (item.fieldData) {
        Object.keys(item.fieldData).forEach((key) => fieldDataKeys.add(key));
      }
    });

    // Start with ID, then follow custom display order
    const orderedColumns = ["id"];

    // Add fields from displayArray in the specified order if they exist in the data
    displayArray.forEach((item) => {
      const slug = Object.keys(item)[0];
      if (fieldDataKeys.has(slug)) {
        orderedColumns.push(slug);
      }
    });

    // Add any remaining fields that might not be in displayArray
    Array.from(fieldDataKeys).forEach((field) => {
      if (!orderedColumns.includes(field)) {
        orderedColumns.push(field);
      }
    });

    // Add core fields at the end
    orderedColumns.push(...coreFields);

    return orderedColumns;
  };

  // Enhanced cell value formatting
  const formatCellValue = (value, key, fieldType = null) => {
    if (value === null || value === undefined) return "-";

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    // Handle date fields
    if (
      fieldType === "DateTime" ||
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

    // Handle object types (images, links, etc.)
    if (typeof value === "object") {
      if (key === "thumbnail-image" && value.url) {
        return value.url;
      }
      if (key === "video-link" && value.url) {
        return value.url;
      }
      if (fieldType === "Link" && value.url) {
        return value.url;
      }
      if (fieldType === "Image" && value.url) {
        return value.url;
      }
      // Handle multi-reference fields
      if (Array.isArray(value)) {
        return `${value.length} item(s)`;
      }
      return JSON.stringify(value);
    }

    // Handle rich text by stripping HTML
    if (
      fieldType === "RichText" &&
      typeof value === "string" &&
      value.includes("<")
    ) {
      return value.replace(/<[^>]*>/g, "").substring(0, 100) + "...";
    }

    // Handle long text content
    if (typeof value === "string" && value.length > 100) {
      return value.substring(0, 100) + "...";
    }

    return String(value);
  };

  // Get field type for better formatting
  const getFieldType = (fieldSlug) => {
    if (!collectionsFields?.fields) return null;
    const field = collectionsFields.fields.find((f) => f.slug === fieldSlug);
    return field?.type || null;
  };

  const getCellValue = (item, column) => {
    const coreFields = [
      "id",
      "isDraft",
      "isArchived",
      "lastPublished",
      "lastUpdated",
      "createdOn",
    ];

    if (coreFields.includes(column)) {
      return formatCellValue(item[column], column);
    }

    const fieldType = getFieldType(column);
    return formatCellValue(item.fieldData?.[column], column, fieldType);
  };

  // Get display name for column header
  const getColumnDisplayName = (column) => {
    return fieldMapping[column] || column;
  };

  // Pagination logic
  const totalItems = collections ? collections.length : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedItems = collections
    ? collections.slice(startIndex, endIndex)
    : [];

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
            {collectionsFields && (
              <p
                style={{
                  ...collectionsListStyles.subtitleStyle,
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
                Schema: {collectionsFields.displayName} (
                {collectionsFields.fields?.length || 0} fields)
              </p>
            )}
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
      {(loading || fieldsLoading) && <Loading text="Loading data..." />}

      {/* Error State */}
      {(error || fieldsError) && (
        <div style={collectionsListStyles.errorContainerStyle}>
          <h3 style={collectionsListStyles.errorTitleStyle}>
            Error loading {getCollectionType().toLowerCase()}
          </h3>
          <p style={collectionsListStyles.errorMessageStyle}>
            {error?.message || fieldsError?.message}
          </p>
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
      {!loading &&
        !fieldsLoading &&
        !error &&
        !fieldsError &&
        (!collections || collections.length === 0) && (
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
      {collections && collections.length > 0 && collectionsFields && (
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
                disabled={loading || fieldsLoading}
              >
                {loading || fieldsLoading ? "Refreshing..." : "Refresh"}
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
                        title={`Field: ${column} | Type: ${getFieldType(column) || "Core Field"}`}
                      >
                        {getColumnDisplayName(column)}
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
                            onClick={() => handleDeleteClick(item)}
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
            {(loading || fieldsLoading) && (
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
