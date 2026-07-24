'use client';
import { useState, useRef, useEffect } from 'react';

function formatIndian(value) {
  if (!value) return '';
  const [intPart, decPart] = value.split('.');
  const lastThree = intPart.slice(-3);
  const otherNumbers = intPart.slice(0, -3);
  const formattedInt =
    otherNumbers !== ''
      ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
      : lastThree;
  return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
}

export default function QuickAddModal({ category, onClose, onSaved }) {
  const [rawAmount, setRawAmount] = useState(''); // digits + optional decimal, no commas
  const [label, setLabel] = useState('');
  const [saving, setSaving] = useState(false);
  const amountRef = useRef(null);

  useEffect(() => { amountRef.current?.focus(); }, []);

  function handleAmountChange(e) {
    let value = e.target.value.replace(/,/g, ''); // strip existing commas
    // allow only digits and a single decimal point
    value = value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
    setRawAmount(value);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!rawAmount || Number(rawAmount) <= 0) return;
    setSaving(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: category.name,
          amount: Number(rawAmount),
          label: category.hasLabel ? label : null,
        }),
      });
      const data = await res.json();
      if (data.success) onSaved(data.entry);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={handleSave}
        className="bg-white w-full sm:w-96 rounded-t-3xl sm:rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl">{category.icon}</span>
          <h2 className="text-lg font-semibold text-gray-800">{category.name}</h2>
        </div>

        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">₹</span>
          <input
            ref={amountRef}
            type="text"
            inputMode="decimal"
            value={formatIndian(rawAmount)}
            onChange={handleAmountChange}
            placeholder="0"
            className="w-full pl-9 pr-4 py-4 text-2xl font-medium rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
          />
        </div>

        {category.hasLabel && (
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Add a note (reason / person / item)"
            className="w-full px-4 py-3 mb-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
          />
        )}

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition">
            Cancel
          </button>
          <button type="submit" disabled={saving || !rawAmount} className="flex-1 py-3 rounded-2xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition disabled:opacity-40">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}