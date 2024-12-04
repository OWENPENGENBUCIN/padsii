'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from '@/app/lib/definitions';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { editMenu } from '@/app/lib/menu/cruds-menu';

type State = {
  message?: string;
  errors?: {
    nama_menu?: string[];
    harga_menu?: string[];
  };
};

export default function EditMenuForm({ menu }: { menu: Menu }) {
  const [state, setState] = useState<State>({ message: '', errors: {} });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setState({ message: '', errors: {} });

    const formData = new FormData(e.currentTarget);

    const data = {
      nama_menu: formData.get('nama_menu') as string,
      harga_menu: Number(formData.get('harga_menu')),
    };

    try {
      const response = await editMenu(menu.id, data);

      if (!response.success) {
        setState({
          message: response.message || 'Failed to update menu.',
          errors: response.errors || {},
        });
      } else {
        router.push('/dashboard/menu');
      }
    } catch (error) {
      console.error('Error updating menu:', error);
      setState({ message: 'An unexpected error occurred.', errors: {} });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
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
          {state.errors?.nama_menu && (
            <div className="mt-2 text-sm text-red-500">
              {state.errors.nama_menu.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

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
          {state.errors?.harga_menu && (
            <div className="mt-2 text-sm text-red-500">
              {state.errors.harga_menu.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        {state.message && (
          <div className={`mt-2 text-sm ${state.message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            <p>{state.message}</p>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/menu"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" aria-disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Edit Menu'}
        </Button>
      </div>
    </form>
  );
}
