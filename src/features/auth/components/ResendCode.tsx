type ResendCodeProps = {
  email: string;
};

export function ResendCode({ email }: ResendCodeProps) {
  return (
    <p className="auth-hint">
      Code sent to <strong>{email}</strong>. You can request another code after
      this one expires.
    </p>
  );
}
