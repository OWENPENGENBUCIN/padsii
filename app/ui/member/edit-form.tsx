'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Member } from '@/app/lib/definitions';
import { UserCircleIcon, PhoneIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { editMember } from '@/app/lib/member/cruds-member';

type State = {
  message?: string;
  errors?: {
    nama_member?: string[];
    nohp_member?: string[];
  };
};

export default function EditMemberForm({ member }: { member: Member }) {
  const [state, setState] = useState<State>({ message: '', errors: {} });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setState({ message: '', errors: {} });
  
    const formData = new FormData(e.currentTarget);
  
    const data = {
      nama_member: formData.get('nama_member') as string,
      nohp_member: formData.get('nohp_member') as string,
    };
  
    try {
      await editMember(member.id, data);
  
      router.push('/dashboard/member');
    } catch (error: any) {
      console.error('Error updating member:', error);
      setState({
        message: error.message || 'An unexpected error occurred.',
        errors: error.errors || {},
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="namaMember" className="mb-2 block text-sm font-medium">
            Nama Member
          </label>
          <div className="relative">
            <input
              id="namaMember"
              name="nama_member"
              type="text"
              defaultValue={member.nama_member}
              placeholder="Masukkan nama member"
              className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.nama_member && (
            <div className="mt-2 text-sm text-red-500">
              {state.errors.nama_member.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="nohpMember" className="mb-2 block text-sm font-medium">
            Nomor HP
          </label>
          <div className="relative">
            <input
              id="nohpMember"
              name="nohp_member"
              type="text"
              defaultValue={member.nohp_member}
              placeholder="Masukkan nomor HP"
              className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.nohp_member && (
            <div className="mt-2 text-sm text-red-500">
              {state.errors.nohp_member.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/member"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" aria-disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Edit Member'}
        </Button>
      </div>
    </form>
  );
}
