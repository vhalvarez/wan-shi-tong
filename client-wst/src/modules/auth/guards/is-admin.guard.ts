import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { AuthStatus } from '../interfaces';

const isAdminGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
    const authStore = useAuthStore();

    await authStore.checkAuthStatus();
  
    authStore.authStatus === AuthStatus.unAuthenticated ? next({ name: 'home' }) : next();
};

export default isAdminGuard;