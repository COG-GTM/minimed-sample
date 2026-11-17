import { Link } from 'react-router-dom';

const BrandLogo = ({ to = '/', className = '' }: { to?: string; className?: string }) => (
  <Link to={to} className={`shrink-0 rounded text-2xl font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${className}`}>
    MiniMed<span className="text-xs align-super">™</span>
  </Link>
);

export default BrandLogo;
