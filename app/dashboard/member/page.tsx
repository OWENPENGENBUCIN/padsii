import Pagination from '@/app/ui/member/pagination';
import Search from '@/app/ui/search';
import MemberTable from '@/app/ui/member/table';
import { CreateMemberButton } from '@/app/ui/member/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { fetchMemberPages } from '@/app/lib/member/member';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daftar Member',
};

export default async function MemberPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchMemberPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Daftar Member</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Cari Member..." />
        <CreateMemberButton />
      </div>
      <Suspense key={query + currentPage}>
        <MemberTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} currentPage={currentPage} query={query} />
      </div>
    </div>
  );
}
