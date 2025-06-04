import { config } from "./config";

export const logout = async () => {
    try {
      const res = await fetch(`${config.backend_url}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
  
      if (!res.ok) {
        throw new Error('Failed to logout');
      }
  
      // Optionally: redirect or reset state
      window.location.href = '/signin'; // Or router.push('/login') if using react-router
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  