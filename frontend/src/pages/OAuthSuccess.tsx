import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAccessToken } from '../utils/api';
import { Loader2 } from 'lucide-react';

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('accessToken');

    if (token) {
      setAccessToken(token);
      // Redirect home and perform a reload to boot the AuthContext with the active access token
      navigate('/', { replace: true });
      window.location.reload();
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-slate-600 font-medium text-lg">Completing Google Authentication...</p>
    </div>
  );
};

export default OAuthSuccess;
