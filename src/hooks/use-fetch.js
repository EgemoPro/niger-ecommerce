import { useState, useRef, useCallback } from "react";
import api from "../lib/axios";

const usePaginatedFetch = ({
  method = "get",
  url,
  initialPage = 1,
  limit = 10,
  body = null,
  config = {},
}) => {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const controllerRef = useRef(null);

  const fetchData = useCallback(
    async (customPage = page) => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const controller = new AbortController();
      controllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const queryConfig = {
          ...config,
          params: {
            ...(config.params || {}),
            page: customPage,
            limit,
          },
          signal: controller.signal,
        };

        const payload = body;
        let response;

        switch (method.toLowerCase()) {
          case "get":
            response = await api.get(url, queryConfig);
            break;
          case "post":
            response = await api.post(url, payload, queryConfig);
            break;
          case "put":
            response = await api.put(url, payload, queryConfig);
            break;
          case "patch":
            response = await api.patch(url, payload, queryConfig);
            break;
          case "delete":
            response = await api.delete(url, queryConfig);
            break;
          default:
            throw new Error(`Méthode HTTP non supportée : ${method}`);
        }

        setData(response.data);
        setPage(customPage);
        return response.data;
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError(err);
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, method, config, page, limit, body]
  );

  const nextPage = () => fetchData(page + 1);
  const prevPage = () => fetchData(Math.max(1, page - 1));
  const goToPage = (n) => fetchData(Math.max(1, n));
  const refetch = () => fetchData(page);

  return {
    data,
    error,
    loading,
    page,
    nextPage,
    prevPage,
    goToPage,
    refetch,
  };
};

export default usePaginatedFetch;
