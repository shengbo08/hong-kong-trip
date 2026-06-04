import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
}

export function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section id={id} className="min-w-0 scroll-mt-24 py-8 sm:py-12">
      <div className="mb-5">
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-bold text-stone-950 dark:text-white sm:text-3xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}
