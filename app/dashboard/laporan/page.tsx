import React from 'react';
import LaporanClient from '@/app/ui/laporan/Laporan';
import { fetchLaporanByMonth } from '@/app/lib/laporan/laporan';

export default async function LaporanPage({
  searchParams,
}: {
  searchParams?: { month?: string };
}) {
  const selectedMonth = searchParams?.month
    ? parseInt(searchParams.month, 10)
    : new Date().getMonth() + 1;

  const reportData = await fetchLaporanByMonth(selectedMonth);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Laporan Transaksi</h1>
      <LaporanClient initialMonth={selectedMonth} initialReportData={reportData} />
    </div>
  );
}
