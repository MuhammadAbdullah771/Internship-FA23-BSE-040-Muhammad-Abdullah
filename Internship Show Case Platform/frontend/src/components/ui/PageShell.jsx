const PageShell = ({ children, className = '' }) => (
  <div className={`relative isolate min-h-[70vh] overflow-hidden ${className}`}>
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 app-atmosphere" />
      <div className="absolute inset-0 app-grain" />
      <div className="absolute -top-24 right-[-8%] h-72 w-72 rounded-full bg-brand-300/20 blur-3xl animate-drift" />
      <div className="absolute bottom-10 left-[-6%] h-64 w-64 rounded-full bg-brand-700/10 blur-3xl animate-drift delay-3" />
    </div>
    <div className="relative">{children}</div>
  </div>
);

export default PageShell;
