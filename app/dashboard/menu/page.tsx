import Pagination from '@/app/ui/menu/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/menu/table';
import { CreateMenuButton} from '@/app/ui/menu/buttons';

import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { fetchMenuPages } from '@/app/lib/menu/menu';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daftar Menu',
};

export default async function MenuPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchMenuPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Daftar Menu</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Cari Menu..." />
        <CreateMenuButton />
      </div>
      <Suspense key={query + currentPage}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} currentPage={currentPage} query={query} />
      </div>
    </div>
  );
}
