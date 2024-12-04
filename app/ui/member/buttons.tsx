'use client';
import { deleteMember } from '@/app/lib/member/cruds-member';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import DeleteMemberModal from './delete-member-modal';

export function CreateMemberButton() {
  return (
    <Link
      href="/dashboard/member/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Tambah Member</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateMemberButton({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/member/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteMemberButton({ id }: { id: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const response = await deleteMember(id);
    setIsModalOpen(false);
    window.location.reload();
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
        <DeleteMemberModal
          onDelete={handleDelete}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isLoading}
        />
      )}
    </>
  );
}