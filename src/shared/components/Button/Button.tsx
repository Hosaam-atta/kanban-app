import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type ButtonProps<TElement extends ElementType> = {
  as?: TElement;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<TElement>, 'as' | 'children'>;

export function Button<TElement extends ElementType = 'button'>({
  as,
  children,
  ...props
}: ButtonProps<TElement>) {
  const Component = as ?? 'button';

  return (
    <Component className="button" {...props}>
      {children}
    </Component>
  );
}
