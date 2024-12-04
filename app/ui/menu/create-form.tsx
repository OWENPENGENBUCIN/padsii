'use client';

import React, { useState } from 'react';
import { createMenu } from '@/app/lib/menu/cruds-menu';
import Link from 'next/link';
import { CurrencyDollarIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useRouter } from 'next/navigation';

type State = {
  message?: string;
  errors?: {
    nama?: string[];
    harga?: string[];
  };
};

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button type="submit" aria-disabled={isLoading}>
      {isLoading ? 'Creating...' : 'Create Menu'}
    </Button>
  );
}

export default function MenuCreateForm() {
  const [state, setState] = useState<State>({ message: '', errors: {} });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form target:', e.currentTarget);
  
    setIsLoading(true);
    setState({ message: '', errors: {} });
  
    const formData = new FormData(e.currentTarget);
  
    try {
      const response = await createMenu(formData);
      if (response.errors) {
        setState({ message: response.message, errors: response.errors });
      } else {
        router.push('/dashboard/menu');
      }
    } catch (error) {
      console.error('Error creating menu:', error);
      setState({ message: 'An unexpected error occurred.', errors: {} });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="nama" className="mb-2 block text-sm font-medium">
            Nama Menu
          </label>
          <div className="relative">
            <input
              id="nama"
              name="nama"
              type="text"
              placeholder="Masukkan nama menu"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="nama-error"
              required
            />
            <ClipboardIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.nama && (
            <div id="nama-error" className="mt-2 text-sm text-red-500">
              {state.errors.nama.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="harga" className="mb-2 block text-sm font-medium">
            Harga Menu
          </label>
          <div className="relative">
            <input
              id="harga"
              name="harga"
              type="number"
              step="1"
              placeholder="Masukkan harga menu (IDR)"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="harga-error"
              required
            />
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.harga && (
            <div id="harga-error" className="mt-2 text-sm text-red-500">
              {state.errors.harga.map((error) => (
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
        <SubmitButton isLoading={isLoading} />
      </div>
    </form>
  );
}
