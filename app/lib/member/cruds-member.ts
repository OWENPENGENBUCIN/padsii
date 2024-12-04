"use server";

import { sql } from "@vercel/postgres";
import { z } from "zod";
import { Member } from '@/app/lib/definitions';

const MemberSchema = z.object({
  nama_member: z.string().min(1, "Nama member harus diisi"),
  nohp_member: z
    .string()
    .min(10, "Nomor HP minimal 10 digit")
    .regex(/^\d+$/, "Nomor HP harus berupa angka"),
});

const EditMemberSchema = z.object({
    nama_member: z.string().min(1, 'Nama member harus diisi'),
    nohp_member: z.string().min(10, 'Nomor HP minimal 10 karakter'),
  });

export async function createMember(data: FormData) {
  const validation = MemberSchema.safeParse({
    nama_member: data.get("nama_member"),
    nohp_member: data.get("nohp_member"),
  });

  if (!validation.success) {
    return {
      success: false,
      message: "Validation Error: Please check your input.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { nama_member, nohp_member } = validation.data;

  try {
    await sql`
      INSERT INTO members (nama_member, nohp_member)
      VALUES (${nama_member}, ${nohp_member})
    `;

    return {
      success: true,
      message: "Member created successfully.",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      message: "Database Error: Failed to create member.",
    };
  }
}


export async function fetchMemberById(id: string): Promise<Member | null> {
  try {
    const result = await sql<Member>`
      SELECT id, nama_member, nohp_member
      FROM members
      WHERE id = ${id}
    `;

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error fetching member by ID:', error);
    return null;
  }
}

export async function editMember(id: string, data: { nama_member: string; nohp_member: string }) {
  const validation = EditMemberSchema.safeParse(data);

  if (!validation.success) {
    throw new Error('Validation Error');
  }

  const { nama_member, nohp_member } = validation.data;

  try {
    await sql`
      UPDATE members
      SET nama_member = ${nama_member}, nohp_member = ${nohp_member}
      WHERE id = ${id}
    `;
    console.log('Member updated successfully');
  } catch (error) {
    console.error('Error updating member:', error);
    throw new Error('Failed to update member');
  }
}

export async function deleteMember(id: string) {
    try {
      await sql`
        DELETE FROM members
        WHERE id = ${id}
      `;
    } catch (error) {
      console.error('Error deleting member:', error);
      throw new Error('Failed to delete member');
    }
  }

