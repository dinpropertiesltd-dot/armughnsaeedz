
import React, { useState, useRef } from 'react';
import { authProvider, normalizeCNIC } from '../supabase';
import { 
  Lock, 
  Mail, 
  ShieldAlert, 
  ArrowRight, 
  User as UserIcon, 
  Phone, 
  CheckCircle, 
  ShieldCheck, 
  Fingerprint, 
  Database, 
  Loader2, 
  HelpCircle,
  AlertTriangle,
  KeyRound,
  ShieldEllipsis,
  RefreshCw,
  ArrowLeft,
  Contact2,
  Eye,
  EyeOff
} from 'lucide-react';

const Logo = () => (
  <svg viewBox="0 0 300 120" className="w-full h-auto max-w-[160px]" xmlns="http://www.w3.org/2000/svg">
    <path fill="#6e6f72" d="M3.81,83.07c.44-1.57.68-3.15,1.25-4.69,5.64-15.3,24.1-15.79,36.44-22.4l5.16-3.01-.6,3.09c-1.54.92-3.04,1.93-4.61,2.78-12.11,6.59-31.14,7.31-36.2,22.64-.36,1.08-.92,2.75-.57,3.82-.12.57-.3,1.14-.34,1.72-.33-.12-.1-1.42-.52-1.72v-2.24Z"/>
    <polygon fill="#6e6f72" points="18.61 62.61 18.61 12.56 28.4 18.85 28.84 19.27 28.91 58.71 18.61 62.61"/>
    <path fill="#0c0b0b" d="M256.92,68.45c-.06,1.49.79,3.01,1.4,4.36,2.31,5.06,5.63,10.96,8.49,15.76.11.19.18.47.43.51.03-6.89.09-13.78-.51-20.64h5.85c-.43,2.37-.27,4.75-.34,7.14-.21,6.9-.32,13.9,0,20.8.04.94.28,2.05.34,3.01h-6.02c-.36-1.54-1.25-3.06-1.98-4.48-2.93-5.67-6.23-11.16-9.12-16.85-.08,7.1-.33,14.25.26,21.33h-5.85c.08-.84.3-1.84.34-2.67.35-7.35.25-14.83,0-22.18-.07-2.04.1-4.09-.34-6.11h7.05Z"/>
    <path fill="#0c0b0b" d="M95,68.45c.13,1.1.47,1.98.88,2.99.84,2.02,2.13,4.33,3.16,6.31,1.96,3.78,4.15,7.45,6.2,11.18.39.07.23-.17.26-.43.28-3.26-.09-6.72-.18-9.97s.09-6.74-.51-10.07h6.02c-.45,1.61-.27,3.26-.34,4.91-.29,7.01-.29,14.13,0,21.14.07,1.64-.11,3.3.34,4.91h-6.02l-11.1-21.15c-.39-.07-.23.17-.26.43-.31,3.71.1,7.65.18,11.35.06,3.13-.2,6.28.34,9.38h-5.85c.45-3.11.27-6.25.34-9.38.13-5.85.22-11.68.01-17.54-.05-1.29-.29-2.73-.35-4.03h6.88Z"/>
    <path fill="#0aa98f" d="M4.32,87.03c.04-.58.23-1.15.34-1.72,3.52-17.37,24.06-18.15,36.83-25.02,1.32-.71,2.59-1.53,3.87-2.32.12-.04.11.13.09.26-.3,1.98-2.24,5.93-3.3,7.71-5.53,9.21-14.94,13.33-24.66,16.8-3.8,1.36-8.51,3.15-12.34,4.18-.27.07-.54.15-.83.12Z"/>
    <path fill="#0c0b0b" d="M176.91,99.41l.35-4.21c.14-5.46.09-10.9-.01-16.34-.07-3.48.11-6.96-.34-10.41,3.83.15,7.81-.19,11.62,0,5.29.26,10.21,1.66,11.21,7.54s-1.96,9.41-7.35,10.61l8.95,12.81h-7.92c-.16-1.59-.97-3.02-1.69-4.42-.5-.97-4.79-8.31-5.28-8.31h-3.87c0,4.25-.04,8.52.52,12.73h-6.19ZM182.59,83.07h6.97c.85,0,2.9-.84,3.53-1.46,1.88-1.82,1.79-5.82-.36-7.39-.52-.38-2.41-1.13-3-1.13h-6.97l-.17,9.97Z"/>
    <path fill="#0c0b0b" d="M202.72,99.41c.16-1.86.11-3.73.17-5.6.01-.45.18-.87.19-1.36.19-8-.02-16.03-.35-24,6.81.37,15.72-1.82,19.93,5.11,3.18,5.23,3.37,15,.24,20.29-4.32,7.28-13.01,5.27-20.16,5.56ZM208.4,94.77h4.73c7.48,0,7.5-13.28,5.23-17.95-.76-1.57-2.88-3.55-4.71-3.55h-5.25v21.5Z"/>
    <path fill="#0c0b0b" d="M53.88,99.41c.09-.89.3-1.96.34-2.84.33-7.13.22-14.36,0-21.49-.07-2.22.1-4.44-.34-6.63,7.19.37,16.1-1.92,20.33,5.56,2.88,5.08,2.98,14.37.17,19.49-4.21,7.67-13.19,5.63-20.5,5.9ZM59.73,94.77h4.56c7.61,0,7.71-13.12,5.37-17.92-.77-1.58-2.83-3.58-4.68-3.58h-5.25v21.5Z"/>
    <path fill="#0aa98f" d="M44.07,105.43c-4.6,1.67-9.06,2.57-13.94,1.64-8.71-1.66-15.07-8.8-21.5-14.28-1.25-1.07-3.02-2.18-4.13-3.26-.18-.18-.4-.3-.34-.6,4.34-1.7,8.64-2.59,13.28-1.67,8.12,1.6,14.37,8.73,20.53,13.7,1.97,1.59,4.02,3.05,6.1,4.47Z"/>
    <path fill="#0c0b0b" d="M148.35,99.41c3-9.01,6.47-17.92,8.93-27.1.16-.6.67-3.54.78-3.69.27-.39,6.61-.03,7.56-.17,2.93,10.47,6.3,20.85,10.26,30.97h-6.37c.02-1.39-.36-2.95-.81-4.26-.19-.55-.27-1.45-.98-1.43l-11.68.04c-.25.08-.28.29-.37.49-.69,1.47-.69,3.7-1.38,5.16h-5.94ZM157.29,89.26h9.46l-4.91-14.1-4.56,14.1Z"/>
    <path fill="#0c0b0b" d="M244.53,86.68c-3.64-.57-7.34-.27-11.01-.34l.17,8.08c2.9-.15,5.8.23,8.7.18.41,0,.78-.17,1.19-.19,1.7-.09,3.24.12,4.91-.51l-.52,5.84-20.48-.6c.1-1.03.31-2.25.35-3.27.25-6.31.16-12.61,0-18.91-.07-2.85.09-5.69-.34-8.52l19.63-.27.5,5.77c-1.2-.47-2.57-.62-3.86-.69-3.34-.18-6.74.1-10.07.18l-.17,8.08c3.67-.09,7.38.26,11.01-.34v5.5Z"/>
    <path fill="#0c0b0b" d="M144.56,75.68c-6.48-5.9-12.65-1.98-13.25,6.11-.52,7.01,1.13,16.32,10.47,12.79-.1-4.51.37-9.11-.32-13.56h5.51v18.4c-.92-.11-2.11-.32-3.01-.34-4.7-.13-8.27,2.91-13.15-.79-7.21-5.48-6.95-24.38,1.31-28.93,4.27-2.35,7.44-1.51,11.75-.28.33.09.81.02,1.05.16.38.22-.35,1.69-.35,2.07v4.39Z"/>
    <path fill="#6e6f72" d="M5.01,31.99l6.28,3.95c.58.38,3.74,2.38,3.84,2.7l.04,25.6-.18.5c-3.7,2.41-6.93,5.64-9.04,9.54l-.94,2.07V31.99Z"/>
    <path fill="#0c0b0b" d="M294.94,69.66c-.06,2.19-.14,4.33,0,6.53-.3.08-.34-.12-.52-.26-2.86-2.21-4.42-3.32-8.35-3.02-2.45.19-7.16,2.07-5.21,5.22,1.36,2.2,7.74,3.83,10.24,5.24,8.54,4.85,5.61,14.97-3.52,16.49-4.02.67-7.96-.22-11.92-.89l-.16-6.46c3.11,2.35,7.41,3.14,11.18,2.15,3.52-.93,5.2-4.22,1.78-6.59-3.12-2.16-7.36-2.75-10.38-5.28-5.45-4.56-3.08-12.15,3.35-14.2,4.76-1.51,8.92-.22,13.51,1.04Z"/>
    <path fill="#6e6f72" d="M32.54,27.35l7.83,4.98,2.29,1.67.05,19.06-.12.27c-3.24,1.62-6.49,3.46-10.05,4.28v-30.27Z"/>
    <path fill="#0c0b0b" d="M85.54,68.45c-.53,3.27-.27,6.59-.34,9.9-.12,5.98-.29,12.06-.01,18.06.04.95.3,2.04.35,3h-6.28v-30.96h6.28Z"/>
  </svg>
);

