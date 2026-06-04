interface EmptyStateProps {
  label?: string;
}

export function EmptyState({ label = '尚未建立資料' }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white/70 px-4 py-6 text-center text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-900/70 dark:text-stone-400">
      {label}
    </div>
  );
}
