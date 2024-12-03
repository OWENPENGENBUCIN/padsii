import { fetchFilteredTransaksi } from '@/app/lib/transaksi';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';

export default async function TransaksiTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const transaksis = await fetchFilteredTransaksi(query, currentPage);

  const sortedTransaksis = transaksis?.sort((a, b) => {
    const dateA = new Date(a.tanggal_transaksi).getTime();
    const dateB = new Date(b.tanggal_transaksi).getTime();
    return dateB - dateA; 
  });

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile view */}
          <div className="md:hidden">
            {sortedTransaksis?.map((transaksi) => (
              <div key={transaksi.id} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="text-sm text-gray-500">{transaksi.member_nama}</p>
                    <p className="text-sm text-gray-500">{formatDateToLocal(transaksi.tanggal_transaksi)}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(transaksi.total_harga)}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(transaksi.pembayaran)}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(transaksi.kembalian)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Nama Member
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Tanggal Transaksi
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total Harga
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Pembayaran
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Kembalian
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {sortedTransaksis?.map((transaksi) => (
                <tr
                  key={transaksi.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">{transaksi.member_nama}</td>
                  <td className="whitespace-nowrap px-3 py-3">{formatDateToLocal(transaksi.tanggal_transaksi)}</td>
                  <td className="whitespace-nowrap px-3 py-3">{formatCurrency(transaksi.total_harga)}</td>
                  <td className="whitespace-nowrap px-3 py-3">{formatCurrency(transaksi.pembayaran)}</td>
                  <td className="whitespace-nowrap px-3 py-3">{formatCurrency(transaksi.kembalian)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
