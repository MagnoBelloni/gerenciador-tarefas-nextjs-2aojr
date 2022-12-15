import { useEffect, useState } from 'react';
import { Home } from '../containers/Home';
import { Login } from '../containers/Login'
import { Register } from '../containers/Register';

export default function Index() {
  const [token, setToken] = useState<string | null>('');
  const [register, setRegister] = useState<Boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const at = localStorage.getItem('accessToken');
      setToken(at);
    }
  }, []);

  return token ? <Home setToken={setToken} /> : register ? <Register setRegister={setRegister} /> : <Login setToken={setToken} setRegister={setRegister} />;
}
