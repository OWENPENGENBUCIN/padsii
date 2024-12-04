import Form from '@/app/ui/transaksi/create-form';
import Breadcrumbs from '@/app/ui/transaksi/breadcrumbs';
import { fetchMenus } from '@/app/lib/menu/menu';
import { fetchMembers } from '@/app/lib/member/member';
 
export default async function Page() {
  const menus = await fetchMenus();
  const members = await fetchMembers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Transaksi', href: '/dashboard/transaksi' },
          {
            label: 'Create Transaksi',
            href: '/dashboard/transaksi/create',
            active: true,
          },
        ]}
      />
      <Form menu={menus} member={members} />
    </main>
  );
}