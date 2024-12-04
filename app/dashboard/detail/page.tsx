// import Pagination from '@/app/ui/member/pagination';
// import Search from '@/app/ui/search';
// import detailtranskasiTable from '@/app/ui/detail/table';

// import { lusitana } from '@/app/ui/fonts';
// import { Suspense } from 'react';
// import { fetchDetailTransaksiPages, fetchFilteredDetailTransaksi} from '@/app/lib/transaksi';
// import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Daftar Member',
// };



// export default async function Page(
//   {
//   searchParams,
// }: {
//   searchParams?: {
//     query?: string;
//     page?: string;
//   };
// }) {
//   const query = searchParams?.query || '';
//   const currentPage = Number(searchParams?.page) || 1;
//   const totalPages = await fetchDetailTransaksiPages(query);
 
//   return (
//     <div className="w-full">
//       <div className="flex w-full items-center justify-between">
//         <h1 className={`${lusitana.className} text-2xl`}>Detail Transaksi</h1>
//       </div>
//       <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
//         <Search placeholder="Search transaksi..." />
//       </div>
//       {/* <fetch query={query} currentPage={currentPage} /> */}

//       <div className="mt-5 flex w-full justify-center">
//       </div>
//     </div>
//   );
// }
