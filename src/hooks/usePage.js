import { useState, useEffect } from 'react';
import api from '../api/axios';

const pageCache = {};

const usePage = (slug) => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    // Check cache first
    if (pageCache[slug]) {
      setPage(pageCache[slug]);
      setLoading(false);
      return;
    }

    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get(`/pages/${slug}`);
        const pageData = data.data?.page;
        pageCache[slug] = pageData;
        setPage(pageData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch page');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  return { page, loading, error };
};

// Utility to clear cache (used after admin updates)
export const clearPageCache = (slug) => {
  if (slug) {
    delete pageCache[slug];
  } else {
    Object.keys(pageCache).forEach((key) => delete pageCache[key]);
  }
};

export default usePage;