import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('accessToken');

    if (token) {
      loginWithToken(token)
        .then(() => {
          navigate('/', { replace: true });
        })
        .catch((err) => {
          console.error('OAuth login failed:', err);
          navigate('/login', { replace: true });
        });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate, loginWithToken]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-slate-600 font-medium text-lg">Completing Google Authentication...</p>
    </div>
  );
};

export default OAuthSuccess;
