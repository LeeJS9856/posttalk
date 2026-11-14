import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

/** 로그인하지 않았으면 어떤 주소로 들어와도 로그인 화면으로 돌려보낸다. */
const RequireAuth = (): React.JSX.Element => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default RequireAuth;
