export default function EmptyState({ title = 'No data', description = 'Nothing to show here yet.' }) {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center text-center">
      <div className="text-4xl mb-4">📭</div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
    </div>
  );
}
