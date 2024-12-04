import React from "react";
import { MenuTable } from "@/app/lib/definitions";

type MenuListProps = {
    menu: MenuTable[];
    selectedMenus: any[];
    setSelectedMenus: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function MenuList({
    menu,
    selectedMenus,
    setSelectedMenus,
}: MenuListProps) {
    const addMenu = (menu: MenuTable) => {
        setSelectedMenus((prev) => {
            const existing = prev.find((item) => item.id === menu.id);
            return existing
              ? prev.map((item) =>
                  item.id === menu.id ? { ...item, jumlah: item.jumlah + 1 } : item
                )
              : [...prev, { ...menu, jumlah: 1 }];
          });          
    };

    const removeMenu = (menu: MenuTable) => {
        setSelectedMenus((prev) => {
            const existing = prev.find((item) => item.id === menu.id);
            return existing?.jumlah > 1
                ? prev.map((item) =>
                    item.id === menu.id ? { ...item, jumlah: item.jumlah - 1 } : item
                )
                : prev.filter((item) => item.id !== menu.id);
        });
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Pilih Menu</label>
            <div className="border border-gray-300 rounded-lg shadow-sm">
                {menu.map((item, index) => (
                    <div key={item.id}>
                        <div
                            className={`flex items-center justify-between px-4 py-3 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                } hover:bg-gray-100`}
                        >
                            <div className="text-sm font-medium text-gray-700">
                                {item.nama_menu} - <span className="text-gray-600">Rp {item.harga_menu}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="rounded-full bg-red-500 text-white px-2 py-1 text-sm hover:bg-red-600"
                                    aria-label="Kurangi Menu"
                                    onClick={() => removeMenu(item)}
                                >
                                    -
                                </button>
                                <span className="font-semibold text-gray-800">
                                    {selectedMenus.find((menu) => menu.id === item.id)?.jumlah || 0}
                                </span>
                                <button
                                    type="button"
                                    className="rounded-full bg-green-500 text-white px-2 py-1 text-sm hover:bg-green-600"
                                    aria-label="Tambah Menu"
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
    );
}
