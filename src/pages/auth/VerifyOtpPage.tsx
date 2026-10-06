import { useMemo, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { OtpInput } from '../../features/auth/components/OtpInput';
import { ResendCode } from '../../features/auth/components/ResendCode';
import type { OtpVerificationFormValues } from '../../features/auth/schemas/auth.schemas';
import { verifyEmailOtp } from '../../services/auth.service';

type LocationState = {
  from?: string;
};

export function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = useMemo(
    () =>
      searchParams.get('email') ??
      sessionStorage.getItem('kanban:auth-email') ??
      '',
    [searchParams],
  );
  const from = (location.state as LocationState | null)?.from ?? '/';

  async function handleSubmit({ token }: OtpVerificationFormValues) {
    if (!email) {
      setError('Start again by entering your email address.');
      return;
    }

    setError(undefined);
    setIsSubmitting(true);

    try {
      await verifyEmailOtp({ email, token });
      sessionStorage.removeItem('kanban:auth-email');
      navigate(from, { replace: true });
    } catch (verificationError) {
      setError(
        verificationError instanceof Error
          ? verificationError.message
          : 'The verification code is invalid or expired.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="verify-title">
        <p className="eyebrow">Email verification</p>
        <h1 id="verify-title">Enter your code</h1>
        {email ? (
          <ResendCode email={email} />
        ) : (
          <p className="auth-hint">
            No email was found. <Link to="/auth">Start sign in again.</Link>
          </p>
        )}
        <OtpInput
          error={error}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </section>
    </main>
  );
}
