import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sprout,
  ArrowLeft,
  RotateCcw,
  Layers,
  MapPin,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export const FarmerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/farmer/dashboard';
  const { t } = useTranslation();

  const { requestOtp, verifyOtp, loginAsDemo, isAuthenticated } = useAuth();

  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setError(t('auth.invalidOtp') || 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await requestOtp(cleanMobile);
      setIsLoading(false);
      if (res.success) {
        setStep('otp');
        setInfoMessage(t('auth.otpSent'));
        setCountdown(60);
        if (res.demoOtp) {
          setDemoCode(res.demoOtp);
          setOtp(res.demoOtp.split(''));
        }
      } else {
        setError(res.message || t('auth.serverError'));
      }
    } catch {
      setIsLoading(false);
      setError(t('auth.networkError'));
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    // Handle paste of 6 digits
    if (val.length > 1) {
      const digits = val.replace(/\D/g, '').slice(0, 6).split('');
      if (digits.length > 0) {
        const newOtp = [...otp];
        digits.forEach((d, i) => {
          if (i < 6) newOtp[i] = d;
        });
        setOtp(newOtp);
        const nextIdx = Math.min(digits.length, 5);
        document.getElementById(`otp-input-${nextIdx}`)?.focus();
        return;
      }
    }

    const singleDigit = val.slice(-1).replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = singleDigit;
    setOtp(newOtp);

    // Auto-focus next input
    if (singleDigit && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError(t('auth.invalidOtp') || 'Please enter all 6 digits of the verification code.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await verifyOtp(mobile, otpString);
      setIsLoading(false);
      if (res.success) {
        navigate(redirectUrl, { replace: true });
      } else {
        setError(res.message || t('auth.invalidOtp'));
      }
    } catch {
      setIsLoading(false);
      setError(t('auth.networkError'));
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError(null);
    setIsLoading(true);
    try {
      const res = await requestOtp(mobile);
      setIsLoading(false);
      if (res.success) {
        setInfoMessage(t('auth.otpSent'));
        setCountdown(60);
        if (res.demoOtp) {
          setDemoCode(res.demoOtp);
          setOtp(res.demoOtp.split(''));
        }
      } else {
        setError(res.message || t('auth.serverError'));
      }
    } catch {
      setIsLoading(false);
      setError(t('auth.networkError'));
    }
  };

  const handleQuickDemoLogin = () => {
    loginAsDemo();
    navigate(redirectUrl, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#fbfcf9] flex flex-col justify-between selection:bg-[#FFF8CF] selection:text-[#2A7C13]">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 h-16 px-4 sm:px-8 flex items-center justify-between shadow-2xs">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#2A7C13] flex items-center justify-center text-white shadow-xs group-hover:bg-[#22650f] transition-colors">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-[#2A7C13] tracking-tight leading-none">
                SoilPilot
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#FFF8CF] text-[#2A7C13] border border-[#FBE6C2] rounded-md">
                DSM Portal
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {t('app.subtitle')}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            to="/"
            className="text-xs text-slate-600 hover:text-[#2A7C13] flex items-center gap-1.5 font-bold transition-colors px-2 py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('auth.backToHome')}</span>
          </Link>
        </div>
      </header>

      {/* Main Container: Two-Column Split Layout on Desktop */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-slate-200 shadow-md overflow-hidden">
          {/* Left Column: Agricultural / Soil / GIS Visual Area in #2A7C13 */}
          <div className="lg:col-span-6 bg-[#2A7C13] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Subtle GIS grid & topography lines overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#76C457_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-[#76C457]/20 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8CF]/20 border border-[#FFF8CF]/30 text-xs font-bold text-[#FFF8CF]">
                <Sparkles className="w-3.5 h-3.5 text-[#76C457]" />
                <span>{t('auth.heroTag')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                {t('auth.heroTitle')}
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-md">
                {t('auth.heroDesc')}
              </p>

              <div className="space-y-3 pt-2 text-xs text-emerald-50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#76C457] flex items-center justify-center text-white flex-shrink-0 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">{t('auth.heroFeature1')}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#76C457] flex items-center justify-center text-white flex-shrink-0 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">{t('auth.heroFeature2')}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#76C457] flex items-center justify-center text-white flex-shrink-0 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">{t('auth.heroFeature3')}</span>
                </div>
              </div>
            </div>

            {/* Bottom Jurisdiction info note */}
            <div className="relative z-10 pt-8 mt-8 border-t border-[#22650f] flex items-center justify-between text-[11px] text-emerald-200">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#76C457]" />
                <span>{t('auth.heroJurisdiction')}</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#22650f] text-emerald-100 font-bold text-[10px]">
                SoilPilot V1
              </span>
            </div>
          </div>

          {/* Right Column: Modern Login Card */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-white">
            <div className="max-w-md mx-auto w-full space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-[#2A7C13]">
                    SoilPilot
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-500">
                    {t('app.subtitle')}
                  </span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {t('auth.farmerLogin')}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  {t('auth.loginSubtitle')}
                </p>
              </div>

              {/* Error Message Alert */}
              {error && (
                <div className="p-3.5 rounded-xl bg-[#FBE6C2] border border-[#f5d9a4] flex items-start gap-2.5 text-xs text-slate-900 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-[#2A7C13] flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Info Message */}
              {infoMessage && (
                <div className="p-3.5 rounded-xl bg-[#FFF8CF] border border-[#FBE6C2] flex items-start gap-2.5 text-xs text-[#2A7C13] font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#76C457]" />
                  <span>{infoMessage}</span>
                </div>
              )}

              {step === 'mobile' ? (
                /* Step 1: Mobile Number Input */
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label htmlFor="mobile-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {t('auth.mobileNumber')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-bold text-slate-600 border-r border-slate-200 pr-2.5">
                        +91
                      </div>
                      <input
                        id="mobile-input"
                        type="tel"
                        maxLength={10}
                        autoFocus
                        value={mobile}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setMobile(val);
                          if (error) setError(null);
                        }}
                        placeholder={t('auth.mobilePlaceholder')}
                        className="w-full pl-16 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2A7C13] focus:border-transparent transition-all tracking-wider"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      Enter the 10-digit mobile number linked to your land record
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || mobile.length !== 10}
                    className="w-full py-3 px-4 rounded-xl bg-[#2A7C13] hover:bg-[#76C457] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <span>{t('auth.sendingOtp')}</span>
                    ) : (
                      <>
                        <span>{t('auth.sendOtp')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Development Testing Demo Option */}
                  <div className="pt-4 border-t border-slate-100 text-center space-y-2">
                    <p className="text-[11px] text-slate-500 font-medium">
                      Testing locally without SMS gateway?
                    </p>
                    <button
                      type="button"
                      onClick={handleQuickDemoLogin}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FFF8CF] hover:bg-[#FBE6C2] text-[#2A7C13] text-xs font-bold border border-[#FBE6C2] transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Quick Test Login (Demo Farmer: Pradip Bhauso Shelar)</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Step 2: 6-Digit OTP Verification Screen */
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {t('auth.enterOtp')}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setStep('mobile');
                          setError(null);
                          setInfoMessage(null);
                        }}
                        className="text-xs font-bold text-[#2A7C13] hover:underline"
                      >
                        {t('auth.changeMobile')}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 mb-4">
                      {t('auth.otpInstruction')} <strong className="text-slate-900">+91 {mobile}</strong>
                    </p>

                    {/* 6 Individual Digit Inputs */}
                    <div className="flex items-center justify-between gap-2 sm:gap-2.5">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-input-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-lg font-black text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A7C13] focus:border-transparent transition-all shadow-2xs"
                        />
                      ))}
                    </div>

                    {demoCode && (
                      <p className="text-[11px] text-[#2A7C13] font-bold mt-2 bg-[#FFF8CF] p-2 rounded-lg border border-[#FBE6C2]">
                        {t('auth.devOtpNotice')}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otp.join('').length !== 6}
                    className="w-full py-3 px-4 rounded-xl bg-[#2A7C13] hover:bg-[#76C457] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <span>{t('auth.verifyingOtp')}</span>
                    ) : (
                      <>
                        <span>{t('auth.verifyOtp')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Resend OTP & Cooldown Counter */}
                  <div className="flex items-center justify-between text-xs pt-2">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={countdown > 0 || isLoading}
                      className="font-bold text-[#2A7C13] hover:underline disabled:text-slate-400 disabled:no-underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t('auth.resendOtp')}</span>
                    </button>

                    {countdown > 0 && (
                      <span className="text-slate-500 font-mono">
                        {t('auth.resendIn')} {countdown}s
                      </span>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer minimal info */}
      <footer className="py-4 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} SoilPilot — Digital Soil Mapping & Soil Health Portal</p>
      </footer>
    </div>
  );
};

export default FarmerLogin;
