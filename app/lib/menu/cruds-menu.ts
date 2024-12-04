"use server";

import { sql } from "@vercel/postgres";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextApiRequest, NextApiResponse } from "next";
import { Menu } from "../definitions";

const MenuSchema = z.object({
  nama: z.string().min(1, "Nama menu harus diisi"),
  harga: z.number().positive("Harga harus lebih dari 0"),
});

const EditMenuSchema = z.object({
  nama_menu: z.string().min(1, "Nama menu harus diisi"),
  harga_menu: z.number().positive("Harga harus lebih dari 0"),
});

const CreateMenuSchema = MenuSchema;

export async function createMenu(formData: FormData) {
  const validation = CreateMenuSchema.safeParse({
    nama: formData.get("nama"),
    harga: parseFloat(formData.get("harga") as string),
  });

  if (!validation.success) {
    return {
      message: "Validation Error: Please check your input.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { nama, harga } = validation.data;

  try {
    await sql`
      INSERT INTO menus (nama_menu, harga_menu)
      VALUES (${nama}, ${harga})
    `;

    revalidatePath("/dashboard/menu");
    redirect("/dashboard/menu");
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to create menu.",
    };
  }
}

export async function fetchMenuById(id: string): Promise<Menu | null> {
  try {
    console.log("Fetching menu with ID:", id);
    const result =
      await sql<Menu>`SELECT id, nama_menu, harga_menu FROM menus WHERE id = ${id}`;

    if (result.rows.length === 0) {
      console.error("Menu not found for ID:", id);
      return null;
    }

    console.log("Menu found:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching menu by ID:", error);
    return null;
  }
}

export async function editMenu(id: string, data: { nama_menu: string; harga_menu: number }) {
  if (!id) {
    throw new Error("Invalid ID format");
  }

  const validation = EditMenuSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      message: "Validation Error: Please check your input.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { nama_menu, harga_menu } = validation.data;

  try {
    await sql`
      UPDATE menus
      SET nama_menu = ${nama_menu}, harga_menu = ${harga_menu}
      WHERE id = ${id}
    `;

    return {
      success: true,
      message: "Menu updated successfully",
    };
  } catch (error) {
    console.error("Error updating menu:", error);
    return {
      success: false,
      message: "Failed to update menu",
    };
  }
}

export async function deleteMenu(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    await sql`DELETE FROM menus WHERE id = ${id}`;
    return { success: true };
  } catch (error) {
    console.error('Error deleting menu:', error);
    return { success: false, message: 'Failed to delete menu.' };
  }
}

