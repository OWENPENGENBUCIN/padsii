import Pagination from '@/app/ui/transaksi/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/transaksi/table';
import { CreateTransaksiButton } from '@/app/ui/transaksi/buttons';

import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { fetchTransaksiPages } from '@/app/lib/transaksi/transaksi';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daftar Menu',
};

export default async function TransaksiPage({
  searchParams,
}: {
  searchParams?: Record<string, string | undefined>;
}) {
  const query = searchParams?.query ?? ""; 
  const currentPage = Number(searchParams?.page ?? 1); 

  const totalPages = await fetchTransaksiPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Transaksi</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Cari transaksi..." />
        <CreateTransaksiButton />
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


