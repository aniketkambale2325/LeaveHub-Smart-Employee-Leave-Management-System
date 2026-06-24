export default function Toast({ messages = [] }) {
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
      {messages.map(m => (
        <div key={m.id} className={`px-4 py-3 rounded-lg shadow ${m.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
          {m.text}
        </div>
      ))}
    </div>
  );
}
