import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;

    if (response) {
      if (response.status === 401) {
        const errorMessage = response.data?.message || "You must be logged in to access this resource";
        if (!toast.isActive('auth-error')) {
          toast.error(errorMessage, { toastId: 'auth-error', position: 'bottom-right' });
        }
      }

      if (response.status === 403) {
        const errorMessage = response.data?.error || response.data?.message || "You do not have permission to perform this action";
        if (!toast.isActive('perm-error')) {
          toast.error(errorMessage, { toastId: 'perm-error', position: 'bottom-right' });
        }
      }

      if (response.status === 400 && response.data?.error) {
        if (!toast.isActive('bad-request')) {
          toast.error(response.data.error, { toastId: 'bad-request', position: 'bottom-right' });
        }
      }
    }

    throw error;
  }
);

export default api;
