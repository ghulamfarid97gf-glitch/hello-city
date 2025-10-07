import { useMutation, useQueryClient } from "@tanstack/react-query";
import { webflowApi } from "../webflowApi";
import { webflowKeys } from "../queryKeys";

// Create item
export const useCreateCollectionItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: webflowApi.createCollectionItem,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: webflowKeys.collections(variables.collectionId),
      });
    },
  });
};

// Update item
export const useUpdateCollectionItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: webflowApi.updateCollectionItem,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: webflowKeys.item(variables.collectionId, variables.itemId),
      });
      queryClient.invalidateQueries({
        queryKey: webflowKeys.collections(variables.collectionId),
      });
    },
  });
};

// Delete item
export const useDeleteCollectionItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: webflowApi.deleteCollectionItem,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: webflowKeys.collections(variables.collectionId),
      });
    },
  });
};

// Aliases
export const useCreatePerk = useCreateCollectionItem;
export const useCreatePlace = useCreateCollectionItem;
export const useCreateOffer = useCreateCollectionItem;

export const useUpdatePerk = useUpdateCollectionItem;
export const useUpdatePlace = useUpdateCollectionItem;
export const useUpdateOffer = useUpdateCollectionItem;

export const useDeletePerk = useDeleteCollectionItem;
export const useDeletePlace = useDeleteCollectionItem;
export const useDeleteOffer = useDeleteCollectionItem;
