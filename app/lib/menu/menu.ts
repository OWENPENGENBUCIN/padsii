import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { MenuTable } from "../definitions";

const ITEMS_PER_PAGE = 10;

export async function fetchFilteredMenu(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const menu = await sql<MenuTable>`
        SELECT DISTINCT
          menus.id,
          menus.nama_menu,
          menus.harga_menu,
          menus.created_at
        FROM menus
        WHERE
          menus.nama_menu ILIKE ${`%${query}%`} OR
          menus.harga_menu::text ILIKE ${`%${query}%`}
        ORDER BY menus.created_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;

    return menu.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Menu.");
  }
}

export async function fetchMenuPages(query: string) {
  try {
    const count = await sql`
        SELECT COUNT(DISTINCT menus.nama_menu)
        FROM menus
        WHERE
          menus.nama_menu ILIKE ${`%${query}%`} OR
          menus.harga_menu::text ILIKE ${`%${query}%`}
      `;

    return Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of Menu.");
  }
}

export async function fetchMenus() {
  try {
    const menus = await sql<MenuTable>`
        SELECT 
        menus.id, 
        menus.nama_menu, 
        menus.harga_menu ,
        menus.created_at
        FROM menus
        ORDER BY menus.nama_menu
      `;
    return menus.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch menus.");
  }
}
