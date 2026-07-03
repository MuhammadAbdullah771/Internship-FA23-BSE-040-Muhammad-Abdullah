export default function Form({ children, onSubmit, className }) {
  return (
    <form onSubmit={onSubmit} className={className} noValidate>
      {children}
    </form>
  );
}
