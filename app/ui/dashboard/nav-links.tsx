'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentIcon, // You can remove this if not used
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Updated map of links to display in the side navigation.
const links = [
  { name: 'home', href: '/dashboard', icon: HomeIcon },
  { name: 'Menu', href: '/dashboard/menu', icon: UserGroupIcon }, 
  { name: 'Member', href: '/dashboard/member', icon: UserGroupIcon },
  { name: 'Transaksi', href: '/dashboard/transaksi', icon: DocumentDuplicateIcon },  
  { name: 'Laporan', href: '/dashboard/laporan', icon: ClipboardDocumentIcon },  
  
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex items-center gap-2 rounded-md p-3 text-sm font-medium transition-colors',
              {
                'bg-blue-500 text-white': pathname === link.href,
                'hover:bg-blue-100': pathname !== link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </>
  );
}