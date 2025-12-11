export default function Card({ children }) {
  return (
    <div className="border rounded p-4 shadow-sm bg-white">
      {children}
    </div>
  );
}
