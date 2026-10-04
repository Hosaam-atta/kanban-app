import type { PropsWithChildren } from 'react';

export function Popover({ children }: PropsWithChildren) {
  return <div className="popover">{children}</div>;
}
