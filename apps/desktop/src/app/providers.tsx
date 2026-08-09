import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSessionStore } from '@/stores/session.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Hammer, KeyRound } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLocked, unlock } = useSessionStore();
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await window.api.auth.verifyPin(pinInput);
      if (res.success) {
        unlock();
        setPinInput('');
        setErrorMsg('');
      } else {
        setErrorMsg(res.message || 'Hatalı PIN kodu.');
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      {isLocked ? (
        <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-100 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Lock className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">Uygulama Kilitli</h2>
              <p className="text-xs text-slate-400 mt-1">Devam etmek için PIN kodunuzu girin.</p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="relative">
                <Input
                  type="password"
                  maxLength={8}
                  placeholder="PIN Kodu"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="text-center font-mono text-lg tracking-widest bg-slate-950 border-slate-700 pl-8"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>

              {errorMsg && <p className="text-xs text-rose-400 font-semibold">{errorMsg}</p>}

              <Button type="submit" variant="default" className="w-full font-semibold">
                Kilidi Aç
              </Button>
            </form>
          </div>
        </div>
      ) : (
        children
      )}
    </QueryClientProvider>
  );
};
