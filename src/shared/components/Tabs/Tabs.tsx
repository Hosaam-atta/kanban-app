import type { PropsWithChildren } from 'react';

export function Tabs({ children }: PropsWithChildren) {
  return <div className="tabs">{children}</div>;
}
