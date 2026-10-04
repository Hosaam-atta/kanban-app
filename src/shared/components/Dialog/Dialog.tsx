import type { PropsWithChildren } from 'react';

export function Dialog({ children }: PropsWithChildren) {
  return <div className="dialog">{children}</div>;
}
