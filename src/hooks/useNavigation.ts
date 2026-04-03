import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Hook de navegación que envuelve react-router-dom.
 * Provee métodos utilitarios para navegar entre vistas.
 */
export function useNavigation() {
  const navigate = useNavigate();

  const goTo = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const goToCampCreate = useCallback(() => {
    navigate('/camp-create');
  }, [navigate]);

  return {
    navigate: goTo,
    goBack,
    goToCampCreate,
  };
}