const Login = ({ onLogin, users, onRegister }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('LOGIN');
  const [loginStep, setLoginStep] = useState('CREDENTIALS');
  const [regStep, setRegStep] = useState('FORM');
  const [recoverStep, setRecoverStep] = useState('EMAIL');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [targetEmail, setTargetEmail] = useState('');
  
  // State for missing identity fields
  const [loginIdentity, setLoginIdentity] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCnic, setRegCnic] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const otpInputs = useRef([]);

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpInputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpInputs.current[index - 1]?.focus();
  };

  const resetAllStates = () => {
    setError('');
    setSuccess('');
    setIsLoading(false);
    setOtp(['', '', '', '', '', '']);
    setLoginStep('CREDENTIALS');
    setRegStep('FORM');
    setRecoverStep('EMAIL');
    setLoginIdentity('');
    setLoginPassword('');
    setRegName('');
    setRegEmail('');
    setRegCnic('');
    setRegPhone('');
    setRegPassword('');
    setNewPassword('');
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const token = otp.join('');
    if (token.length < 6) return;
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'RECOVER') {
        await authProvider.verifyResetOTP(targetEmail, token);
        await authProvider.updatePassword(newPassword);
        setSuccess('Security clearance granted. Updated.');
        setTimeout(() => setMode('LOGIN'), 2000);
      } else {
        const { data, error: authError } = await authProvider.verifyOTP(
          targetEmail, 
          token, 
          mode === 'REGISTER' ? 'signup' : 'email'
        );
        if (authError) throw authError;
        if (data.user) {
          onLogin({
            id: data.user.id,
            name: data.user.user_metadata?.name || 'Member',
            email: data.user.email || targetEmail,
            role: data.user.user_metadata?.role || 'CLIENT',
            status: 'Active'
          });
        }
      }
    } catch (err) {
      setError(err.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (mode === 'LOGIN') {
        let finalEmail = loginIdentity.trim();
        if (!finalEmail.includes('@')) {
          const { data: profile } = await authProvider.checkCnicExists(finalEmail);
          if (!profile?.email) throw new Error('Identity not found.');
          finalEmail = profile.email;
        }
        await authProvider.signIn(finalEmail, loginPassword);
        await authProvider.sendLoginChallenge(finalEmail);
        setTargetEmail(finalEmail);
        setLoginStep('CHALLENGE');
      } else if (mode === 'RECOVER') {
        await authProvider.resetPasswordForEmail(targetEmail);
        setRecoverStep('RESET');
      } else {
        await authProvider.signUp(regEmail, regPassword, {
          name: regName,
          cnic: regCnic,
          phone: regPhone,
          role: 'CLIENT'
        });
        setTargetEmail(regEmail);
        setRegStep('VERIFY');
      }
    } catch (err) {
      setError(err.message || 'Auth failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const isOTPPhase = (mode === 'LOGIN' && loginStep === 'CHALLENGE') || (mode === 'REGISTER' && regStep === 'VERIFY') || (mode === 'RECOVER' && recoverStep === 'RESET');

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden text-slate-900">
      <div className="w-full max-md z-10 space-y-4">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
          <div className="p-8 bg-white border-b border-slate-100 flex flex-col items-center text-center">
             <div className="mb-6"><Logo /></div>
             <h1 className="text-2xl font-black uppercase tracking-tighter">{isOTPPhase ? 'CHALLENGE' : 'PORTAL'}</h1>
          </div>
          <div className="p-8">
            {error && <div className="mb-6 p-4 bg-red-50 text-red-700 text-xs font-bold rounded-2xl">{error}</div>}
            {success && <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-2xl">{success}</div>}
            {!isOTPPhase ? (
              <form onSubmit={handleAuthSubmit} className="space-y-6">
                {mode === 'LOGIN' ? (
                  <>
                    <input type="text" required placeholder="Email or CNIC" className="w-full p-4 bg-slate-50 rounded-2xl" value={loginIdentity} onChange={e => setLoginIdentity(e.target.value)} />
                    <input type="password" required placeholder="Password" className="w-full p-4 bg-slate-50 rounded-2xl" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                  </>
                ) : mode === 'REGISTER' ? (
                  <>
                    <input type="text" required placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-2xl" value={regName} onChange={e => setRegName(e.target.value)} />
                    <input type="email" required placeholder="Email" className="w-full p-4 bg-slate-50 rounded-2xl" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                    <input type="text" required placeholder="CNIC (xxxxx-xxxxxxx-x)" className="w-full p-4 bg-slate-50 rounded-2xl" value={regCnic} onChange={e => setRegCnic(e.target.value)} />
                    <input type="text" required placeholder="Phone Number" className="w-full p-4 bg-slate-50 rounded-2xl" value={regPhone} onChange={e => setRegPhone(e.target.value)} />
                    <input type="password" required placeholder="Password" className="w-full p-4 bg-slate-50 rounded-2xl" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                  </>
                ) : (
                  <input type="email" required placeholder="Email for Recovery" className="w-full p-4 bg-slate-50 rounded-2xl" value={targetEmail} onChange={e => setTargetEmail(e.target.value)} />
                )}
                <button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white p-4 rounded-3xl font-black uppercase">
                  {isLoading ? '...' : 'Continue'}
                </button>
                <div className="flex flex-col gap-2 mt-4">
                  <button type="button" onClick={() => { resetAllStates(); setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN'); }} className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
                    {mode === 'LOGIN' ? 'Create Account' : 'Back to Login'}
                  </button>
                  {mode === 'LOGIN' && (
                    <button type="button" onClick={() => { resetAllStates(); setMode('RECOVER'); }} className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
                      Forgot Password?
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-8">
                {mode === 'RECOVER' && (
                  <input type="password" required placeholder="New Password" className="w-full p-4 bg-slate-50 rounded-2xl mb-4" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                )}
                <div className="flex justify-center gap-2">
                  {otp.map((digit, i) => (
                    <input key={i} ref={el => otpInputs.current[i] = el} type="text" maxLength={1} className="w-10 h-14 bg-slate-50 rounded-2xl text-center text-xl font-black" value={digit} onChange={e => handleOtpChange(e.target.value, i)} onKeyDown={e => handleKeyDown(e, i)} />
                  ))}
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white p-4 rounded-3xl font-black uppercase">Verify</button>
                <button type="button" onClick={() => resetAllStates()} className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
