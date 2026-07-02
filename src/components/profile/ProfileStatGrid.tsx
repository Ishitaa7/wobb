import { memo, useMemo } from "react";
import type { ProfileStat } from "@/lib/formatters";
import { staggerDelay } from "@/lib/animations";

interface ProfileStatGridProps {
  stats: ProfileStat[];
}

export const ProfileStatGrid = memo(function ProfileStatGrid({
  stats,
}: ProfileStatGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} stat={stat} index={index} />
      ))}
    </div>
  );
});

const StatCard = memo(function StatCard({
  stat,
  index,
}: {
  stat: ProfileStat;
  index: number;
}) {
  const delay = useMemo(() => staggerDelay(index, 50), [index]);

  return (
    <div
      style={{ animationDelay: delay }}
      className="animate-scale-in surface-card p-4 text-left"
    >
      <div className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
        {stat.label}
      </div>
      <div className="mt-1 text-lg font-bold text-[var(--color-ink)]">
        {stat.value}
      </div>
    </div>
  );
});
