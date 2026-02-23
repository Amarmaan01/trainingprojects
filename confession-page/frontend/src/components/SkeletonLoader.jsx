const SkeletonCard = () => (
  <div className="glass-card p-5 mb-4 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-5 w-20 bg-dark-border/50 rounded-full" />
      <div className="h-4 w-16 bg-dark-border/50 rounded" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 w-full bg-dark-border/50 rounded" />
      <div className="h-4 w-3/4 bg-dark-border/50 rounded" />
      <div className="h-4 w-1/2 bg-dark-border/50 rounded" />
    </div>
    <div className="flex items-center justify-between border-t border-dark-border pt-3">
      <div className="flex gap-3">
        <div className="h-6 w-12 bg-dark-border/50 rounded" />
        <div className="h-6 w-12 bg-dark-border/50 rounded" />
        <div className="h-6 w-12 bg-dark-border/50 rounded" />
      </div>
      <div className="h-6 w-16 bg-dark-border/50 rounded" />
    </div>
  </div>
);

const SkeletonLoader = ({ count = 3 }) => (
  <div>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonLoader;
