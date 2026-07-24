'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';

function currentMonthYear() {
  const d = new Date();
  return { month: d.toLocaleString('en-US', { month: 'long' }), year: d.getFullYear() };
}

export default function Summary() {
  const [months, setMonths] = useState([]);
  const [selected, setSelected] = useState(currentMonthYear());
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/expenses?listMonths=1').then(r => r.json()).then(d => setMonths(d.months || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/expenses?month=${selected.month}&year=${selected.year}`)
      .then(r => r.json())
      .then(d => { setEntries(d.entries || []); setLoading(false); });
  }, [selected]);

  async function handleDelete(id) {
    await fetch('/api/expenses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, month: selected.month, year: selected.year }),
    });
    setEntries(entries.filter(e => e.id !== id));
  }

  const total = entries.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = CATEGORIES.map(cat => {
    const catEntries = entries.filter(e => e.category === cat.name);
    return { ...cat, total: catEntries.reduce((s, e) => s + e.amount, 0), count: catEntries.length };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-5 pt-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900">← Back</Link>
          <select
            value={`${selected.month}-${selected.year}`}
            onChange={(e) => { const [month, year] = e.target.value.split('-'); setSelected({ month, year: Number(year) }); }}
            className="text-sm font-medium px-3 py-2 rounded-full bg-white border border-gray-200"
          >
            {months.length === 0 && <option value={`${selected.month}-${selected.year}`}>{selected.month} {selected.year}</option>}
            {months.map(m => <option key={`${m.month}-${m.year}`} value={`${m.month}-${m.year}`}>{m.month} {m.year}</option>)}
          </select>
        </div>

        <div className="bg-gray-900 text-white rounded-3xl p-6 mb-6">
          <p className="text-sm text-gray-400 mb-1">Total spent · {selected.month} {selected.year}</p>
          <p className="text-4xl font-bold">₹{total.toLocaleString('en-IN')}</p>
          <p className="text-sm text-gray-400 mt-1">{entries.length} transactions</p>
        </div>

        {!loading && byCategory.length > 0 && (
          <div className="bg-white rounded-3xl p-5 mb-6 border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">By category</h2>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {byCategory.map(cat => (
                <div key={cat.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-2 text-gray-700"><span>{cat.icon}</span>{cat.name}</span>
                    <span className="font-medium text-gray-900">₹{cat.total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-900 rounded-full" style={{ width: `${(cat.total / total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl p-5 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Transactions</h2>
          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-gray-400">No expenses yet this month.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {[...entries].sort((a, b) => new Date(b.date) - new Date(a.date)).map(e => {
                const cat = CATEGORIES.find(c => c.name === e.category);
                return (
                  <div key={e.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{cat?.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{e.category}</p>
                        {e.label && <p className="text-xs text-gray-400">{e.label}</p>}
                        <p className="text-xs text-gray-300">{e.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">₹{e.amount.toLocaleString('en-IN')}</span>
                      <button onClick={() => handleDelete(e.id)} className="text-gray-300 hover:text-red-500 text-xs">✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}