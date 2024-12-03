'use client';

import { MenuField, MenuForm } from '@/app/lib/definitions';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

export default function EditMenuForm({
  menu,
}: {
  menu: MenuForm;
}) {
  return (
    <form>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Nama Menu */}
        <div className="mb-4">
          <label htmlFor="namaMenu" className="mb-2 block text-sm font-medium">
            Nama Menu
          </label>
          <input
            id="namaMenu"
            name="nama_menu"
            type="text"
            defaultValue={menu.nama_menu}
            placeholder="Masukkan nama menu"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        {/* Harga Menu */}
        <div className="mb-4">
          <label htmlFor="hargaMenu" className="mb-2 block text-sm font-medium">
            Harga Menu
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="hargaMenu"
              name="harga_menu"
              type="number"
              step="0.01"
              defaultValue={menu.harga_menu}
              placeholder="Masukkan harga menu"
              className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/menu"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Menu</Button>
      </div>
    </form>
  );
}
