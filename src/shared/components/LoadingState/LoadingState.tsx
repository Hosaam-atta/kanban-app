import type { PropsWithChildren } from 'react';

export function LoadingState({ children }: PropsWithChildren) {
  return <div className="loading-state">{children}</div>;
}
