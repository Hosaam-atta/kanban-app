import type { PropsWithChildren } from 'react';

export function ScrollArea({ children }: PropsWithChildren) {
  return <div className="scroll-area">{children}</div>;
}
