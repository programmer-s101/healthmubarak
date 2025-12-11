export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        {children}
        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
