import { motion } from 'framer-motion';
import { cn } from '../../utils';

export default function PageHeader({
  title,
  subtitle,
  eyebrow,
  badge,
  actions,
  className,
  size = 'default',
}) {
  const titleClass = size === 'large'
    ? 'text-3xl lg:text-4xl font-extrabold tracking-tight'
    : 'text-2xl lg:text-3xl font-bold tracking-tight';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex flex-col sm:flex-row sm:items-end justify-between gap-4', className)}
    >
      <div className="space-y-2">
        {eyebrow && (
          <p className="section-label">{eyebrow}</p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className={cn(titleClass, 'text-gradient-dark')}>{title}</h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-[15px] text-slate-500 leading-relaxed max-w-2xl">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">{actions}</div>
      )}
    </motion.div>
  );
}
