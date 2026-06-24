import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const push = useCallback((text, type = 'success') => {
    const id = Date.now() + Math.random();
    setMessages(m => [...m, { id, text, type }]);
    setTimeout(() => setMessages(m => m.filter(x => x.id !== id)), 4000);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const msg = e?.detail?.message || 'API error';
      push(msg, 'error');
    };
    window.addEventListener('api-error', handler);
    return () => window.removeEventListener('api-error', handler);
  }, [push]);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <Toast messages={messages} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
