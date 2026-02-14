import { useState, useEffect } from "react";

export default function useFetch(fetchFunction) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetchFunction()
            .then((res) => setData(res))
            .catch((err) => setError(err))
            .finally(() => setLoading(false));
    }, [fetchFunction]);

    return { data, loading, error };
}
