import React from 'react';
import { fetchMemberById } from '@/app/lib/member/cruds-member'; 
import Breadcrumbs from '@/app/ui/member/breadcrumbs';
import EditMemberForm from '@/app/ui/member/edit-form';

export default async function MemberEditPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const member = await fetchMemberById(id);

  if (!member) {
    return <div>Error: Member tidak ditemukan!</div>;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Member', href: '/dashboard/member' },
          {
            label: 'Edit Member',
            href: `/dashboard/member/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditMemberForm member={member} />
    </main>
  );
}
