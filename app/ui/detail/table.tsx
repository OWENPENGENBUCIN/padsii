import { fetchFilteredDetailTransaksi } from '@/app/lib/transaksi/transaksi';
import type { DetailTransaksi } from '@/app/lib/definitions'; // Import tipe data DetailTransaksi

export default async function detailtranskasiTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const details = await fetchFilteredDetailTransaksi(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {details?.map((detail: DetailTransaksi) => (
              <div
                key={detail.id_detailtransaksi}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="text-sm text-gray-500">ID Transaksi: {detail.id_transaksi}</p>
                    <p className="text-sm text-gray-500">Menu: {detail.nama_detailtransaksi}</p>
                    <p className="text-sm text-gray-500">Total Laporan: {detail.total_laporan}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  ID Transaksi
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Nama Detail Transaksi
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total Laporan
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {details?.map((detail: DetailTransaksi) => (
                <tr
                  key={detail.id_detailtransaksi}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">{detail.id_transaksi}</td>
                  <td className="whitespace-nowrap px-3 py-3">{detail.nama_detailtransaksi}</td>
                  <td className="whitespace-nowrap px-3 py-3">{detail.total_laporan}</td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {/* Edit/Delete buttons can go here */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
