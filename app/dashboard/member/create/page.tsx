import React from 'react';
import MemberCreateForm from '@/app/ui/member/create-form';
import Breadcrumbs from '@/app/ui/member/breadcrumbs';
import { MemberTable } from '@/app/lib/definitions';

export default function MemberCreatePage() {
  const members: MemberTable[] = [];

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Member', href: '/dashboard/member' },
          {
            label: 'Create Member',
            href: '/dashboard/member/create',
            active: true,
          },
        ]}
      />
      <MemberCreateForm  />
    </main>
  );
}
