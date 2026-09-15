import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Phone, KeyRound, ShieldCheck, ArrowRight, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Layout } from '../components/Layout';
import { FormField } from '../components/FormField';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export const FarmerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/farmer/dashboard';

  const { requestOtp, verifyOtp, loginAsDemo, isAuthenticated } = useAuth();

  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [demoCode, setDemoCode] = useState<string | null>(null);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await requestOtp(cleanMobile);
      setIsLoading(false);
      if (res.success) {
        setStep('otp');
        setInfoMessage(res.message);
        if (res.demoOtp) {
          setDemoCode(res.demoOtp);
          setOtp(res.demoOtp);
        }
      } else {
        setError(res.message || 'Failed to send OTP. Please try again.');
      }
    } catch {
      setIsLoading(false);
      setError('Connection issue. Please verify your network and retry.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('Please enter the verification code received via SMS.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await verifyOtp(mobile, otp);
      setIsLoading(false);
      if (res.success) {
        navigate(redirectUrl, { replace: true });
      } else {
        setError(res.message || 'Invalid verification code. Please check and retry.');
      }
    } catch {
      setIsLoading(false);
      setError('Verification failed. Please retry.');
    }
  };

  const handleQuickDemoLogin = () => {
    loginAsDemo();
    navigate(redirectUrl, { replace: true });
  };

  return (
    <Layout>
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-md w-full">
          {/* Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gov-light text-gov-dark flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Farmer Verification Login
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Access your authorized cadastral plots & Soil Health Cards
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {infoMessage && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{infoMessage}</span>
              </div>
            )}

            {step === 'mobile' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <FormField
                  label="Registered Mobile Number (नोंदणीकृत मोबाईल क्र.)"
                  helperText="Enter 10-digit mobile number linked to your land record"
                >
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-xs font-semibold text-slate-500 pointer-events-none">
                      +91
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value);
                        if (error) setError(null);
                      }}
                      className="w-full pl-12 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gov-primary focus:border-transparent transition-all"
                    />
                  </div>
                </FormField>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Request OTP
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-600">Mobile: +91 {mobile}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('mobile');
                      setOtp('');
                      setError(null);
                    }}
                    className="text-gov-dark font-medium hover:underline text-[11px]"
                  >
                    Change
                  </button>
                </div>

                <FormField
                  label="Enter 6-Digit OTP"
                  helperText={demoCode ? `Demo code autofilled: ${demoCode}` : 'Check your mobile SMS for the code'}
                >
                  <Input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      if (error) setError(null);
                    }}
                    leftIcon={<KeyRound className="w-4 h-4" />}
                  />
                </FormField>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Verify & Access Fields
                </Button>
              </form>
            )}

            {/* Quick Demo Login Option */}
            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-2">
                For Demonstration & Inspection
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={handleQuickDemoLogin}
              >
                Instant Demo Login (Baramati/Malegaon)
              </Button>
            </div>
          </div>

          {/* Bottom Security Note */}
          <p className="text-center text-xs text-slate-500 mt-4">
            Under SoilPilot Land Governance protocols, soil records are private to verified parcel holders.
          </p>
        </div>
      </div>
    </Layout>
  );
};
