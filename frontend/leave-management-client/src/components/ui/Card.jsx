export default function Card({ children, className = '', padding = true }) {
  return (
    <div className={`dashboard-card animate-fade-in ${padding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  );
}
