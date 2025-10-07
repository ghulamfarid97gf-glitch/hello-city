import { webflowAPI } from "../api/config.js";

export const webflowApi = {
  // Get collections
  getCollections: async (siteId) => {
    const { data } = await webflowAPI.get(`/collections/${siteId}/items`);
    return data;
  },

  // Get collection fields
  getCollectionFields: async (siteId) => {
    const { data } = await webflowAPI.get(`/collections/${siteId}`);
    return data;
  },

  // Get single item
  getCollectionItem: async ({ collectionId, itemId }) => {
    const { data } = await webflowAPI.get(
      `/collections/${collectionId}/items/${itemId}`
    );
    return data;
  },

  // Create item
  createCollectionItem: async ({ collectionId, itemData }) => {
    const { isArchived = false, isDraft = false, ...fieldData } = itemData;
    const payload = { isArchived, isDraft, fieldData };

    const endpoint = isDraft
      ? `/collections/${collectionId}/items?skipInvalidFiles=true`
      : `/collections/${collectionId}/items/live?skipInvalidFiles=true`;

    const { data } = await webflowAPI.post(endpoint, payload);
    return data;
  },

  // Update item
  updateCollectionItem: async ({ collectionId, itemId, itemData }) => {
    const { isArchived = false, isDraft = false, ...fieldData } = itemData;
    const payload = { isArchived, isDraft, fieldData };

    const endpoint = isDraft
      ? `/collections/${collectionId}/items/${itemId}?skipInvalidFiles=true`
      : `/collections/${collectionId}/items/${itemId}/live?skipInvalidFiles=true`;

    const { data } = await webflowAPI.patch(endpoint, payload);
    return data;
  },

  // Delete item
  deleteCollectionItem: async ({ collectionId, item }) => {
    const endpoint = item.isDraft
      ? `/collections/${collectionId}/items/${item.id}`
      : `/collections/${collectionId}/items/${item.id}/live`;

    const { data } = await webflowAPI.delete(endpoint);
    return data;
  },
};
