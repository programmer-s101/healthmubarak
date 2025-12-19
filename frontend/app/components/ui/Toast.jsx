export default function Toast({ message, type }) {
  if (!message) return null;

  return (
    <div className={`fixed top-5 right-5 px-4 py-2 rounded text-white 
      ${type === "error" ? "bg-red-600" : "bg-green-600"}`}>
      {message}
    </div>
  );
}
