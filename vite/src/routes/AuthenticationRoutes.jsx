import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login routing
const AuthLogin = Loadable(lazy(() => import('views/pages/auth-forms/AuthLogin')));
const AuthRegister = Loadable(lazy(() => import('views/pages/auth-forms/AuthRegister')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/login',
      element: <AuthLogin />
    },
    {
      path: '/register',
      element: <AuthRegister />
    }
  ]
};

export default AuthenticationRoutes;