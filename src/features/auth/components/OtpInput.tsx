import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  otpVerificationSchema,
  type OtpVerificationFormValues,
} from '../schemas/auth.schemas';

type OtpInputProps = {
  error?: string;
  isSubmitting: boolean;
  onSubmit: (values: OtpVerificationFormValues) => void;
};

export function OtpInput({ error, isSubmitting, onSubmit }: OtpInputProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<OtpVerificationFormValues>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      token: '',
    },
  });

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <label>
        Verification code
        <input
          autoComplete="one-time-code"
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          type="text"
          {...register('token')}
        />
      </label>

      {errors.token ? (
        <p className="form-error">{errors.token.message}</p>
      ) : null}
      {error ? <p className="form-error">{error}</p> : null}

      <button className="button" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Verifying...' : 'Verify and continue'}
      </button>
    </form>
  );
}
