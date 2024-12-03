import { unstable_noStore as noStore } from 'next/cache';
import { sql } from '@vercel/postgres';
import { TransaksiTable } from './definitions';

const ITEMS_PER_PAGE = 10;

export async function fetchFilteredTransaksi(query: string, currentPage: number) {
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
        transaksis.kembalian
      FROM transaksis
      WHERE
        transaksis.member_nama ILIKE ${`%${query}%`} OR
        transaksis.member_nama IS NULL OR
        transaksis.tanggal_transaksi::text ILIKE ${`%${query}%`} OR
        transaksis.total_harga::text ILIKE ${`%${query}%`} OR
        transaksis.pembayaran::text ILIKE ${`%${query}%`} OR
        transaksis.kembalian::text ILIKE ${`%${query}%`}
      ORDER BY transaksis.tanggal_transaksi DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    console.log('Transaksi fetched:', transaksis.rows); // Debugging
    return transaksis.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Transaksi.');
  }
}

export async function fetchTransaksiPages(query: string) {
  try {
    const count = await sql`
      SELECT COUNT(DISTINCT transaksis.id)
      FROM transaksis
      WHERE
        transaksis.member_nama ILIKE ${`%${query}%`} OR
        transaksis.member_nama IS NULL OR
        transaksis.tanggal_transaksi::text ILIKE ${`%${query}%`} OR
        transaksis.total_harga::text ILIKE ${`%${query}%`} OR
        transaksis.pembayaran::text ILIKE ${`%${query}%`} OR
        transaksis.kembalian::text ILIKE ${`%${query}%`}
    `;

    return Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of Transaksi.');
  }
}
