import React from 'react';
import MenuCreateForm from '@/app/ui/menu/create-form';
import Breadcrumbs from '@/app/ui/menu/breadcrumbs';
import { MenuTable } from '@/app/lib/definitions';

export default function MenuCreatePage() {
  const menu: MenuTable[] = [];

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Menu', href: '/dashboard/menu' },
          {
            label: 'Create Menu',
            href: '/dashboard/menu/create',
            active: true,
          },
        ]}
      />
      <MenuCreateForm menus={menu} />
    </main>
  );
}
