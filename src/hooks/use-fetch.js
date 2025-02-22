import * as React from "react";
import api from "../lib/axios.js";

const HTTP_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH",
};

const useFetch = ({ endPoint, requestData = null, method = "GET", timeout = 300 }) => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const fetchData = React.useCallback(async (signal) => {
        setLoading(true);
        try {
            let response;
            switch (method) {
                case HTTP_METHODS.GET:
                    response = await api.get(endPoint, { signal });
                    break;
                case HTTP_METHODS.POST:
                    response = await api.post(endPoint, requestData, { signal });
                    break;
                case HTTP_METHODS.PUT:
                    response = await api.put(endPoint, requestData, { signal });
                    break;
                case HTTP_METHODS.DELETE:
                    response = await api.delete(endPoint, { signal });
                    break;
                case HTTP_METHODS.PATCH:
                    response = await api.patch(endPoint, requestData, { signal });
                    break;
                default:
                    throw new Error("Invalid HTTP method");
            }
            setData(response.data);
        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err);
            }
        } finally {
            setLoading(false);
        }
    }, [endPoint, requestData, method]);

    React.useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchWithTimeout = async () => {
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, timeout);

            try {
                await fetchData(signal);
            } finally {
                clearTimeout(timeoutId);
            }
        };

        fetchWithTimeout();

        return () => {
            controller.abort();
        };
    }, [fetchData, timeout]);

    return { data, loading, error };
};

export default useFetch;
