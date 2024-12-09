import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { members, users, transaksis, menus } from '../lib/placeholder-data';

const client = await db.connect();

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

async function seedMembers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS members (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      nama_member VARCHAR(255) NOT NULL,
      nohp_member VARCHAR(255) NOT NULL,
      referral_count INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedMembers = await Promise.all(
    members.map(
      (member) => client.sql`
        INSERT INTO members (nama_member, nohp_member)
        VALUES (${member.nama_member}, ${member.nohp_member})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedMembers;
}

async function seedMenu() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS menus (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      nama_menu VARCHAR(255) NOT NULL,
      harga_menu DECIMAL(15,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedMenu = await Promise.all(
    menus.map(
      (menu) => client.sql`
        INSERT INTO menus (nama_menu, harga_menu)
        VALUES (${menu.nama_menu}, ${menu.harga_menu})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedMenu;
}

async function seedTransaksi() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS transaksis (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      member_nama VARCHAR(255) NOT NULL,
      tanggal_transaksi DATE NOT NULL,
      total_harga DECIMAL(15,2) NOT NULL,
      pembayaran DECIMAL(15,2) NOT NULL,
      kembalian DECIMAL(15,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedTransaksi = await Promise.all(
    transaksis.map(
      (transaksi) => client.sql`
        INSERT INTO transaksis (member_nama, tanggal_transaksi, total_harga, pembayaran, kembalian)
        VALUES (${transaksi.member_nama}, ${transaksi.tanggal_transaksi}, ${transaksi.total_harga}, ${transaksi.pembayaran}, ${transaksi.kembalian})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedTransaksi;
}

async function seedTransaksiMenus() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS transaksi_menus (
      id SERIAL PRIMARY KEY,
      transaksi_id UUID REFERENCES transaksis(id) ON DELETE CASCADE,
      menu_id UUID REFERENCES menus(id) ON DELETE CASCADE,
      jumlah INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await seedMembers();
    await seedMenu();
    await seedTransaksi();
    await seedTransaksiMenus();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
