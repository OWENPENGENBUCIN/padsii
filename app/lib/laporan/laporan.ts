import { createPool } from "@vercel/postgres";
import { Laporan } from "../definitions";

const pool = createPool({
  connectionString:
    process.env.POSTGRES_URL ||
    "postgres://default:XCD7NUecGPS4@ep-gentle-bar-a4iyh4a0-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
});

export async function fetchLaporanByMonth(month: number): Promise<Laporan[]> {
  try {
    const laporan = await pool.sql<Laporan>` 
      SELECT 
        t.id AS transaksi_id,
        t.member_nama,
        t.tanggal_transaksi,
        t.total_harga,
        t.pembayaran,
        t.kembalian,
        tm.jumlah,
        m.nama_menu,
        (tm.jumlah * m.harga_menu) AS total_menu_harga
      FROM 
        transaksis t
      JOIN 
        transaksi_menus tm ON t.id = tm.transaksi_id
      JOIN 
        menus m ON tm.menu_id = m.id
      WHERE 
        EXTRACT(MONTH FROM t.tanggal_transaksi) = ${month}
      ORDER BY t.tanggal_transaksi DESC;
    `;

    return laporan.rows.map((row) => ({
      ...row,
      tanggal_transaksi: new Date(row.tanggal_transaksi).toISOString().split("T")[0],
    })) as Laporan[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Gagal mengambil data laporan.");
  }
}
