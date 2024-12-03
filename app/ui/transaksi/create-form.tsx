"use client";
import { useState, useEffect } from "react";
import { Button } from "@/app/ui/button";
import { createTransaksi } from "@/app/lib/actions";
import { MemberTable, MenuTable } from "@/app/lib/definitions";

export default function TransaksiCreateForm({
  menu,
  member,
}: {
  menu: MenuTable[];
  member: MemberTable[];
}) {
  const [selectedMenus, setSelectedMenus] = useState<any[]>([]);
  const [totalHarga, setTotalHarga] = useState(0);
  const [tanggalTransaksi, setTanggalTransaksi] = useState("");
  const [pembayaran, setPembayaran] = useState(0);
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [errors, setErrors] = useState<{
    menu?: string;
    pembayaran?: string;
    member?: string;
  }>({});

  // Format tanggal menjadi "11 November 2024"
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("id-ID", options).format(date);
  };

  // Set tanggal transaksi otomatis
  useEffect(() => {
    const today = new Date();
    setTanggalTransaksi(formatDate(today));
  }, []);

  // Hitung total harga
  useEffect(() => {
    const total = selectedMenus.reduce(
      (sum, menu) => sum + menu.harga_menu * menu.jumlah,
      0
    );
    setTotalHarga(total);
  }, [selectedMenus]);

  // Tambah menu
  const addMenu = (menu: MenuTable) => {
    setSelectedMenus((prev) => {
      const existing = prev.find((item) => item.id === menu.id);

      if (existing) {
        return prev.map((item) =>
          item.id === menu.id ? { ...item, jumlah: item.jumlah + 1 } : item
        );
      } else {
        return [...prev, { ...menu, jumlah: 1 }];
      }
    });
    setErrors((prev) => ({ ...prev, menu: undefined }));
  };

  // Kurangi menu
  const removeMenu = (menu: MenuTable) => {
    setSelectedMenus((prev) => {
      const existing = prev.find((item) => item.id === menu.id);

      if (existing) {
        if (existing.jumlah > 1) {
          return prev.map((item) =>
            item.id === menu.id ? { ...item, jumlah: item.jumlah - 1 } : item
          );
        } else {
          return prev.filter((item) => item.id !== menu.id);
        }
      }

      return prev;
    });
  };

  // Reset form
  const handleReset = () => {
    setSelectedMenus([]);
    setTotalHarga(0);
    setTanggalTransaksi(formatDate(new Date()));
    setPembayaran(0);
    setSelectedMember("");
    setErrors({});
  };

  // Validate and handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (selectedMenus.length === 0) {
      setErrors((prev) => ({
        ...prev,
        menu: "Minimal harus memilih 1 menu",
      }));
      return;
    }

    if (selectedMember === "") {
      setErrors((prev) => ({
        ...prev,
        member: "Pilih member terlebih dahulu",
      }));
      return;
    }

    if (pembayaran < totalHarga) {
      setErrors((prev) => ({
        ...prev,
        pembayaran: "Pembayaran Kurang !!!",
      }));
      return;
    }

    // Buat transaksi jika semua valid
    await createTransaksi({ selectedMenus, selectedMember, totalHarga, pembayaran, tanggalTransaksi });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Error Messages */}
        {(errors.menu || errors.pembayaran || errors.member) && (
          <div className="mb-4 p-4 bg-red-100 rounded-md">
            {errors.menu && (
              <p className="text-red-600 text-sm mb-2">{errors.menu}</p>
            )}
            {errors.pembayaran && (
              <p className="text-red-600 text-sm">{errors.pembayaran}</p>
            )}
            {errors.member && (
              <p className="text-red-600 text-sm">{errors.member}</p>
            )}
          </div>
        )}

        {/* Pilih Menu */}
        <div className="mb-4">
          <label htmlFor="total_harga" className="block text-sm font-medium mb-2">
            Pilih Menu
          </label>
          <div className="border border-gray-300 rounded-lg shadow-sm">
            {menu.map((item, index) => (
              <div key={item.id}>
                <div
                  className={`flex items-center justify-between px-4 py-3 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <div className="text-sm font-medium text-gray-700">
                    {item.nama_menu} - Rp {item.harga_menu}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-full bg-red-500 text-white px-2 py-1 text-sm hover:bg-red-600"
                      onClick={() => removeMenu(item)}
                    >
                      -
                    </button>
                    <span className="font-semibold">
                      {
                        selectedMenus.find((menu) => menu.id === item.id)?.jumlah ||
                        0
                      }
                    </span>
                    <button
                      type="button"
                      className="rounded-full bg-green-500 text-white px-2 py-1 text-sm hover:bg-green-600"
                      onClick={() => addMenu(item)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <hr className="border-t border-gray-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Pilih Member */}
        <div className="mb-4">
          <label htmlFor="member_nama" className="block text-sm font-medium mb-2">
            Pilih Member
          </label>
          <select
            id="member_nama"
            name="member_nama"
            className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm"
            required
            value={selectedMember} // Pastikan value-nya mengikat ke selectedMember
            onChange={(e) => setSelectedMember(e.target.value)}
          >
            <option value="">Pilih Member</option>
            {member.map((item) => (
              <option key={item.id} value={item.nama_member}>
                {item.nohp_member}
              </option>
            ))}
          </select>
        </div>

        {/* Tanggal Transaksi */}
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

        {/* Total Harga */}
        <div className="mb-4">
          <label htmlFor="total_harga" className="block text-sm font-medium mb-2">
            Total Harga
          </label>
          <input
            id="total_harga"
            name="total_harga"
            type="number"
            value={totalHarga}
            className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm"
            readOnly
          />
        </div>

        {/* Pembayaran */}
        <div className="mb-4 flex items-center">
          <label htmlFor="pembayaran" className="block text-sm font-medium mb-2">
            Pembayaran
          </label>
          {errors.pembayaran && (
            <p className="text-red-600 text-sm ml-2">{errors.pembayaran}</p>
          )}
        </div>
        <input
          id="pembayaran"
          name="pembayaran"
          type="number"
          placeholder="Masukkan Pembayaran"
          className={`block w-full rounded-md border py-2 pl-3 text-sm ${
            errors.pembayaran ? "border-red-500" : "border-gray-200"
          }`}
          disabled={selectedMenus.length === 0}
          onChange={(e) => setPembayaran(Number(e.target.value))}
        />

        {/* Kembalian */}
        <div className="mb-4 mt-6">
          <label htmlFor="kembalian" className="block text-sm font-medium mb-2">
            Kembalian
          </label>
          <input
            id="kembalian"
            name="kembalian"
            type="number"
            value={pembayaran - totalHarga}
            className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm"
            readOnly
          />
        </div>

        {/* Button Submit and Reset */}
        <div className="flex gap-4 justify-end">
          <Button type="submit">Simpan</Button>
          <Button type="button" onClick={handleReset}>
            Batal
          </Button>
        </div>
      </div>
    </form>
  );
}
