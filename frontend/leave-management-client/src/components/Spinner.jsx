export default function Spinner({ size = 6 }) {
  return (
    <div className={`animate-spin rounded-full border-4 border-transparent border-t-indigo-600`} style={{ width: `${size}rem`, height: `${size}rem` }} />
  );
}
