import { useEffect, useRef, useState } from 'react';

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(() => (typeof target !== 'number' || target <= 0 ? (target || 0) : 0));
  const [prevTarget, setPrevTarget] = useState(target);
  const frameRef = useRef(null);
  const startTimeRef = useRef(null);

  if (target !== prevTarget) {
    setPrevTarget(target);
    setCount(typeof target !== 'number' || target <= 0 ? (target || 0) : 0);
  }

  useEffect(() => {
    if (typeof target !== 'number' || target <= 0) {
      return;
    }

    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min(
        (timestamp - startTimeRef.current) / duration,
        1
      );
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, duration]);

  return count;
}

export default function StatCard({
  title,
  value,
  icon,
  subtitle,
  prefix = '',
  suffix = '',
}) {
  const animatedValue = useCountUp(value);
  const IconComponent = icon;

  return (
    <div className="glass-card p-6 hover:border-apple-blue/30 transition-all duration-300 group cursor-default">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="p-3 rounded-apple-sm bg-apple-blue/[0.08] group-hover:bg-apple-blue/[0.12] transition-colors duration-300">
          {IconComponent && <IconComponent className="w-6 h-6 text-apple-blue" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-apple-ink-48 font-normal truncate">{title}</p>
          <p className="text-2xl font-semibold text-apple-ink mt-1 tracking-tight">
            {prefix}
            {animatedValue.toLocaleString()}
            {suffix}
          </p>
          {subtitle && (
            <p className="text-xs text-apple-ink-48 mt-1 truncate">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
