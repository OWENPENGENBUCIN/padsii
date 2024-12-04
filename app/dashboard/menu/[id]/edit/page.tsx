import React from 'react';

import Breadcrumbs from '@/app/ui/menu/breadcrumbs';
import { Menu } from '@/app/lib/definitions';
import EditMenuForm from '@/app/ui/menu/edit-form';
import { fetchMenuById } from '@/app/lib/menu/cruds-menu';

export default async function MenuEditPage({ params }: { params: { id: string } }) {
  console.log('Params:', params);

  const { id } = params;

  if (!id) {
    return <div>Error: ID menu tidak ditemukan!</div>;
  }

  const menu = await fetchMenuById(id);

  if (!menu) {
    return <div>Error: Menu tidak ditemukan!</div>;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Menu', href: '/dashboard/menu' },
          {
            label: 'Edit Menu',
            href: `/dashboard/menu/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditMenuForm menu={menu} />
    </main>
  );
}

