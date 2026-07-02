export function ProfileDetailSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="surface-panel overflow-hidden">
        <div className="h-24 skeleton sm:h-32" />
        <div className="px-4 pb-6 sm:px-8 sm:pb-8">
          <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end">
            <div className="h-24 w-24 shrink-0 rounded-full skeleton sm:h-28 sm:w-28" />
            <div className="flex-1 space-y-3 pb-1">
              <div className="h-6 w-28 rounded-full skeleton" />
              <div className="h-8 w-48 rounded-lg skeleton" />
              <div className="h-5 w-36 rounded-lg skeleton" />
            </div>
          </div>
          <div className="mt-6 h-16 w-full max-w-2xl rounded-lg skeleton" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-20 rounded-xl skeleton" />
        ))}
      </div>
    </div>
  );
}
