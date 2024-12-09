'use client';

import React, { useState } from 'react';
import { fetchLaporanByMonth } from '@/app/lib/laporan/laporan';
import { Button } from '@/app/ui/button';
import { Laporan } from '@/app/lib/definitions';

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export default function LaporanClient({
  initialMonth,
  initialReportData,
}: {
  initialMonth: number | null;
  initialReportData: Laporan[];
}) {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(initialMonth);
  const [reportData, setReportData] = useState<Laporan[]>(initialReportData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleMonthClick = async (monthIndex: number) => {
    setSelectedMonth(monthIndex + 1);
    setLoading(true);
    setError(null);

    try {
      const laporan = await fetchLaporanByMonth(monthIndex + 1);
      setReportData(laporan);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat laporan.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (transaksiId: number) => {
    const transaksi = reportData.filter((data) => data.transaksi_id === transaksiId);

    if (!transaksi.length) return;

    const printContent = `
      <div style="font-family: Arial, sans-serif; margin: 20px;">
        <h1 style="text-align: center;">Laporan Penjualan Bulan ${months[selectedMonth! - 1]}</h1>
        <p><strong>Nama Member:</strong> ${transaksi[0]?.member_nama || 'Tidak Diketahui'}</p>
        <p><strong>Tanggal:</strong> ${transaksi[0]?.tanggal_transaksi}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f4f4f4;">
              <th style="border: 1px solid #ddd; padding: 8px;">No</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Nama Menu</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Jumlah</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Harga</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${transaksi
              .map(
                (item, index) => `
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${index + 1}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.nama_menu}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.jumlah}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.total_menu_harga.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${(item.jumlah * item.total_menu_harga).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                  </tr>
                `
              )
              .join('')}
          </tbody>
        </table>
        <p style="margin-top: 20px;"><strong>Total Harga:</strong> ${transaksi[0]?.total_harga.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
        <p><strong>Pembayaran:</strong> ${transaksi[0]?.pembayaran.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
        <p><strong>Kembalian:</strong> ${transaksi[0]?.kembalian.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
      </div>
    `;

    const printContainer = document.createElement('div');
    printContainer.innerHTML = printContent;
    printContainer.style.display = 'none';
    document.body.appendChild(printContainer);

    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContainer.innerHTML;

    window.print();
    document.body.innerHTML = originalContent;

    window.location.reload();
  };

  const uniqueTransactions = reportData.reduce<Laporan[]>((acc, item) => {
    if (!acc.some((transaksi) => transaksi.transaksi_id === item.transaksi_id)) {
      acc.push(item);
    }
    return acc;
  }, []);

  return (
    <>
      <p className="text-gray-600 mb-4 text-center">Pilih bulan untuk mencetak laporan transaksi:</p>
      <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {months.map((month, index) => (
          <button
            key={index}
            onClick={() => handleMonthClick(index)}
            className={`${
              selectedMonth === index + 1 ? 'bg-green-500' : 'bg-blue-500'
            } hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow transition-all duration-200`}
          >
            {month}
          </button>
        ))}
      </div>
      <div className="mt-8 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <table className="min-w-full text-gray-900">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Nama Member</th>
                  <th className="px-4 py-2">Tanggal Transaksi</th>
                  <th className="px-4 py-2">Total Harga</th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {uniqueTransactions.length > 0 ? (
                  uniqueTransactions.map((item, index) => (
                    <tr key={item.transaksi_id} className="border-b">
                      <td className="px-4 py-2 text-center">{index + 1}</td>
                      <td className="px-4 py-2">{item.member_nama}</td>
                      <td className="px-4 py-2">{item.tanggal_transaksi}</td>
                      <td className="px-4 py-2 text-right">
                        {item.total_harga.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Button
                          onClick={() => handlePrint(item.transaksi_id)}
                          className="rounded bg-blue-500 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                          Print
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                      Tidak ada data pada bulan {months[selectedMonth! - 1]}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
