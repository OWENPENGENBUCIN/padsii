'use server';
 
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
 
// const MenuSchema = z.object({
//   nama: z.string().min(1, 'Nama menu harus diisi'),
//   harga: z.number().positive('Harga harus lebih dari 0'),
//   deskripsi: z.string().min(1, 'Deskripsi menu harus diisi'),
// });

// const MemberSchema = z.object({
//   nama_member: z.string(),
//   nohp_member: z.string(),
// });



// const UpdateTransaksi = TransaksiSchema.omit({});


// const CreateMenu = MenuSchema.omit({}); // Assuming no need to omit fields for creation
// const UpdateMenu = MenuSchema.omit({}); // Assuming you allow all fields to be updated

// export async function createMenu(prevState: any, formData: FormData) {
//   // Validasi input
//   try {
//     const validatedFields = CreateMenu.safeParse({
//       nama: formData.get('nama'),
//       harga: parseFloat(formData.get('harga') as string),
//       deskripsi: formData.get('deskripsi'),
//     });

//     if (!validatedFields.success) {
//       return {
//         message: 'Invalid form data. Please check your input.',
//         errors: validatedFields.error.flatten().fieldErrors,
//       };
//     }

//     const { nama, harga, deskripsi } = validatedFields.data;

//     await sql`
//       INSERT INTO menu (nama, harga, deskripsi)
//       VALUES (${nama}, ${harga}, ${deskripsi})
//     `;

//     revalidatePath('/dashboard/menu');
//     redirect('/dashboard/menu');
//   } catch (error) {
//     console.error('Database Error:', error);
//     return {
//       message: 'Database Error: Failed to Create Menu.',
//     };
//   }
// }

// export async function updateMenu(id: string, formData: FormData) {
//   const { nama, harga, deskripsi } = UpdateMenu.parse({
//     nama: formData.get('nama') as string,
//     harga: parseFloat(formData.get('harga') as string),
//     deskripsi: formData.get('deskripsi') as string,
//   });

//   try {
//     await sql`
//       UPDATE menu
//       SET nama = ${nama}, harga = ${harga}, deskripsi = ${deskripsi}
//       WHERE id = ${id}
//     `;
//   } catch (error) {
//     console.error('Database Error:', error);
//     return { message: 'Database Error: Failed to Update Menu.' };
//   }

//   revalidatePath('/dashboard/menu');
//   redirect('/dashboard/menu');
// }

// // Delete Menu
// export async function deleteMenu(id: string) {
//   try {
//     await sql`DELETE FROM menu WHERE id = ${id}`;
//     revalidatePath('/dashboard/menu');
//     return { message: 'Deleted Menu.' };
//   } catch (error) {
//     console.error('Database Error:', error);
//     return { message: 'Database Error: Failed to Delete Menu.' };
//   }
// }
 

// const CreateMember = MemberSchema.omit({id: true});

// export async function createMember(formData: FormData) {
//   const { nama_member, nohp_member } = CreateMember.parse({
//     nama_member: formData.get('nama_member') as string,
//     nohp_member: formData.get('nohp_member') as string,
//   });

//   try {
//     await sql`
//       INSERT INTO member (nama_member, nohp_member)
//       VALUES (${nama_member}, ${nohp_member})
//     `;
//   } catch (error) {
//     console.error('Database Error:', error);
//     return { message: 'Database Error: Failed to Create Member.' };
//   }

//   revalidatePath('/dashboard/member');
//   redirect('/dashboard/member');
// }


const TransaksiSchema = z.object({
  id:z.string(),
  member_nama:z.string(),
  tanggal_transaksi: z.string(),
  total_harga: z.number(),
  pembayaran:z.number(),
  kembalian:z.number(),
});

const CreateTransaksi = TransaksiSchema.omit({ id: true });

export async function createTransaksi(formData: FormData) {
  const { member_nama, tanggal_transaksi, total_harga, pembayaran, kembalian } =
    CreateTransaksi.parse({
      member_nama: formData.get("member_nama"),
      tanggal_transaksi: new Date().toISOString().split("T")[0],
      total_harga: Number(formData.get("total_harga")), // Pastikan tipe number
      pembayaran: Number(formData.get("pembayaran")), // Pastikan tipe number
      kembalian: Number(formData.get("kembalian")), // Pastikan tipe number
    });
 
 
  try {
    console.log(member_nama,tanggal_transaksi,total_harga,pembayaran,kembalian)
    await sql`
      INSERT INTO transaksis (member_nama, tanggal_transaksi,total_harga ,pembayaran, kembalian)
      VALUES (${member_nama}, ${tanggal_transaksi},${total_harga}, ${pembayaran}, ${kembalian})
    `;
    console.log('success')
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create transaksis.',
    };
  }
 
  revalidatePath('/dashboard/transaksi');
  redirect('/dashboard/transaksi');
}



export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
