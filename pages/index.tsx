import { useEffect, useState } from 'react';
import { Home } from '../containers/Home';
import { Login } from '../containers/Login'

export default function Index() {
  const [token, setToken] = useState<string | null>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const at = localStorage.getItem('accessToken');
      setToken(at);
    }
  }, []);

  return token ? <Home setToken={setToken} /> : <Login setToken={setToken} />;
}
