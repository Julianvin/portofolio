import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to update the document title based on the current route or specific content.
 * @param {string} title - The title to set for the document.
 */
const useDocumentTitle = (title) => {
  const location = useLocation();

  useEffect(() => {
    document.title = title;
  }, [title, location]);
};

export default useDocumentTitle;
