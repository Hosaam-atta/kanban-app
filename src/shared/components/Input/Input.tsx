import type { ComponentPropsWithoutRef } from 'react';

export function Input(props: ComponentPropsWithoutRef<'input'>) {
  return <input className="input" {...props} />;
}
