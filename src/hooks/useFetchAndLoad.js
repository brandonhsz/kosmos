import { useState } from 'react';

const UseFetch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const callEndpoint = async (url) => {
        setLoading(true);
        try {
            const response = await fetch(url);
            const jsonData = await response.json();
            return jsonData;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, callEndpoint };
};

export default UseFetch;
