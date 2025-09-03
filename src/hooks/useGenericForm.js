// services/webflow/useGenericForm.js
import { useCreatePerk, useUpdatePerk, usePerk } from "./useWebflow";

export const useGenericForm = (collectionType, collectionId) => {
  // Map collection types to their respective hooks
  const hookMap = {
    perks: {
      useCreate: useCreatePerk,
      useUpdate: useUpdatePerk,
      useItem: usePerk,
    },
    offers: {
      useCreate: useCreateOffer, // You'd need to create these
      useUpdate: useUpdateOffer,
      useItem: useOffer,
    },
    places: {
      useCreate: useCreatePlace,
      useUpdate: useUpdatePlace,
      useItem: usePlace,
    },
  };

  const hooks = hookMap[collectionType];

  return {
    createItem: hooks.useCreate(),
    updateItem: hooks.useUpdate(),
    item: hooks.useItem(),
  };
};
