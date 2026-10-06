import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  emailLoginSchema,
  type EmailLoginFormValues,
} from '../schemas/auth.schemas';

type EmailLoginFormProps = {
  error?: string;
  isSubmitting: boolean;
  onSubmit: (values: EmailLoginFormValues) => void;
};

export function EmailLoginForm({
  error,
  isSubmitting,
  onSubmit,
}: EmailLoginFormProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<EmailLoginFormValues>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: '',
    },
  });

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <label>
        Email address
        <input
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          type="email"
          {...register('email')}
        />
      </label>

      {errors.email ? (
        <p className="form-error">{errors.email.message}</p>
      ) : null}
      {error ? <p className="form-error">{error}</p> : null}

      <button className="button" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Sending code...' : 'Send verification code'}
      </button>
    </form>
  );
}
