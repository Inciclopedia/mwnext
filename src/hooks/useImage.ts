import { useEffect, useState } from 'react';

const useImage = (fileName: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await import(
          `../themes/${process.env.REACT_APP_FLAVOR}/img/${fileName}`
        );
        setImage(response.default);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage().then();
  }, [fileName]);

  return {
    loading,
    error,
    image,
  };
};

export default useImage;
