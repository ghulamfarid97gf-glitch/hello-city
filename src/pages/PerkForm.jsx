import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useCreatePerk,
  useUpdatePerk,
  usePerk,
  useCollectionFields,
  useCollections,
} from "../services/webflow/useWebflow";
import { toast } from "react-toastify";
import {
  containerStyle,
  fieldStyle,
  formSectionStyle,
  gridStyle,
  labelStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  sectionTitleStyle,
} from "../styles/perkFormStyles.styles";

// Constants
const COLLECTIONS = {
  PERKS: "689046505062d22cb6485ac6",
};

const PerkForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // API hooks
  const { createPerk, loading: creating, error: createError } = useCreatePerk();
  const { updatePerk, loading: updating, error: updateError } = useUpdatePerk();
  const {
    perk,
    loading: fetching,
    error: fetchError,
  } = usePerk(COLLECTIONS.PERKS, id, isEdit);

  // Use collections hook to get items from the collection
  const { collectionsFields, loading: fieldsLoading } = useCollectionFields(
    COLLECTIONS.PERKS,
    true
  );

  const removedFileds = ["plan-wise-coupen", "slug", "location"];

  // Custom display sequence - matching the table sequence but excluding slug
  const formFieldSequence = [
    // Perk-related fields at the start
    "name",
    "location-address",
    "video-link-text",
    "start-date",
    "end-date",
    "offers",
    "places",

    // Remaining fields
    "video-thumbnail-link",
    "thumbnail-image",
    "offer-on-tickets-for-elite-members",
    "how-much-save-for-elite-member",
    "offer-description-elite-member",
    "new-price-for-elite-member",
    "cutoff-value-for-elite-member",
    "offer-on-tickets-for-free-members",
    "how-much-save-for-free-member",
    "cutoff-value-for-free-member",
    "new-price-for-free-member",
    "offer-description-free-member",

    // Note: "slug" excluded as it will be auto-generated

    // Event-related fields grouped at the end
    "event-name",
    "description",
    "booking-link",
    "event-link",
    "when",
    "event-time",
  ];

  // Dynamic form state
  const [collectionSchema, setCollectionSchema] = useState(null);
  const [formData, setFormData] = useState({
    isArchived: false,
    isDraft: false,
  });
  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [schemaLoading, setSchemaLoading] = useState(true);

  // State for MultiReference collections data
  const [multiReferenceData, setMultiReferenceData] = useState({});
  const [multiReferenceLoading, setMultiReferenceLoading] = useState({});

  // Hooks for fetching MultiReference collections
  const offersCollectionId = "686cd18f382b5b2f1dcc787b";
  const placesCollectionId = "688b15b04ee8c4d17f71c5c3";

  const { collections: offersData, loading: offersLoading } = useCollections(
    offersCollectionId,
    true
  );
  const { collections: placesData, loading: placesLoading } = useCollections(
    placesCollectionId,
    true
  );

  // Update multiReferenceData when collections load
  useEffect(() => {
    setMultiReferenceData({
      [offersCollectionId]: offersData || [],
      [placesCollectionId]: placesData || [],
    });
    setMultiReferenceLoading({
      [offersCollectionId]: offersLoading,
      [placesCollectionId]: placesLoading,
    });
  }, [offersData, placesData, offersLoading, placesLoading]);

  // Load collection schema on mount
  useEffect(() => {
    const loadCollectionSchema = async (collectionsFields) => {
      try {
        const schema = collectionsFields;
        setCollectionSchema(schema);

        // Initialize form data with default values based on schema
        const initialFormData = {
          isArchived: false,
          isDraft: false,
        };

        schema?.fields?.forEach((field) => {
          // Skip slug field as it will be auto-generated
          if (field.slug === "slug") {
            return;
          }

          let defaultValue;

          switch (field.type) {
            case "Number":
              defaultValue = 0;
              break;
            case "DateTime":
              defaultValue = "";
              break;
            case "MultiReference":
              defaultValue = [];
              break;
            case "PlainText":
            case "RichText":
            case "Link":
            case "VideoLink":
            case "Option":
            case "Image":
            default:
              defaultValue = "";
              break;
          }

          initialFormData[field.slug] = defaultValue;
        });

        setFormData(initialFormData);
        setSchemaLoading(false);
      } catch (error) {
        console.error("Error loading collection schema:", error);
        setSchemaLoading(false);
      }
    };

    if (collectionsFields) {
      loadCollectionSchema(collectionsFields);
    }
  }, [collectionsFields]);

  // Load perk data for edit mode
  useEffect(() => {
    if (perk && isEdit && collectionSchema && !fieldsLoading) {
      const processedFieldData = { ...perk.fieldData };

      // Process complex field types for edit mode
      collectionSchema?.fields?.forEach((field) => {
        // Skip slug field processing
        if (field.slug === "slug") {
          return;
        }

        const fieldValue = processedFieldData[field.slug];

        if (fieldValue) {
          switch (field.type) {
            case "Option":
              // Convert option ID back to option name for display
              if (
                field.validations?.options &&
                typeof fieldValue === "string"
              ) {
                const matchingOption = field.validations.options.find(
                  (opt) => opt.id === fieldValue
                );
                if (matchingOption) {
                  processedFieldData[field.slug] = matchingOption.name;
                }
              }
              break;

            case "Image":
              // Extract URL from image object
              if (typeof fieldValue === "object" && fieldValue.url) {
                processedFieldData[field.slug] = fieldValue.url;
              }
              break;

            case "VideoLink":
              // Extract URL from video object
              if (typeof fieldValue === "object" && fieldValue.url) {
                processedFieldData[field.slug] = fieldValue.url;
              }
              break;

            case "MultiReference":
              // Handle MultiReference - fieldValue should be array of IDs
              if (Array.isArray(fieldValue)) {
                processedFieldData[field.slug] = fieldValue;
              } else if (fieldValue) {
                // In case it's a single value, convert to array
                processedFieldData[field.slug] = [fieldValue];
              } else {
                processedFieldData[field.slug] = [];
              }
              break;
          }
        }
      });

      setFormData((prevData) => ({
        isArchived: perk.isArchived || false,
        isDraft: perk.isDraft || false,
        ...prevData,
        ...processedFieldData,
      }));
    }
  }, [perk, isEdit, collectionSchema, fieldsLoading]);

  // Get ordered fields based on custom sequence
  const getOrderedFields = () => {
    if (!collectionSchema?.fields) return [];

    const fieldsMap = {};
    collectionSchema.fields.forEach((field) => {
      fieldsMap[field.slug] = field;
    });

    const orderedFields = [];

    // First, add fields in the specified sequence order
    formFieldSequence.forEach((slug) => {
      if (fieldsMap[slug]) {
        orderedFields.push(fieldsMap[slug]);
        delete fieldsMap[slug]; // Remove from map to avoid duplicates
      }
    });

    // Then add any remaining fields that weren't in the sequence (excluding slug)
    Object.values(fieldsMap).forEach((field) => {
      if (!removedFileds.includes(field.slug)) {
        orderedFields.push(field);
      }
    });

    return orderedFields;
  };

  // Group fields by logical sections while maintaining sequence
  const getFieldsBySequencedCategories = () => {
    const orderedFields = getOrderedFields();

    const categories = {
      primary: [], // name, location-address, video-link-text
      dates: [], // start-date, end-date
      references: [], // offers, places
      location: [], // location
      general: [], // plan-wise-coupen, video-thumbnail-link, thumbnail-image
      elite: [], // elite member fields
      free: [], // free member fields
      event: [], // event-related fields
    };

    orderedFields.forEach((field) => {
      const slug = field.slug.toLowerCase();

      if (slug.includes("elite")) {
        categories.elite.push(field);
      } else if (slug.includes("free")) {
        categories.free.push(field);
      } else if (
        slug.includes("event") ||
        slug === "when" ||
        slug === "description" ||
        slug === "booking-link"
      ) {
        categories.event.push(field);
      } else {
        categories.general.push(field);
      }
    });

    return categories;
  };

  // Dynamic validation based on schema
  const validateForm = () => {
    if (!collectionSchema) return false;

    const newErrors = {};

    collectionSchema?.fields?.forEach((field) => {
      // Skip validation for slug field
      if (field.slug === "slug") {
        return;
      }

      const value = formData[field.slug];

      // Required field validation
      if (field.isRequired) {
        if (field.type === "MultiReference") {
          if (!value || !Array.isArray(value) || value.length === 0) {
            newErrors[field.slug] = `${field.displayName} is required`;
            return;
          }
        } else if (
          !value ||
          (typeof value === "string" && value.trim() === "")
        ) {
          newErrors[field.slug] = `${field.displayName} is required`;
          return;
        }
      }

      // Skip further validation if field is empty and not required
      if (field.type === "MultiReference") {
        if (!value || !Array.isArray(value) || value.length === 0) {
          return;
        }
      } else if (!value || (typeof value === "string" && value.trim() === "")) {
        return;
      }

      // Type-specific validations
      switch (field.type) {
        case "Link":
        case "VideoLink":
          if (!isValidUrl(value)) {
            newErrors[field.slug] =
              `Please enter a valid URL for ${field.displayName}`;
          }
          break;

        case "Number":
          const numValue = parseFloat(value);
          if (isNaN(numValue)) {
            newErrors[field.slug] =
              `${field.displayName} must be a valid number`;
          } else if (
            field.validations?.allowNegative === false &&
            numValue < 0
          ) {
            newErrors[field.slug] = `${field.displayName} cannot be negative`;
          }
          break;

        case "PlainText":
          if (
            field.validations?.maxLength &&
            value.length > field.validations.maxLength
          ) {
            newErrors[field.slug] =
              `${field.displayName} must be less than ${field.validations.maxLength} characters`;
          }
          break;

        case "MultiReference":
          // Additional validation for MultiReference if needed
          if (Array.isArray(value) && value.length > 0) {
            // Validate that all selected IDs exist in the referenced collection
            const referencedCollectionId = field.validations?.collectionId;
            const availableItems =
              multiReferenceData[referencedCollectionId] || [];
            const availableIds = availableItems.map((item) => item.id);

            const invalidIds = value.filter((id) => !availableIds.includes(id));
            if (invalidIds.length > 0) {
              newErrors[field.slug] =
                `Some selected ${field.displayName.toLowerCase()} are no longer available`;
            }
          }
          break;
      }
    });

    // Custom business logic validations
    if (formData["start-date"] && formData["end-date"]) {
      const startDate = new Date(formData["start-date"]);
      const endDate = new Date(formData["end-date"]);
      if (startDate > endDate) {
        newErrors["end-date"] = "End date must be after start date";
      }
    }

    if (formData["percent-off-this-deal-gives-you"]) {
      const percent = parseFloat(formData["percent-off-this-deal-gives-you"]);
      if (percent < 0 || percent > 100) {
        newErrors["percent-off-this-deal-gives-you"] =
          "Percentage must be between 0 and 100";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleMultiReferenceChange = (fieldSlug, itemId, isChecked) => {
    setFormData((prev) => {
      const currentValues = prev[fieldSlug] || [];
      let newValues;

      if (isChecked) {
        // Add the item if it's not already selected
        newValues = currentValues.includes(itemId)
          ? currentValues
          : [...currentValues, itemId];
      } else {
        // Remove the item
        newValues = currentValues.filter((id) => id !== itemId);
      }

      return {
        ...prev,
        [fieldSlug]: newValues,
      };
    });

    // Clear error when user makes a selection
    if (errors[fieldSlug]) {
      setErrors((prev) => ({
        ...prev,
        [fieldSlug]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!validateForm()) {
      return;
    }

    try {
      // Process form data before submission to convert back to API format
      const processedFormData = { ...formData };

      if (collectionSchema) {
        collectionSchema?.fields?.forEach((field) => {
          // Skip processing slug field
          if (field.slug === "slug") {
            return;
          }

          const fieldValue = processedFormData[field.slug];

          if (fieldValue) {
            switch (field.type) {
              case "Option":
                // Convert option name back to option ID for submission
                if (
                  field.validations?.options &&
                  typeof fieldValue === "string"
                ) {
                  const matchingOption = field.validations.options.find(
                    (opt) => opt.name === fieldValue
                  );
                  if (matchingOption) {
                    processedFormData[field.slug] = matchingOption.id;
                  }
                }
                break;

              case "VideoLink":
                // For video links, if it's just a URL string, convert to expected format
                if (typeof fieldValue === "string" && fieldValue.trim()) {
                  processedFormData[field.slug] = fieldValue.trim();
                }
                break;

              case "MultiReference":
                // MultiReference values are already in the correct format (array of IDs)
                if (Array.isArray(fieldValue)) {
                  processedFormData[field.slug] = fieldValue;
                } else {
                  processedFormData[field.slug] = [];
                }
                break;
            }
          }
        });
      }

      let result;
      if (isEdit) {
        result = await updatePerk(COLLECTIONS.PERKS, id, processedFormData);
      } else {
        result = await createPerk(COLLECTIONS.PERKS, processedFormData);
      }

      if (result.success) {
        toast.success(
          isEdit ? "Perk updated successfully" : "Perk created successfully"
        );
        navigate("/");
      } else {
        console.error("API Error:", result.error);
        setErrors({
          submit: result.error.message || "An error occurred while saving",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors({ submit: "An unexpected error occurred" });
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  // State for dropdown management
  const [dropdownStates, setDropdownStates] = useState({});
  const [searchTerms, setSearchTerms] = useState({});

  const toggleDropdown = (fieldSlug) => {
    setDropdownStates((prev) => ({
      ...prev,
      [fieldSlug]: !prev[fieldSlug],
    }));
  };

  const handleSearchChange = (fieldSlug, searchTerm) => {
    setSearchTerms((prev) => ({
      ...prev,
      [fieldSlug]: searchTerm,
    }));
  };

  const removeSelectedItem = (fieldSlug, itemId) => {
    setFormData((prev) => ({
      ...prev,
      [fieldSlug]: (prev[fieldSlug] || []).filter((id) => id !== itemId),
    }));

    // Clear error when user removes item
    if (errors[fieldSlug]) {
      setErrors((prev) => ({
        ...prev,
        [fieldSlug]: null,
      }));
    }
  };

  // Render MultiReference field
  const renderMultiReferenceField = (field) => {
    const fieldError = errors[field.slug];
    const selectedValues = formData[field.slug] || [];
    const referencedCollectionId = field.validations?.collectionId;
    const availableItems = multiReferenceData[referencedCollectionId] || [];
    const isLoading = multiReferenceLoading[referencedCollectionId];
    const isOpen = dropdownStates[field.slug] || false;
    const searchTerm = searchTerms[field.slug] || "";

    if (isLoading) {
      return (
        <div
          style={{
            padding: "16px",
            textAlign: "center",
            color: "#6b7280",
            backgroundColor: "#f9fafb",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
          }}
        >
          Loading {field.displayName.toLowerCase()}...
        </div>
      );
    }

    if (!availableItems.length) {
      return (
        <div
          style={{
            padding: "16px",
            textAlign: "center",
            color: "#ef4444",
            backgroundColor: "#fef2f2",
            borderRadius: "6px",
            border: "1px solid #fecaca",
          }}
        >
          No {field.displayName.toLowerCase()} available
        </div>
      );
    }

    // Get selected items for display
    const selectedItems = availableItems.filter((item) =>
      selectedValues.includes(item.id)
    );

    // Filter available items based on search and exclude already selected
    const filteredItems = availableItems.filter((item) => {
      const itemName = item.fieldData?.name || item.name || `Item ${item.id}`;
      const matchesSearch = itemName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const notSelected = !selectedValues.includes(item.id);
      return matchesSearch && notSelected;
    });

    return (
      <div style={{ position: "relative" }}>
        {/* Dropdown Trigger with Tags Inside */}
        <div
          onClick={() => toggleDropdown(field.slug)}
          style={{
            padding: selectedItems.length > 0 ? "8px 12px" : "12px 16px",
            border: fieldError ? "1px solid #ef4444" : "1px solid #d1d5db",
            borderRadius: "6px",
            backgroundColor: "#fff",
            cursor: "pointer",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "6px",
            minHeight: "40px",
            boxSizing: "border-box",
          }}
        >
          {/* Selected Items Tags Inside Field */}
          {selectedItems.length > 0 ? (
            <>
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "16px",
                    fontSize: "12px",
                    fontWeight: "500",
                    gap: "4px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <span>
                    {item.fieldData?.name || item.name || `Item ${item.id}`}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelectedItem(field.slug, item.id);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      padding: "0",
                      width: "16px",
                      height: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      fontSize: "14px",
                      lineHeight: "1",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {/* Spacer to push arrow to the right */}
              <div style={{ flex: 1 }}></div>
            </>
          ) : (
            <span
              style={{
                color: "#9ca3af",
                fontSize: "14px",
                flex: 1,
              }}
            >
              Select {field.displayName.toLowerCase()}
            </span>
          )}

          {/* Dropdown Arrow */}
          <span
            style={{
              fontSize: "12px",
              color: "#6b7280",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
              marginLeft: "8px",
            }}
          >
            ▼
          </span>
        </div>

        {/* Dropdown Content */}
        {isOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              zIndex: 1000,
              maxHeight: "300px",
              overflowY: "auto",
              marginTop: "4px",
            }}
          >
            {/* Search Input */}
            <div style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
              <input
                type="text"
                placeholder={`Search ${field.displayName.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => handleSearchChange(field.slug, e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Available Items */}
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      handleMultiReferenceChange(field.slug, item.id, true);
                      handleSearchChange(field.slug, ""); // Clear search after selection
                    }}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f3f4f6",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "500",
                        color: "#374151",
                        fontSize: "14px",
                        marginBottom: "2px",
                      }}
                    >
                      {item.fieldData?.name || item.name || `Item ${item.id}`}
                    </div>
                    {item.fieldData?.description && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          lineHeight: "1.4",
                        }}
                      >
                        {item.fieldData.description.length > 80
                          ? `${item.fieldData.description.substring(0, 80)}...`
                          : item.fieldData.description}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  {searchTerm
                    ? "No items match your search"
                    : "No more items to select"}
                </div>
              )}
            </div>

            {/* Footer with count */}
            <div
              style={{
                padding: "8px 16px",
                backgroundColor: "#f9fafb",
                borderTop: "1px solid #e5e7eb",
                fontSize: "12px",
                color: "#6b7280",
                textAlign: "center",
              }}
            >
              {selectedItems.length} of {availableItems.length} selected
            </div>
          </div>
        )}

        {/* Click outside to close dropdown */}
        {isOpen && (
          <div
            onClick={() => toggleDropdown(field.slug)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
          />
        )}
      </div>
    );
  };

  // Render form field based on type
  const renderField = (field) => {
    const fieldError = errors[field.slug];
    const fieldValue = formData[field.slug] || "";

    const baseInputStyle = {
      padding: "8px 12px",
      border: fieldError ? "1px solid #ef4444" : "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "14px",
      minHeight: "40px",
      width: "100%",
      boxSizing: "border-box",
    };

    // Handle MultiReference fields
    if (field.type === "MultiReference") {
      return renderMultiReferenceField(field);
    }

    switch (field.type) {
      case "PlainText":
        const isTextArea = field.validations?.singleLine === false;

        if (isTextArea) {
          return (
            <textarea
              value={fieldValue}
              onChange={(e) => handleInputChange(field.slug, e.target.value)}
              style={{
                ...baseInputStyle,
                minHeight: "100px",
                resize: "vertical",
              }}
              maxLength={field.validations?.maxLength}
              placeholder={
                field.helpText || `Enter ${field.displayName.toLowerCase()}`
              }
            />
          );
        }

        return (
          <input
            type="text"
            value={fieldValue}
            onChange={(e) => handleInputChange(field.slug, e.target.value)}
            style={baseInputStyle}
            maxLength={field.validations?.maxLength}
            required={field.isRequired}
            placeholder={
              field.helpText || `Enter ${field.displayName.toLowerCase()}`
            }
          />
        );

      case "RichText":
        return (
          <textarea
            value={fieldValue}
            onChange={(e) => handleInputChange(field.slug, e.target.value)}
            style={{
              ...baseInputStyle,
              minHeight: "150px",
              resize: "vertical",
            }}
            placeholder={
              field.helpText || `Enter ${field.displayName.toLowerCase()}`
            }
          />
        );

      case "Number":
        return (
          <input
            type="number"
            value={fieldValue}
            onChange={(e) =>
              handleInputChange(field.slug, parseFloat(e.target.value) || 0)
            }
            style={baseInputStyle}
            min={field.validations?.allowNegative === false ? "0" : undefined}
            step={field.validations?.precision ? "0.01" : "1"}
            required={field.isRequired}
            placeholder={
              field.helpText || `Enter ${field.displayName.toLowerCase()}`
            }
          />
        );

      case "DateTime":
        return (
          <input
            type="date"
            value={formatDateForInput(fieldValue)}
            onChange={(e) =>
              handleInputChange(
                field.slug,
                e.target.value ? new Date(e.target.value).toISOString() : ""
              )
            }
            style={baseInputStyle}
            required={field.isRequired}
          />
        );

      case "Link":
      case "VideoLink":
        return (
          <input
            type="url"
            value={fieldValue}
            onChange={(e) => handleInputChange(field.slug, e.target.value)}
            style={baseInputStyle}
            required={field.isRequired}
            placeholder={field.helpText || "https://example.com"}
          />
        );

      case "Option":
        return (
          <select
            value={fieldValue}
            onChange={(e) => handleInputChange(field.slug, e.target.value)}
            style={{
              ...baseInputStyle,
              cursor: "pointer",
            }}
            required={field.isRequired}
          >
            <option value="">Select {field.displayName.toLowerCase()}</option>
            {field.validations?.options?.map((option) => (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        );

      case "Image":
        return (
          <div>
            {fieldValue && (
              <div style={{ marginBottom: "8px" }}>
                <img
                  src={fieldValue}
                  alt="Current thumbnail"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "150px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    border: "1px solid #d1d5db",
                  }}
                />
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    margin: "4px 0",
                  }}
                >
                  Current image
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                // Handle image upload - you'll need to implement this
                console.log("Image upload:", e.target.files[0]);
                // For now, just store the file name or handle as needed
                if (e.target.files[0]) {
                  // You would typically upload the file to your server/CDN here
                  // and then update the field with the new URL
                  handleInputChange(field.slug, e.target.files[0].name);
                }
              }}
              style={baseInputStyle}
            />
            <p
              style={{
                fontSize: "12px",
                color: "#6b7280",
                margin: "4px 0 0 0",
              }}
            >
              Upload a new image file (will replace current image)
            </p>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={fieldValue}
            onChange={(e) => handleInputChange(field.slug, e.target.value)}
            style={baseInputStyle}
            required={field.isRequired}
            placeholder={
              field.helpText || `Enter ${field.displayName.toLowerCase()}`
            }
          />
        );
    }
  };

  const loading = creating || updating || fetching || schemaLoading;
  const apiError = createError || updateError || fetchError;

  // Add missing errorStyle definition
  const errorStyle = {
    color: "#ef4444",
    fontSize: "12px",
    marginTop: "4px",
  };

  // Loading state for schema or edit mode
  if (schemaLoading || (isEdit && fetching)) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "16px", color: "#6b7280" }}>
            {schemaLoading ? "Loading form schema..." : "Loading perk data..."}
          </div>
        </div>
      </div>
    );
  }

  // Error state for fetch
  if (isEdit && fetchError) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div
            style={{ fontSize: "16px", color: "#ef4444", marginBottom: "16px" }}
          >
            Error loading perk: {fetchError.message}
          </div>
          <button onClick={() => navigate("/")} style={secondaryButtonStyle}>
            Back to List
          </button>
        </div>
      </div>
    );
  }

  if (!collectionSchema) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "16px", color: "#ef4444" }}>
            Failed to load form schema
          </div>
        </div>
      </div>
    );
  }

  const fieldCategories = getFieldsBySequencedCategories();

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <button onClick={() => navigate("/")} style={secondaryButtonStyle}>
            ← Back to List
          </button>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#111827",
              margin: 0,
            }}
          >
            {isEdit
              ? `Edit ${collectionSchema?.singularName}`
              : `Add New ${collectionSchema?.singularName}`}
          </h2>
        </div>
        <p style={{ color: "#6b7280", fontSize: "16px" }}>
          {isEdit
            ? `Update ${collectionSchema?.singularName?.toLowerCase()} information`
            : `Create a new ${collectionSchema?.singularName?.toLowerCase()} for your collection`}
        </p>
        <p style={{ color: "#9ca3af", fontSize: "14px", fontStyle: "italic" }}>
          Note: Slug will be automatically generated based on the perk name
        </p>
      </div>

      {/* API Error Display */}
      {apiError && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <h3
            style={{ color: "#991b1b", fontWeight: "600", margin: "0 0 8px 0" }}
          >
            API Error
          </h3>
          <p style={{ color: "#dc2626", margin: 0 }}>{apiError.message}</p>
        </div>
      )}

      {/* Form Submission Error */}
      {errors.submit && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <p style={{ color: "#dc2626", margin: 0 }}>{errors.submit}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Status Controls */}
        <div style={formSectionStyle}>
          <h3 style={sectionTitleStyle}>Status</h3>
          <div
            style={{
              display: "flex",
              gap: "24px",
              padding: "16px",
              backgroundColor: "#f9fafb",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                id="isDraft"
                checked={formData.isDraft}
                onChange={(e) => handleInputChange("isDraft", e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <label
                htmlFor="isDraft"
                style={{ ...labelStyle, cursor: "pointer", margin: 0 }}
              >
                Draft Status
              </label>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>
                (Save as draft without publishing)
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                id="isArchived"
                checked={formData.isArchived}
                onChange={(e) =>
                  handleInputChange("isArchived", e.target.checked)
                }
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <label
                htmlFor="isArchived"
                style={{ ...labelStyle, cursor: "pointer", margin: 0 }}
              >
                Archived
              </label>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>
                (Archive this perk)
              </span>
            </div>
          </div>
        </div>

        {/* Primary Fields - Following exact sequence */}
        {fieldCategories.primary.length > 0 && (
          <div style={formSectionStyle}>
            <h3 style={sectionTitleStyle}>Primary Information</h3>
            <div style={gridStyle}>
              {fieldCategories.primary.map((field) => (
                <div key={field.id} style={fieldStyle}>
                  <label style={labelStyle}>
                    {field.displayName}
                    {field.isRequired && (
                      <span style={{ color: "#ef4444" }}> *</span>
                    )}
                  </label>
                  {renderField(field)}
                  {field.helpText && (
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      {field.helpText}
                    </span>
                  )}
                  {errors[field.slug] && (
                    <div style={errorStyle}>{errors[field.slug]}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date Information */}
        {fieldCategories.dates.length > 0 && (
          <div style={formSectionStyle}>
            <h3 style={sectionTitleStyle}>Date Information</h3>
            <div style={gridStyle}>
              {fieldCategories.dates.map((field) => (
                <div key={field.id} style={fieldStyle}>
                  <label style={labelStyle}>
                    {field.displayName}
                    {field.isRequired && (
                      <span style={{ color: "#ef4444" }}> *</span>
                    )}
                  </label>
                  {renderField(field)}
                  {field.helpText && (
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      {field.helpText}
                    </span>
                  )}
                  {errors[field.slug] && (
                    <div style={errorStyle}>{errors[field.slug]}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References (Offers, Places) */}
        {fieldCategories.references.length > 0 && (
          <div style={formSectionStyle}>
            <h3 style={sectionTitleStyle}>Associated References</h3>
            <div style={gridStyle}>
              {fieldCategories.references.map((field) => (
                <div key={field.id} style={fieldStyle}>
                  <label style={labelStyle}>
                    {field.displayName}
                    {field.isRequired && (
                      <span style={{ color: "#ef4444" }}> *</span>
                    )}
                  </label>
                  {renderField(field)}
                  {field.helpText && (
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      {field.helpText}
                    </span>
                  )}
                  {errors[field.slug] && (
                    <div style={errorStyle}>{errors[field.slug]}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        {fieldCategories.location.length > 0 && (
          <div style={formSectionStyle}>
            <h3 style={sectionTitleStyle}>Location Information</h3>
            <div style={gridStyle}>
              {fieldCategories.location.map((field) => (
                <div key={field.id} style={fieldStyle}>
                  <label style={labelStyle}>
                    {field.displayName}
                    {field.isRequired && (
                      <span style={{ color: "#ef4444" }}> *</span>
                    )}
                  </label>
                  {renderField(field)}
                  {field.helpText && (
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      {field.helpText}
                    </span>
                  )}
                  {errors[field.slug] && (
                    <div style={errorStyle}>{errors[field.slug]}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* General Fields */}
        {fieldCategories.general.length > 0 && (
          <div style={formSectionStyle}>
            <h3 style={sectionTitleStyle}>Perk Detail</h3>
            <div style={gridStyle}>
              {fieldCategories.general.map((field) => (
                <div key={field.id} style={fieldStyle}>
                  <label style={labelStyle}>
                    {field.displayName}
                    {field.isRequired && (
                      <span style={{ color: "#ef4444" }}> *</span>
                    )}
                  </label>
                  {renderField(field)}
                  {field.helpText && (
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      {field.helpText}
                    </span>
                  )}
                  {errors[field.slug] && (
                    <div style={errorStyle}>{errors[field.slug]}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Elite Member Offers */}
        {fieldCategories.elite.length > 0 && (
          <div style={formSectionStyle}>
            <h3 style={sectionTitleStyle}>
              Elite Member Offers (Perk Listings Details)
            </h3>
            <div style={gridStyle}>
              {fieldCategories.elite.map((field) => (
                <div key={field.id} style={fieldStyle}>
                  <label style={labelStyle}>
                    {field.displayName}
                    {field.isRequired && (
                      <span style={{ color: "#ef4444" }}> *</span>
                    )}
                  </label>
                  {renderField(field)}
                  {field.helpText && (
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      {field.helpText}
                    </span>
                  )}
                  {errors[field.slug] && (
                    <div style={errorStyle}>{errors[field.slug]}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Free Member Offers */}
        {fieldCategories.free.length > 0 && (
          <div style={formSectionStyle}>
            <h3 style={sectionTitleStyle}>
              Free Member Offers (Perk Listings Details)
            </h3>
            <div style={gridStyle}>
              {fieldCategories.free.map((field) => (
                <div key={field.id} style={fieldStyle}>
                  <label style={labelStyle}>
                    {field.displayName}
                    {field.isRequired && (
                      <span style={{ color: "#ef4444" }}> *</span>
                    )}
                  </label>
                  {renderField(field)}
                  {field.helpText && (
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      {field.helpText}
                    </span>
                  )}
                  {errors[field.slug] && (
                    <div style={errorStyle}>{errors[field.slug]}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event Information */}
        {fieldCategories.event.length > 0 && (
          <div style={formSectionStyle}>
            <h3 style={sectionTitleStyle}>Event Information</h3>
            <div style={gridStyle}>
              {fieldCategories.event.map((field) => (
                <div key={field.id} style={fieldStyle}>
                  <label style={labelStyle}>
                    {field.displayName}
                    {field.isRequired && (
                      <span style={{ color: "#ef4444" }}> *</span>
                    )}
                  </label>
                  {renderField(field)}
                  {field.helpText && (
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      {field.helpText}
                    </span>
                  )}
                  {errors[field.slug] && (
                    <div style={errorStyle}>{errors[field.slug]}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div style={formSectionStyle}>
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
          >
            <button
              type="button"
              onClick={() => navigate("/")}
              style={secondaryButtonStyle}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...primaryButtonStyle,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading
                ? "Saving..."
                : isEdit
                  ? `Update ${collectionSchema?.singularName}`
                  : `Create ${collectionSchema?.singularName}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PerkForm;
