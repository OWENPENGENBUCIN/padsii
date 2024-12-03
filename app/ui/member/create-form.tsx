import Link from 'next/link';
import { UserCircleIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createMember } from '@/app/lib/actions';
import { MemberTable } from '@/app/lib/definitions';

export default function Form({ member }: { member: MemberTable[] }) {
    return (
        <form action={createMember}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Nama Member */}
                <div className="mb-4">
                    <label htmlFor="nama_member" className="block text-sm font-medium mb-2">
                        Name
                    </label>
                    <div className="relative">
                        <input
                            id="nama_member"
                            name="nama_member"
                            type="text"
                            placeholder="Nama Member"
                            className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder-gray-500"
                        />
                        <UserCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                {/* Nomor HP Member */}
                <div className="mb-4">
                    <label htmlFor="nohp_member" className="block text-sm font-medium mb-2">
                        Phone Number
                    </label>
                    <div className="relative">
                        <input
                            id="nohp_member"
                            name="nohp_member"
                            type="text"
                            placeholder="Nomor HP"
                            className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder-gray-500"
                        />
                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/member"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Create Member</Button>
            </div>
        </form>
    );
}
