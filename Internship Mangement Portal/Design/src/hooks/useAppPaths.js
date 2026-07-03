import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants';

export function useAppPaths() {
  const { isSuperadmin } = useAuth();
  return isSuperadmin ? ROUTES.SUPERADMIN : ROUTES.STUDENT;
}
