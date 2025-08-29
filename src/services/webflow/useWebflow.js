// Custom hooks for Webflow API integration
import { useState, useEffect, useCallback } from "react";
import webflowService from "./webflowService";
// import webflowService from "../services/webflow/webflowService.js";

// Generic hook for API calls with loading and error states
export const useApiCall = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);

      if (result.success) {
        setData(result.data);
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorObj = {
        message: err.message,
        status: err.status || 500,
      };
      setError(errorObj);
      return { success: false, error: errorObj };
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return { data, loading, error, execute };
};

// Hook for fetching collections (siteId as parameter)
export const useCollections = (siteId, autoFetch = true) => {
  const { data, loading, error, execute } = useApiCall(
    webflowService.getCollections.bind(webflowService),
    [siteId]
  );

  const fetchCollections = useCallback(() => {
    if (siteId) {
      execute(siteId);
    }
  }, [execute, siteId]);

  useEffect(() => {
    if (autoFetch && siteId) {
      fetchCollections();
    }
  }, [fetchCollections, autoFetch, siteId]);
  return {
    collections: data?.items || [],
    loading,
    error,
    refetch: fetchCollections,
  };
};

// Hook for creating a perk
export const useCreatePerk = () => {
  const { data, loading, error, execute } = useApiCall(
    webflowService.createCollectionItem.bind(webflowService)
  );

  const createPerk = useCallback(
    (collectionId, perkData) => {
      return execute(collectionId, perkData);
    },
    [execute]
  );

  return {
    createPerk,
    data,
    loading,
    error,
  };
};

// Hook for updating a perk
export const useUpdatePerk = () => {
  const { data, loading, error, execute } = useApiCall(
    webflowService.updateCollectionItem.bind(webflowService)
  );

  const updatePerk = useCallback(
    (collectionId, perkId, perkData) => {
      return execute(collectionId, perkId, perkData);
    },
    [execute]
  );

  return {
    updatePerk,
    data,
    loading,
    error,
  };
};

// Hook for getting a single perk (for edit mode)
export const usePerk = (collectionId, perkId, autoFetch = true) => {
  const { data, loading, error, execute } = useApiCall(
    webflowService.getCollectionItem.bind(webflowService),
    [collectionId, perkId]
  );

  const fetchPerk = useCallback(() => {
    if (collectionId && perkId) {
      execute(collectionId, perkId);
    }
  }, [execute, collectionId, perkId]);

  useEffect(() => {
    if (autoFetch && collectionId && perkId) {
      fetchPerk();
    }
  }, [fetchPerk, autoFetch, collectionId, perkId]);

  return {
    perk: data,
    loading,
    error,
    refetch: fetchPerk,
  };
};
