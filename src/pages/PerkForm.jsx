import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useCreatePerk,
  useUpdatePerk,
  usePerk,
} from "../services/webflow/useWebflow";
import { toast } from "react-toastify";

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

  // Dynamic form state
  const [collectionSchema, setCollectionSchema] = useState(null);
  const [formData, setFormData] = useState({
    isArchived: false,
    isDraft: false,
  });
  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [schemaLoading, setSchemaLoading] = useState(true);

  // Fetch collection schema - replace this with your actual API call
  const fetchCollectionSchema = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/collections/${COLLECTIONS.PERKS}`);
      // const schema = await response.json();

      // Using your provided schema structure for now
      const schema = {
        id: "689046505062d22cb6485ac6",
        displayName: "Perks",
        singularName: "Perk",
        slug: "perk",
        fields: [
          {
            id: "05618c3d0bec3c9e39ff940c8a8ad321",
            isEditable: true,
            isRequired: true,
            type: "PlainText",
            slug: "name",
            displayName: "Name",
            helpText: null,
            validations: { maxLength: 256 },
          },
          {
            id: "ff62292418ac2d3bd91bbbbcdd8d6636",
            isEditable: true,
            isRequired: true,
            type: "PlainText",
            slug: "slug",
            displayName: "Slug",
            helpText: null,
            validations: {
              maxLength: 256,
              pattern: {},
              messages: {
                pattern:
                  "Must be alphanumerical and not contain any spaces or special characters",
                maxLength: "Must be less than 256 characters",
              },
            },
          },
          {
            id: "745a3a9bd868ad1ee46e7178af885466",
            isEditable: true,
            isRequired: false,
            type: "PlainText",
            slug: "perk-title",
            displayName: "Perk Title",
            helpText: null,
            validations: { singleLine: true },
          },
          {
            id: "6df8c3a1af2780dd959babf8cd7ed52f",
            isEditable: true,
            isRequired: false,
            type: "PlainText",
            slug: "perk-name",
            displayName: "Perk Name",
            helpText: null,
            validations: { singleLine: true },
          },
          {
            id: "7ac0ec383999dd445e284e51429fa55a",
            isEditable: true,
            isRequired: false,
            type: "Option",
            slug: "type-of-perk",
            displayName: "Type of Perk",
            helpText: null,
            validations: {
              options: [
                { name: "Claim", id: "b0ac85c271b92524d61bfb0dd35d4c6a" },
                { name: "Become Paid", id: "942b17dad8608b54fc4a52dbc692f52f" },
                { name: "Purchase", id: "0968c9a6688452c2c36519d2db2cacba" },
                { name: "Become Free", id: "04616dc1dfe624c55f8ef7b282869ee1" },
                { name: "Raffle", id: "1a6609341ed240ac26cca3deae2e4813" },
              ],
            },
          },
          {
            id: "d645691345e124726317197966fcb25f",
            isEditable: true,
            isRequired: false,
            type: "PlainText",
            slug: "member-role",
            displayName: "Member Role",
            helpText: null,
            validations: { singleLine: true },
          },
          {
            id: "30b9752e5315cf1086b9a606943d86ed",
            isEditable: true,
            isRequired: false,
            type: "PlainText",
            slug: "perks-short-description",
            displayName: "Perks Short Description",
            helpText: null,
            validations: { singleLine: false },
          },
          {
            id: "975ec92ffeec6a3462178562c72605d7",
            isEditable: true,
            isRequired: false,
            type: "PlainText",
            slug: "small-description",
            displayName: "Small Description",
            helpText: null,
            validations: { singleLine: true },
          },
          {
            id: "c58191f2171bee4b7ddce2f0ab8554fb",
            isEditable: true,
            isRequired: false,
            type: "RichText",
            slug: "description",
            displayName: "Event Description",
            helpText: "About the event",
            validations: null,
          },
          {
            id: "5ab38fdefa6aa8b7535ca2bbb69d3f22",
            isEditable: true,
            isRequired: false,
            type: "PlainText",
            slug: "location",
            displayName: "Location / Venue / Place name",
            helpText: null,
            validations: { singleLine: true },
          },
          {
            id: "cbd8d39cc5b017393985444800d819fb",
            isEditable: true,
            isRequired: false,
            type: "PlainText",
            slug: "location-address",
            displayName: "Location Address",
            helpText: null,
            validations: { singleLine: true },
          },
          {
            id: "9158023d89848aff30a59a5d836182e9",
            isEditable: true,
            isRequired: false,
            type: "PlainText",
            slug: "point-to-place",
            displayName: "Point to Place",
            helpText: null,
            validations: { singleLine: true },
          },
          {
            id: "f46a8934b53adea4253c7c8b0bcee58d",
            isEditable: true,
            isRequired: false,
            type: "PlainText",
            slug: "event-name",
            displayName: "Event Name",
            helpText: null,
            validations: { singleLine: true },
          },
          {
            id: "d7a5c795d616e97c43e59bfe4e8f54b0",
            isEditable: true,
            isRequired: false,
            type: "PlainText",
            slug: "time",
            displayName: "Time",
            helpText: null,
            validations: { singleLine: true },
          },
          {
            id: "70e4361519b31b939ece0b7d410c3d91",
            isEditable: true,
            isRequired: false,
            type: "Number",
            slug: "original-price",
            displayName: "Original Price",
            helpText: null,
            validations: {
              format: "integer",
              precision: 1,
              allowNegative: false,
            },
          },
          {
            id: "3c699f8fc67fbf82d91c54f166347a50",
            isEditable: true,
            isRequired: false,
            type: "Number",
            slug: "how-much-you-save",
            displayName: "How much you save",
            helpText: null,
            validations: {
              precision: 1,
              allowNegative: true,
            },
          },
          {
            id: "17645ea5d925edce4b652ffa129370be",
            isEditable: true,
            isRequired: false,
            type: "Number",
            slug: "how-much-you-would-pay-at-the-place",
            displayName: "How much you would pay at the place",
            helpText: null,
            validations: {
              precision: 1,
              allowNegative: true,
            },
          },
          {
            id: "64bd14d1cd23c9a28620b42a67fd8569",
            isEditable: true,
            isRequired: false,
            type: "Number",
            slug: "percent-off-this-deal-gives-you",
            displayName: "Percent off this deal gives you",
            helpText: null,
            validations: {
              precision: 1,
              allowNegative: true,
            },
          },
          {
            id: "b352f1007a92d6772b1316f70fc6365b",
            isEditable: true,
            isRequired: false,
            type: "Number",
            slug: "price-you-pay-hellocity-to-get-it",
            displayName: "Price you pay HelloCity to get it",
            helpText: null,
            validations: {
              precision: 1,
              allowNegative: true,
            },
          },
          {
            id: "7ea576e124b83ea54fb77580b115f17f",
            isEditable: true,
            isRequired: false,
            type: "PlainText",
            slug: "plan-wise-coupen",
            displayName: "Plan Wise Coupen",
            helpText: null,
            validations: { singleLine: true },
          },
          {
            id: "3f259535884f1aec8c775faad057ac5e",
            isEditable: true,
            isRequired: false,
            type: "DateTime",
            slug: "start-date",
            displayName: "Start Date",
            helpText: null,
            validations: null,
          },
          {
            id: "2d135cc17d5c489c46caf7b852087cb8",
            isEditable: true,
            isRequired: false,
            type: "DateTime",
            slug: "end-date",
            displayName: "End Date",
            helpText: null,
            validations: null,
          },
          {
            id: "b4eabf352ee1b8b2a6cc3bdec92fc3f5",
            isEditable: true,
            isRequired: false,
            type: "Link",
            slug: "ticket-link",
            displayName: "Booking Link",
            helpText: null,
            validations: null,
          },
          {
            id: "00c220ac4edb556cef675cccc8435ffd",
            isEditable: true,
            isRequired: false,
            type: "Link",
            slug: "location-link",
            displayName: "Location Link",
            helpText: null,
            validations: null,
          },
          {
            id: "7eb3080e17cb88a5cad53b7bac65620c",
            isEditable: true,
            isRequired: false,
            type: "Link",
            slug: "event-link",
            displayName: "Event Link",
            helpText: null,
            validations: null,
          },
          {
            id: "f72aa631661628a747fdea79c8c15cea",
            isEditable: true,
            isRequired: false,
            type: "VideoLink",
            slug: "video-link",
            displayName: "Video Link",
            helpText: null,
            validations: null,
          },
          {
            id: "29add84f6f59b124a2bf01b906d10f87",
            isEditable: true,
            isRequired: false,
            type: "Image",
            slug: "thumbnail-image",
            displayName: "Thumbnail Image",
            helpText: null,
            validations: null,
          },
        ],
      };

      return schema;
    } catch (error) {
      console.error("Error fetching collection schema:", error);
      throw error;
    }
  };

  // Load collection schema on mount
  useEffect(() => {
    const loadCollectionSchema = async () => {
      try {
        const schema = await fetchCollectionSchema();
        setCollectionSchema(schema);

        // Initialize form data with default values based on schema
        const initialFormData = {
          isArchived: false,
          isDraft: false,
        };

        schema.fields.forEach((field) => {
          let defaultValue;

          switch (field.type) {
            case "Number":
              defaultValue = 0;
              break;
            case "DateTime":
              defaultValue = "";
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

    loadCollectionSchema();
  }, []);

  // Load perk data for edit mode
  useEffect(() => {
    if (perk && isEdit && collectionSchema) {
      const processedFieldData = { ...perk.fieldData };

      // Process complex field types for edit mode
      collectionSchema.fields.forEach((field) => {
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
  }, [perk, isEdit, collectionSchema]);

  // Dynamic validation based on schema
  const validateForm = () => {
    if (!collectionSchema) return false;

    const newErrors = {};

    collectionSchema.fields.forEach((field) => {
      const value = formData[field.slug];

      // Required field validation
      if (
        field.isRequired &&
        (!value || (typeof value === "string" && value.trim() === ""))
      ) {
        newErrors[field.slug] = `${field.displayName} is required`;
        return;
      }

      // Skip further validation if field is empty and not required
      if (!value || (typeof value === "string" && value.trim() === "")) {
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
        collectionSchema.fields.forEach((field) => {
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

  // Group fields by categories for better organization
  const getFieldsByCategory = () => {
    if (!collectionSchema) return {};

    const categories = {
      basic: [],
      descriptions: [],
      location: [],
      pricing: [],
      dates: [],
      links: [],
      media: [],
      other: [],
    };

    collectionSchema.fields.forEach((field) => {
      const slug = field.slug.toLowerCase();

      if (
        [
          "name",
          "perk-name",
          "perk-title",
          "slug",
          "type-of-perk",
          "member-role",
        ].includes(slug)
      ) {
        categories.basic.push(field);
      } else if (slug.includes("description")) {
        categories.descriptions.push(field);
      } else if (
        slug.includes("location") ||
        slug.includes("place") ||
        slug === "time" ||
        slug === "event-name"
      ) {
        categories.location.push(field);
      } else if (
        slug.includes("price") ||
        slug.includes("save") ||
        slug.includes("pay") ||
        slug.includes("percent") ||
        slug.includes("coupen")
      ) {
        categories.pricing.push(field);
      } else if (slug.includes("date")) {
        categories.dates.push(field);
      } else if (slug.includes("link")) {
        categories.links.push(field);
      } else if (field.type === "Image" || field.type === "VideoLink") {
        categories.media.push(field);
      } else {
        categories.other.push(field);
      }
    });

    return categories;
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

  // Styles
  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  };

  const formSectionStyle = {
    backgroundColor: "#ffffff",
    padding: "24px",
    marginBottom: "24px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  };

  const sectionTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "16px",
    paddingBottom: "8px",
    borderBottom: "2px solid #e5e7eb",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
  };

  const buttonStyle = {
    padding: "12px 24px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.2s",
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#2563eb",
    color: "#ffffff",
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#6b7280",
    color: "#ffffff",
  };

  const errorStyle = {
    color: "#ef4444",
    fontSize: "12px",
    marginTop: "2px",
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

  const fieldCategories = getFieldsByCategory();

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
              ? `Edit ${collectionSchema.singularName}`
              : `Add New ${collectionSchema.singularName}`}
          </h2>
        </div>
        <p style={{ color: "#6b7280", fontSize: "16px" }}>
          {isEdit
            ? `Update ${collectionSchema.singularName.toLowerCase()} information`
            : `Create a new ${collectionSchema.singularName.toLowerCase()} for your collection`}
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

        {/* Dynamic Form Sections */}
        {/* Basic Information */}
        {fieldCategories.basic.length > 0 && (
          <div style={formSectionStyle}>
            <h3 style={sectionTitleStyle}>Basic Information</h3>
            <div style={gridStyle}>
              {fieldCategories.basic.map((field) => (
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

        {/* Descriptions */}
        {fieldCategories.descriptions.length > 0 && (
          <div style={formSectionStyle}>
            <h3 style={sectionTitleStyle}>Descriptions</h3>
            <div style={gridStyle}>
              {fieldCategories.descriptions.map((field) => (
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

        {/* Location & Event */}
        {fieldCategories.location.length > 0 && (
          <div style={formSectionStyle}>
            <h3 style={sectionTitleStyle}>Location & Event Information</h3>
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

        {/* Pricing Information */}
        {fieldCategories.pricing.length > 0 && (
          <div style={formSectionStyle}>
            <h3 style={sectionTitleStyle}>Pricing Information</h3>
            <div style={gridStyle}>
              {fieldCategories.pricing.map((field) => (
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

        {/* Links */}
        {fieldCategories.links.length > 0 && (
          <div style={formSectionStyle}>
            <h3 style={sectionTitleStyle}>Links</h3>
            <div style={gridStyle}>
              {fieldCategories.links.map((field) => (
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

        {/* Media */}
        {fieldCategories.media.length > 0 && (
          <div style={formSectionStyle}>
            <h3 style={sectionTitleStyle}>Media</h3>
            <div style={gridStyle}>
              {fieldCategories.media.map((field) => (
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

        {/* Other Fields */}
        {fieldCategories.other.length > 0 && (
          <div style={formSectionStyle}>
            <h3 style={sectionTitleStyle}>Additional Information</h3>
            <div style={gridStyle}>
              {fieldCategories.other.map((field) => (
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
                  ? `Update ${collectionSchema.singularName}`
                  : `Create ${collectionSchema.singularName}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PerkForm;
