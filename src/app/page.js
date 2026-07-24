'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import CategoryCard from '@/components/CategoryCard';
import QuickAddModal from '@/components/QuickAddModal';

const COLORS = [
  'bg-rose-50 text-rose-500', 'bg-amber-50 text-amber-500', 'bg-emerald-50 text-emerald-500',
  'bg-sky-50 text-sky-500', 'bg-violet-50 text-violet-500', 'bg-fuchsia-50 text-fuchsia-500',
  'bg-cyan-50 text-cyan-500', 'bg-lime-50 text-lime-600',
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [toast, setToast] = useState(null);

  function handleSaved(entry) {
    setActiveCategory(null);
    setToast(`Saved ₹${entry.amount} for ${entry.category}`);
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-5 pt-8 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expense Tracer</h1>
            <p className="text-sm text-gray-400">Tap a category to log a spend</p>
          </div>
          <Link href="/summary" className="text-sm font-medium px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition">
            Summary
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} colorClass={COLORS[i % COLORS.length]} onClick={() => setActiveCategory(cat)} />
          ))}
        </div>
      </div>

      {activeCategory && (
        <QuickAddModal category={activeCategory} onClose={() => setActiveCategory(null)} onSaved={handleSaved} />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}
    </main>
  );
}