import { Link } from 'react-router-dom';

/**
 * InternShowcase brand logo — uses frontend/public/logo.png
 */
const Logo = ({
  to = '/',
  className = '',
  imgClassName = 'h-9 w-auto',
}) => {
  const content = (
    <img
      src="/logo.png"
      alt="InternShowcase"
      className={`object-contain ${imgClassName} ${className}`}
      decoding="async"
    />
  );

  if (!to) {
    return content;
  }

  return (
    <Link to={to} className="inline-flex items-center" aria-label="InternShowcase home">
      {content}
    </Link>
  );
};

export default Logo;
