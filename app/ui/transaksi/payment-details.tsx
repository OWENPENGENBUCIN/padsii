import React from "react";

type PaymentDetailsProps = {
  totalHarga: number;
  pembayaran: number;
  setPembayaran: React.Dispatch<React.SetStateAction<number>>;
  tanggalTransaksi: string;
};

export default function PaymentDetails({
  totalHarga,
  pembayaran,
  setPembayaran,
  tanggalTransaksi,
}: PaymentDetailsProps) {
  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const handlePembayaranChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); 
    const numberValue = Number(rawValue || "0");
    setPembayaran(numberValue);
  };

  // Hitung kembalian
  const kembalian = pembayaran - totalHarga;

  return (
    <>
      {/* Input Tanggal Transaksi */}
      <div className="mb-4">
        <label
          htmlFor="tanggal_transaksi"
          className="block text-sm font-medium mb-2"
        >
          Tanggal Transaksi
        </label>
        <input
          id="tanggal_transaksi"
          name="tanggal_transaksi"
          type="text"
          value={tanggalTransaksi}
          className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm"
          readOnly
        />
      </div>

      {/* Input Total Harga */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Total Harga</label>
        <input
          className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm"
          value={formatRupiah(totalHarga)}
          readOnly
        />
      </div>

      {/* Input Pembayaran */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Pembayaran</label>
        <input
          className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm"
          type="text"
          value={pembayaran ? formatRupiah(pembayaran) : ""}
          placeholder="Masukkan jumlah pembayaran"
          onChange={handlePembayaranChange}
        />
      </div>

      {/* Input Kembalian */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Kembalian</label>
        <input
          className={`block w-full rounded-md border py-2 pl-3 text-sm ${
            kembalian < 0 ? "text-red-500" : "text-black"
          }`}
          type="text"
          value={formatRupiah(kembalian)}
          readOnly
        />
      </div>
    </>
  );
}
