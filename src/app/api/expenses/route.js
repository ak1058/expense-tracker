import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { readMonthFile, writeMonthFile, getMonthYearFromDate, listAvailableMonths } from '@/lib/dataStore';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  if (searchParams.get('listMonths')) {
    return NextResponse.json({ months: listAvailableMonths() });
  }
  if (!month || !year) {
    return NextResponse.json({ error: 'month and year required' }, { status: 400 });
  }
  return NextResponse.json(readMonthFile(month, Number(year)));
}

export async function POST(request) {
  const { category, amount, label, date } = await request.json();
  if (!category || amount === undefined || amount === null) {
    return NextResponse.json({ error: 'category and amount required' }, { status: 400 });
  }

  const entryDate = date || new Date().toISOString().slice(0, 10);
  const { month, year } = getMonthYearFromDate(entryDate);

  const data = readMonthFile(month, year);
  const entry = {
    id: randomUUID(),
    category,
    label: label || null,
    amount: Number(amount),
    date: entryDate,
    createdAt: new Date().toISOString(),
  };
  data.entries.push(entry);
  writeMonthFile(month, year, data);

  return NextResponse.json({ success: true, entry, month, year });
}

export async function DELETE(request) {
  const { id, month, year } = await request.json();
  if (!id || !month || !year) {
    return NextResponse.json({ error: 'id, month, year required' }, { status: 400 });
  }
  const data = readMonthFile(month, Number(year));
  data.entries = data.entries.filter(e => e.id !== id);
  writeMonthFile(month, Number(year), data);
  return NextResponse.json({ success: true });
}