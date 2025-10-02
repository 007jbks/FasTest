export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-white hover:bg-gray-900 hover:text-white text-black font-bold py-2 px-4 rounded">
      {children}
    </button>
  );
}
