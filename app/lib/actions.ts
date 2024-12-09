"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

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
  id: z.string(),
  member_nama: z.string(),
  tanggal_transaksi: z.string(),
  total_harga: z.number(),
  pembayaran: z.number(),
  kembalian: z.number(),
});

const CreateTransaksi = TransaksiSchema.omit({ id: true });

export async function createTransaksi(
  formData: FormData,
  selectedMenus: { id: string; jumlah: number }[]
) {
  let { member_nama, tanggal_transaksi, total_harga, pembayaran, kembalian } =
    CreateTransaksi.parse({
      member_nama: formData.get("member_nama"),
      tanggal_transaksi: new Date().toISOString().split("T")[0],
      total_harga: Number(formData.get("total_harga")),
      pembayaran: Number(formData.get("pembayaran")),
      kembalian: Number(formData.get("kembalian")),
    });

  console.log("Data Transaksi:", {
    member_nama,
    tanggal_transaksi,
    total_harga,
    pembayaran,
    kembalian,
  });
  console.log("Data Menu:", selectedMenus);

  if (!selectedMenus || selectedMenus.length === 0) {
    throw new Error("Minimal harus memilih 1 menu.");
  }

  try {
    await sql`BEGIN`;

    const memberId = formData.get("member_id") as string;
    const referralPhone = formData.get("referralPhone") as string | null;

    if (memberId) {
      const memberResult = await sql`
        SELECT referral_count
        FROM members
        WHERE id = ${memberId};
      `;

      const referralCount = memberResult.rows[0]?.referral_count || 0;

      if (referralCount >= 3) {
        total_harga *= 0.7;
        const remainingCount = referralCount - 3;
        await sql`
          UPDATE members
          SET referral_count = ${remainingCount}
          WHERE id = ${memberId};
        `;
      }
    }

    if (referralPhone) {
      const referralResult = await sql`
        SELECT id, referral_count
        FROM members
        WHERE nohp_member = ${referralPhone};
      `;

      if (referralResult.rows.length === 0) {
        throw new Error("Kode referral tidak valid. Nomor HP tidak ditemukan.");
      }

      const { id: referredMemberId, referral_count: referralCount } =
        referralResult.rows[0];

      const newReferralCount = referralCount + 1;
      await sql`
        UPDATE members
        SET referral_count = ${newReferralCount}
        WHERE id = ${referredMemberId};
      `;
    }

    const transaksiResult = await sql`
      INSERT INTO transaksis (member_nama, tanggal_transaksi, total_harga, pembayaran, kembalian)
      VALUES (${member_nama}, ${tanggal_transaksi}, ${total_harga}, ${pembayaran}, ${kembalian})
      RETURNING id;
    `;

    const transaksiId = transaksiResult.rows[0]?.id;

    if (!transaksiId) {
      throw new Error("Gagal mendapatkan ID transaksi.");
    }

    console.log("Transaksi ID:", transaksiId);

    for (const menu of selectedMenus) {
      if (!menu.id) {
        throw new Error(`Menu ID tidak ditemukan untuk item: ${menu}`);
      }

      console.log("Inserting Menu:", menu);

      await sql`
        INSERT INTO transaksi_menus (transaksi_id, menu_id, jumlah)
        VALUES (${transaksiId}, ${menu.id}, ${menu.jumlah});
      `;
    }

    await sql`COMMIT`;
    console.log("Transaksi berhasil dibuat:", transaksiId);

    return {
      success: true,
      message: "Transaksi berhasil dibuat.",
    };
  } catch (error) {
    await sql`ROLLBACK`;
    console.error("Database Error:", error);
    throw new Error("Gagal membuat transaksi.");
  }
}




export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
