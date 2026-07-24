'use client';
export default function CategoryCard({ category, colorClass, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all active:scale-95"
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${colorClass}`}>
        {category.icon}
      </div>
      <span className="text-xs font-medium text-gray-600 text-center leading-tight">{category.name}</span>
    </button>
  );
}