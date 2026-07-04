import { Navigate } from 'react-router-dom';
import { ROUTES } from '../constants';

export default function ForgotPassword() {
  return <Navigate to={ROUTES.STUDENT.LOGIN} replace />;
}
