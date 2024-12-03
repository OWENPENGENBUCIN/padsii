// 'use client';

// import { useFormState, useFormStatus } from 'react-dom';
// import { createMenu } from '@/app/lib/actions';
// import Link from 'next/link';
// import { CheckIcon, CurrencyDollarIcon, ClipboardIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
// import { Button } from '@/app/ui/button';

// // Define the form state type
// type State = {
//   message?: string;
//   errors?: {
//     nama?: string[];
//     harga?: string[];
//     deskripsi?: string[];
//   };
// };

// // Submit Button Component
// function SubmitButton() {
//   const { pending } = useFormStatus();
 
//   return (
//     <Button type="submit" aria-disabled={pending}>
//       {pending ? 'Creating...' : 'Create Menu'}
//     </Button>
//   );
// }

// export default function MenuCreateForm() {
//   const initialState: State = {
//     message: '',
//     errors: {},
//   };
  
//   const [state, dispatch] = useFormState(createMenu, initialState);

//   return (
//     <form action={dispatch} method="POST">
//       <div className="rounded-md bg-gray-50 p-4 md:p-6">
//         {/* Nama Menu */}
//         <div className="mb-4">
//           <label htmlFor="nama" className="mb-2 block text-sm font-medium">
//             Nama Menu
//           </label>
//           <div className="relative">
//             <input
//               id="nama"
//               name="nama"
//               type="text"
//               placeholder="Masukkan nama menu"
//               className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//               aria-describedby="nama-error"
//               required
//             />
//             <ClipboardIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
//           </div>
//           {state?.errors?.nama && (
//             <div id="nama-error" className="mt-2 text-sm text-red-500">
//               {state.errors.nama.map((error: string) => (
//                 <p key={error}>{error}</p>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Harga Menu */}
//         <div className="mb-4">
//           <label htmlFor="harga" className="mb-2 block text-sm font-medium">
//             Harga Menu
//           </label>
//           <div className="relative">
//             <input
//               id="harga"
//               name="harga"
//               type="number"
//               step="1"
//               placeholder="Masukkan harga menu (IDR)"
//               className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//               aria-describedby="harga-error"
//               required
//             />
//             <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
//           </div>
//           {state?.errors?.harga && (
//             <div id="harga-error" className="mt-2 text-sm text-red-500">
//               {state.errors.harga.map((error: string) => (
//                 <p key={error}>{error}</p>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Deskripsi Menu */}
//         <div className="mb-4">
//           <label htmlFor="deskripsi" className="mb-2 block text-sm font-medium">
//             Deskripsi Menu
//           </label>
//           <div className="relative">
//             <textarea
//               id="deskripsi"
//               name="deskripsi"
//               placeholder="Masukkan deskripsi menu"
//               className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//               rows={3}
//               aria-describedby="deskripsi-error"
//               required
//             />
//             <DocumentTextIcon className="pointer-events-none absolute left-3 top-4 h-[18px] w-[18px] text-gray-500" />
//           </div>
//           {state?.errors?.deskripsi && (
//             <div id="deskripsi-error" className="mt-2 text-sm text-red-500">
//               {state.errors.deskripsi.map((error: string) => (
//                 <p key={error}>{error}</p>
//               ))}
//             </div>
//           )}
//         </div>

//         {state?.message && (
//           <div className="mt-2 text-sm text-red-500">
//             <p>{state.message}</p>
//           </div>
//         )}
//       </div>
//       <div className="mt-6 flex justify-end gap-4">
//         <Link
//           href="/dashboard/menu"
//           className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
//         >
//           Cancel
//         </Link>
//         <SubmitButton />
//       </div>
//     </form>
//   );
// }