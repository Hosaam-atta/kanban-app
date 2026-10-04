import type { PropsWithChildren } from 'react';

export function Dropdown({ children }: PropsWithChildren) {
  return <div className="dropdown">{children}</div>;
}
