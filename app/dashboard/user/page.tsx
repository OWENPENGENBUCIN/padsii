// import Search from '@/app/ui/search';
// import Pagination from '@/app/ui/user/pagination';
// import UserTable from '@/app/ui/user/table';
// import { fetchUserPages } from '@/app/lib/transaksi/transaksi';

// import { lusitana } from '@/app/ui/fonts';


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
//   const totalPages = await fetchUserPages(query);
 
//   return (
//     <div className="w-full">
//       <div className="flex w-full items-center justify-between">
//         <h1 className={`${lusitana.className} text-2xl`}>User</h1>
//       </div>
//       <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
//         <Search placeholder="Search transaksi..." />
//       </div>
//         <UserTable query={query} currentPage={currentPage} />
//       <div className="mt-5 flex w-full justify-center">
//       </div>
//     </div>
//   );
// }
