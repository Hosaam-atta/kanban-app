import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EmailLoginForm } from '../../features/auth/components/EmailLoginForm';
import type { EmailLoginFormValues } from '../../features/auth/schemas/auth.schemas';
import { requestEmailOtp } from '../../services/auth.service';

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as LocationState | null)?.from?.pathname ?? '/';

  async function handleSubmit({ email }: EmailLoginFormValues) {
    setError(undefined);
    setIsSubmitting(true);

    try {
      await requestEmailOtp({
        email,
        emailRedirectTo: `${window.location.origin}/auth/verify`,
      });
      sessionStorage.setItem('kanban:auth-email', email);
      navigate(`/auth/verify?email=${encodeURIComponent(email)}`, {
        state: { from },
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'We could not send a verification code. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <p className="eyebrow">KanbanFlow</p>
        <h1 id="auth-title">Sign in to your workspace</h1>
        <p className="auth-copy">
          Enter your email address to receive a secure sign-in code.
        </p>
        <EmailLoginForm
          error={error}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </section>
    </main>
  );
}
