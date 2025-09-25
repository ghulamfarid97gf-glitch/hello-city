// Webflow API service
import { webflowAPI } from "../api/config.js";

class WebflowService {
  // Generic API call method with error handling
  async makeRequest(endpoint, options = {}) {
    try {
      const response = await webflowAPI({
        url: endpoint,
        method: "GET",
        ...options,
        validateStatus: () => true, // prevent axios auto errors
      });

      console.log("response ", response);

      // If no content (204), don't try to read JSON
      if (response.status === 204) {
        console.log("inside status 204");
        return {
          data: null,
          success: true,
          error: null,
        };
      }

      return {
        data: response.data,
        success: true,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        success: false,
        error: {
          message: error.response?.data?.message || error.message,
          status: error.response?.status,
          code: error.response?.data?.code,
        },
      };
    }
  }

  // Get all collections for a site (siteId passed as argument)
  async getCollections(siteId) {
    if (!siteId) {
      return {
        data: null,
        success: false,
        error: { message: "Site ID is required" },
      };
    }
    return this.makeRequest(`/collections/${siteId}/items`);
  }

  // Get all collections for a site (siteId passed as argument)
  async getCollectionFields(siteId) {
    if (!siteId) {
      return {
        data: null,
        success: false,
        error: { message: "Site ID is required" },
      };
    }
    return this.makeRequest(`/collections/${siteId}`);
  }

  // Create new collection item (perk)
  async createCollectionItem(collectionId, itemData) {
    if (!collectionId) {
      return {
        data: null,
        success: false,
        error: { message: "Collection ID is required" },
      };
    }

    // Separate top-level fields from fieldData
    const { isArchived, isDraft, ...fieldData } = itemData;

    const payload = {
      isArchived: isArchived || false,
      isDraft: isDraft || false,
      fieldData: fieldData,
    };

    if (payload.isDraft) {
      return this.makeRequest(
        `/collections/${collectionId}/items?skipInvalidFiles=true`,
        {
          method: "POST",
          data: payload,
        }
      );
    } else {
      return this.makeRequest(
        `/collections/${collectionId}/items/live?skipInvalidFiles=true `,
        {
          method: "POST",
          data: payload,
        }
      );
    }
  }

  // Update existing collection item - PATCH method as per your curl example
  async updateCollectionItem(collectionId, itemId, itemData) {
    if (!collectionId || !itemId) {
      return {
        data: null,
        success: false,
        error: { message: "Collection ID and Item ID are required" },
      };
    }

    // Separate top-level fields from fieldData
    const { isArchived, isDraft, ...fieldData } = itemData;

    const payload = {
      isArchived: isArchived || false,
      isDraft: isDraft || false,
      fieldData: fieldData,
    };

    if (payload.isDraft) {
      return this.makeRequest(
        `/collections/${collectionId}/items/${itemId}?skipInvalidFiles=true`,
        {
          method: "PATCH",
          data: payload,
        }
      );
    } else {
      return this.makeRequest(
        `/collections/${collectionId}/items/${itemId}/live?skipInvalidFiles=true`,
        {
          method: "PATCH",
          data: payload,
        }
      );
    }
  }

  // Get single collection item
  async getCollectionItem(collectionId, itemId) {
    if (!collectionId || !itemId) {
      return {
        data: null,
        success: false,
        error: { message: "Collection ID and Item ID are required" },
      };
    }

    return this.makeRequest(`/collections/${collectionId}/items/${itemId}`);
  }

  // Delete collection item - DELETE method as per your curl example
  async deleteCollectionItem(collectionId, item) {
    if (!collectionId || !item) {
      return {
        data: null,
        success: false,
        error: { message: "Collection ID and Item ID are required" },
      };
    }

    if (item?.id && item?.isDraft) {
      return this.makeRequest(
        `/collections/${collectionId}/items/${item?.id}`,
        {
          method: "DELETE",
        }
      );
    } else {
      return this.makeRequest(
        `/collections/${collectionId}/items/${item?.id}/live`,
        {
          method: "DELETE",
        }
      );
    }
  }

  // Batch operations (if needed in the future)
  async batchUpdateItems(collectionId, items) {
    if (!collectionId || !items || !Array.isArray(items)) {
      return {
        data: null,
        success: false,
        error: { message: "Collection ID and items array are required" },
      };
    }

    // Process items in batches to avoid rate limits
    const batchSize = 10;
    const results = [];

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchPromises = batch.map((item) =>
        this.updateCollectionItem(collectionId, item.id, item.data)
      );

      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults);
    }

    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value.success
    );
    const failed = results.filter(
      (r) => r.status === "rejected" || !r.value.success
    );

    return {
      data: {
        successful: successful.length,
        failed: failed.length,
        results: results,
      },
      success: failed.length === 0,
      error:
        failed.length > 0
          ? {
              message: `${failed.length} operations failed out of ${items.length}`,
            }
          : null,
    };
  }

  // Publish collection items (if needed)
  async publishCollectionItem(collectionId, itemId) {
    if (!collectionId || !itemId) {
      return {
        data: null,
        success: false,
        error: { message: "Collection ID and Item ID are required" },
      };
    }

    // First get the item to preserve its data
    const itemResult = await this.getCollectionItem(collectionId, itemId);
    if (!itemResult.success) {
      return itemResult;
    }

    // Update with isDraft: false to publish
    const itemData = {
      ...itemResult.data.fieldData,
      isArchived: itemResult.data.isArchived,
      isDraft: false, // Set to published
    };

    return this.updateCollectionItem(collectionId, itemId, itemData);
  }

  // Archive collection item (if needed)
  async archiveCollectionItem(collectionId, itemId) {
    if (!collectionId || !itemId) {
      return {
        data: null,
        success: false,
        error: { message: "Collection ID and Item ID are required" },
      };
    }

    // First get the item to preserve its data
    const itemResult = await this.getCollectionItem(collectionId, itemId);
    if (!itemResult.success) {
      return itemResult;
    }

    // Update with isArchived: true
    const itemData = {
      ...itemResult.data.fieldData,
      isArchived: true,
      isDraft: itemResult.data.isDraft,
    };

    return this.updateCollectionItem(collectionId, itemId, itemData);
  }
}

// Create singleton instance
const webflowService = new WebflowService();
export default webflowService;
