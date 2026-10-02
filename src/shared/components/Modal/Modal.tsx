import type { PropsWithChildren } from 'react';

type ModalProps = PropsWithChildren<{
  title: string;
}>;

export function Modal({ children, title }: ModalProps) {
  return (
    <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
