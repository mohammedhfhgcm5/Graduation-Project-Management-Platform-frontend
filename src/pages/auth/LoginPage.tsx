import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { authService, type LoginPayload } from '@/api/auth.service';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/i18n';
import { getApiErrorMessage } from '@/lib/errors';
import { useAuthStore } from '@/store/zustand/authStore';
import { roleRedirect } from '@/utils/roleRedirect';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { t } = useI18n();
  const { theme } = useTheme();
  const [values, setValues] = useState<LoginPayload>({ email: '', password: '' });
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      navigate(roleRedirect(data.user.role), { replace: true });
    },
    onError: (mutationError) => {
      setError(getApiErrorMessage(mutationError, t('authInvalidCredentials')));
      // Trigger shake animation reset
      setTimeout(() => setError(''), 50);
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    mutation.mutate(values);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary Gradient Orb */}
        <div 
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-20 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(99,102,241,0) 70%)',
            animation: 'float 8s ease-in-out infinite'
          }}
        />
        {/* Secondary Gradient Orb */}
        <div 
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20 dark:opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(139,92,246,0) 70%)',
            animation: 'float 10s ease-in-out infinite reverse'
          }}
        />
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Main Card Container */}
      <div 
        className="relative w-full max-w-md animate-fade-in-up"
        style={{ animation: 'fadeInUp 0.8s ease-out forwards' }}
      >
        {/* Glass Card */}
        <div className="relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl shadow-indigo-500/10 dark:shadow-black/40 p-8 md:p-10 overflow-hidden">
          
          {/* Top Shimmer Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

          {/* Logo / Brand Section */}
          <div className="text-center mb-10 space-y-2">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 mb-4 transform hover:scale-105 transition-transform duration-300"
              style={{ animation: 'fadeInDown 0.6s ease-out 0.2s both' }}
            >
              <svg 
                className="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
            <h1 
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 tracking-tight"
              style={{ animation: 'fadeInDown 0.6s ease-out 0.3s both' }}
            >
              {t('authLoginTitle')}
            </h1>
            <p 
              className="text-sm text-slate-500 dark:text-slate-400 font-medium"
              style={{ animation: 'fadeInDown 0.6s ease-out 0.4s both' }}
            >
              {t('authLoginSubtitle')}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div 
              className="space-y-2 group"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.5s both' }}
            >
              <label 
                className="block text-sm font-semibold text-slate-700 dark:text-slate-200 ml-1 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400"
                htmlFor="login-email"
              >
                {t('authEmail')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg 
                    className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-indigo-500' : 'text-slate-400'}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a6 6 0 10-12 0v12a6 6 0 006 6h6a2 2 0 002-2v-6a2 2 0 00-2-2h-1.5" />
                  </svg>
                </div>
                <Input
                  id="login-email"
                  type="email"
                  surface={theme === 'dark' ? 'dark' : 'light'}
                  value={values.email}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, email: event.target.value }))
                  }
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 w-full"
                  placeholder="name@company.com"
                  required
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 rounded-full ${focusedField === 'email' ? 'w-full' : 'w-0'}`} />
              </div>
            </div>

            {/* Password Field */}
            <div 
              className="space-y-2 group"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.6s both' }}
            >
              <div className="flex items-center justify-between ml-1">
                <label 
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400"
                  htmlFor="login-password"
                >
                  {t('authPassword')}
                </label>
               
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg 
                    className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-indigo-500' : 'text-slate-400'}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  surface={theme === 'dark' ? 'dark' : 'light'}
                  value={values.password}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 w-full"
                  placeholder="••••••••"
                  required
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 rounded-full ${focusedField === 'password' ? 'w-full' : 'w-0'}`} />
              </div>
            </div>

            {/* Error Message with Shake Animation */}
            {error && (
              <div 
                className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm animate-shake"
                style={{ animation: 'shake 0.5s ease-in-out' }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div style={{ animation: 'fadeInUp 0.6s ease-out 0.7s both' }}>
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden relative group"
              >
                {/* Button Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                {mutation.isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>{t('authLoginLoading')}</span>
                  </div>
                ) : (
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {t('authLoginButton')}
                    <svg 
                      className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div 
            className="relative my-8"
            style={{ animation: 'fadeIn 0.6s ease-out 0.8s both' }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
            
            </div>
          </div>


          {/* Footer */}
          <p 
            className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400"
            style={{ animation: 'fadeIn 0.6s ease-out 1s both' }}
          >
            {t('authNoAccount')}{' '}
            <a 
              href="/register" 
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors hover:underline underline-offset-2"
            >
              {t('authNoAccount')}
            </a>
          </p>
        </div>

        {/* Decorative floating dots */}
        <div className="absolute -top-4 -right-4 w-24 h-24 opacity-20 dark:opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-indigo-500 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute top-8 right-12 w-1.5 h-1.5 rounded-full bg-violet-500 animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          <div className="absolute top-16 right-4 w-1 h-1 rounded-full bg-indigo-400 animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        </div>
      </div>

      {/* Global Styles for Custom Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(30px, -30px); }
          66% { transform: translate(-20px, 20px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}