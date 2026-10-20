import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

const ToastContext = createContext<((message: string) => void) | null>(null);

/** Small message at the bottom of the screen ("Email copied"). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const [id, setId] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);

  const show = useCallback((text: string) => {
    setMessage(text);
    setId((n) => n + 1);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(''), 2400);
  }, []);
  const value = useMemo(() => show, [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(24px+env(safe-area-inset-bottom,0px))] z-[70] flex justify-center print:hidden">
        {message && (
          <p key={id} className="glass animate-toast m-0 rounded-full bg-bg2/90 px-5 py-3 text-[.92rem] font-medium whitespace-nowrap text-ink shadow-[0_20px_40px_-20px_#000]">
            {message}
          </p>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): (message: string) => void {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
