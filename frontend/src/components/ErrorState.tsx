import React from 'react';
import { AlertTriangle, ShieldAlert, FileQuestion, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  statusCode?: number | string;
  title?: string;
  message?: string;
  onRetry?: () => void;
  showBack?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  statusCode,
  title,
  message,
  onRetry,
  showBack = true,
}) => {
  const navigate = useNavigate();

  // Determine specific error scenario
  const is403 = statusCode === 403 || statusCode === '403';
  const is404 = statusCode === 404 || statusCode === '404';
  const is401 = statusCode === 401 || statusCode === '401';

  const defaultTitle = is403
    ? 'Access Restricted (403 Forbidden)'
    : is404
    ? 'Field Not Found (404)'
    : is401
    ? 'Session Expired (401)'
    : 'Unable to Load Data';

  const defaultMessage = is403
    ? 'This Gat plot is not associated with your authorized farmer account. Under SoilPilot data protection protocols, cadastral soil records can only be accessed by the verified landholder.'
    : is404
    ? 'No cadastral boundary or soil records were found for the requested Gat number in this village.'
    : is401
    ? 'Your session has expired. Please verify your mobile number via OTP to view authorized fields.'
    : 'An error occurred while fetching information from the DSM GIS server. Please verify your connection or try again.';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-lg mx-auto my-8 shadow-sm">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-slate-50 border border-slate-200">
        {is403 ? (
          <ShieldAlert className="w-7 h-7 text-amber-600" />
        ) : is404 ? (
          <FileQuestion className="w-7 h-7 text-slate-500" />
        ) : (
          <AlertTriangle className="w-7 h-7 text-rose-600" />
        )}
      </div>

      <h3 className="text-base font-semibold text-slate-900 mb-2">
        {title || defaultTitle}
      </h3>

      <p className="text-xs text-slate-600 leading-relaxed mb-6">
        {message || defaultMessage}
      </p>

      <div className="flex items-center justify-center gap-3">
        {showBack && (
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        )}
        {onRetry && (
          <Button
            variant="primary"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={onRetry}
          >
            Retry Request
          </Button>
        )}
        {is401 && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/farmer/login')}
          >
            Farmer Login
          </Button>
        )}
      </div>
    </div>
  );
};
