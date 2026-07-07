import { cn } from '../../utils';

const variants = {
  primary: 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/25 btn-shine',
  secondary: 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm shadow-slate-200/50',
  outline: 'bg-white/80 border border-slate-200/80 text-slate-700 hover:border-emerald-300/80 hover:text-emerald-700 hover:bg-emerald-50/50 shadow-sm backdrop-blur-sm',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100/80',
  danger: 'bg-gradient-to-r from-red-600 to-rose-500 text-white hover:from-red-500 hover:to-rose-400 shadow-lg shadow-red-500/20',
  purple: 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-500/25 btn-shine',
  'purple-light': 'bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 backdrop-blur-sm',
};

const sizes = {
  sm: 'px-3.5 py-2 text-xs rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3.5 text-sm rounded-2xl font-semibold',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </button>
  );
}
