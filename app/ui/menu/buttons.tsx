'use client';

import { deleteMenu } from '@/app/lib/menu/cruds-menu';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import DeleteMenuModal from './delete-menu-modal';

export function CreateMenuButton() {
  return (
    <Link
      href="/dashboard/menu/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Tambah Menu</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateMenuButton({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/menu/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteMenuButton({ id }: { id: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const response = await deleteMenu(id);

    if (response.success) {
      setIsModalOpen(false);
      window.location.reload();
    } else {
      alert(response.message || 'Gagal menghapus menu.');
    }
    setIsLoading(false);
  };

  return (
    <>
      <button
        className="rounded-md border p-2 hover:bg-gray-100"
        onClick={() => setIsModalOpen(true)}
      >
        <TrashIcon className="w-5" />
      </button>

      {isModalOpen && (
        <DeleteMenuModal
          onDelete={handleDelete}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isLoading}
        />
      )}
    </>
  );
}
