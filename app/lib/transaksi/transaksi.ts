
import { unstable_noStore as noStore } from "next/cache";
import { sql } from "@vercel/postgres";
import { TransaksiTable } from "../definitions";

const ITEMS_PER_PAGE = 10;

export async function fetchFilteredTransaksi(
  query: string,
  currentPage: number
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const transaksis = await sql<TransaksiTable>`
      SELECT DISTINCT
        transaksis.id,
        transaksis.member_nama,
        transaksis.tanggal_transaksi,
        transaksis.total_harga,
        transaksis.pembayaran,
        transaksis.kembalian,
        transaksis.created_at
      FROM transaksis
      WHERE                                                                                                                                                                                            
        transaksis.member_nama ILIKE ${`%${query}%`} OR
        transaksis.member_nama IS NULL OR
        transaksis.tanggal_transaksi::text ILIKE ${`%${query}%`} OR
        transaksis.total_harga::text ILIKE ${`%${query}%`} OR
        transaksis.pembayaran::text ILIKE ${`%${query}%`} OR
        transaksis.kembalian::text ILIKE ${`%${query}%`}
      ORDER BY transaksis.created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return transaksis.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Transaksi.");
  }
}

export async function fetchTransaksiPages(query: string) {
  try {
    const count = await sql`
      SELECT COUNT(DISTINCT transaksis.id) AS count
      FROM transaksis
      WHERE
        transaksis.member_nama ILIKE ${`%${query}%`} OR
        transaksis.tanggal_transaksi::text ILIKE ${`%${query}%`} OR
        transaksis.total_harga::text ILIKE ${`%${query}%`} OR
        transaksis.pembayaran::text ILIKE ${`%${query}%`} OR
        transaksis.kembalian::text ILIKE ${`%${query}%`}
    `;

    return Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of Transaksi.");
  }
}

export async function createTransaksi(data: {
  selectedMenus: { id_menu: string; jumlah: number }[];
  selectedMember: string | null;
  totalHarga: number;
  pembayaran: number;
  tanggalTransaksi: string;
  referralPhone: string | null;
}): Promise<{ success: boolean; message: string }> {
  try {
    const {
      selectedMenus,
      selectedMember,
      totalHarga,
      pembayaran,
      tanggalTransaksi,
      referralPhone,
    } = data;

    if (!selectedMenus || selectedMenus.length === 0) {
      throw new Error("Minimal harus memilih 1 menu.");
    }

    if (pembayaran < totalHarga) {
      throw new Error("Pembayaran kurang.");
    }

    let referredMemberId: string | null = null;
    if (referralPhone) {
      const referralResult = await sql`
        SELECT id
        FROM members
        WHERE nohp_member = ${referralPhone}
      `;

      if (referralResult.rows.length === 0) {
        throw new Error("Kode referral tidak valid. Nomor HP tidak ditemukan.");
      }

      referredMemberId = referralResult.rows[0].id;

      if (selectedMember && referredMemberId === selectedMember) {
        throw new Error(
          "Kode referral tidak valid. Nomor HP harus milik anggota lain."
        );
      }
    }

    const transaksiResult = await sql`
      INSERT INTO transaksis (member_id, tanggal_transaksi, total_harga, pembayaran, kembalian, referral_phone)
      VALUES (
        ${selectedMember || null},
        ${tanggalTransaksi},
        ${totalHarga},
        ${pembayaran},
        ${pembayaran - totalHarga},
        ${referralPhone || null}
      )
      RETURNING id
    `;

    const transaksiId = transaksiResult.rows[0].id;

    for (const menu of selectedMenus) {
      await sql`
        INSERT INTO transaksi_menus (transaksi_id, menu_id, jumlah)
        VALUES (${transaksiId}, ${menu.id_menu}, ${menu.jumlah})
      `;
    }

    return { success: true, message: "Transaksi berhasil dibuat." };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal membuat transaksi.";
    console.error("Error saat membuat transaksi:", errorMessage);
    throw new Error(errorMessage);
  }
}

