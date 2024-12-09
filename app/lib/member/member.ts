import { sql } from "@vercel/postgres";
import { MemberTable } from "../definitions";
import { unstable_noStore as noStore } from "next/cache";

const ITEMS_PER_PAGE = 10;

export async function fetchFilteredMembers(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const members = await sql<MemberTable>`
       SELECT 
        members.id,
        members.nama_member,
        members.nohp_member,
        members.referral_count,
        members.created_at
      FROM members
      WHERE
        members.nama_member ILIKE ${`%${query}%`} OR
        members.nohp_member ILIKE ${`%${query}%`}
      ORDER BY members.created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return members.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch members.");
  }
}

export async function fetchMemberPages(query: string) {
  try {
    const count = await sql`
        SELECT COUNT(DISTINCT members.nama_member)
        FROM members
        WHERE
          members.nama_member ILIKE ${`%${query}%`} OR
          members.nohp_member ILIKE ${`%${query}%`}
      `;

    return Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of members.");
  }
}

export async function fetchMembers() {
  try {
    const members = await sql<MemberTable>`
      SELECT 
      members.id, 
      members.nama_member, 
      members.nohp_member, 
      members.referral_count,
      members.created_at
      FROM members
      ORDER BY members.created_at DESC
    `;
    return members.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch menus.");
  }
}
