import { useQuery } from "@tanstack/react-query";
import { webflowApi } from "../webflowApi";
import { webflowKeys } from "../queryKeys";

// Fetch collections
export const useCollections = (collectionId) => {
  return useQuery({
    queryKey: webflowKeys.collections(collectionId),
    queryFn: () => webflowApi.getCollections(collectionId),
    enabled: !!collectionId,
  });
};

// Fetch collection fields
export const useCollectionFields = (siteId) => {
  return useQuery({
    queryKey: webflowKeys.collectionFields(siteId),
    queryFn: () => webflowApi.getCollectionFields(siteId),
    enabled: !!siteId,
  });
};

// Fetch single item (perk, place, offer)
export const useCollectionItem = (collectionId, itemId) => {
  return useQuery({
    queryKey: webflowKeys.item(collectionId, itemId),
    queryFn: () => webflowApi.getCollectionItem({ collectionId, itemId }),
    enabled: !!collectionId && !!itemId,
  });
};

// Aliases
export const usePerk = useCollectionItem;
export const usePlace = useCollectionItem;
export const useOffer = useCollectionItem;
