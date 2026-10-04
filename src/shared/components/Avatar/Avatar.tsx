import type { PropsWithChildren } from 'react';

export function Avatar({ children }: PropsWithChildren) {
  return <div className="avatar">{children}</div>;
}
