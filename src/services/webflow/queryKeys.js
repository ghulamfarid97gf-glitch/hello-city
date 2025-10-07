// Query keys for React Query cache management
export const webflowKeys = {
  all: ["webflow"],

  collections: (siteId) => [...webflowKeys.all, "collections", siteId],

  collectionFields: (siteId) => [...webflowKeys.all, "fields", siteId],

  item: (collectionId, itemId) => [
    ...webflowKeys.all,
    "item",
    collectionId,
    itemId,
  ],

  items: (collectionId) => [...webflowKeys.all, "items", collectionId],
};
