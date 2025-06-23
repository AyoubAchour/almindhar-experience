'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOutAction } from '@/app/actions';
import { useProfile } from '@/contexts/ProfileContext';

interface ClientHeaderUserMenuProps {
  email: string;
}

export default function ClientHeaderUserMenu({ email }: ClientHeaderUserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { profile } = useProfile();

  const toggle = () => setOpen((prev) => !prev);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref} data-header-profile>
      <button onClick={toggle} className="flex items-center">
        {profile?.avatar_url ? (
          <Image src={profile.avatar_url} alt="Avatar" width={36} height={36} className="rounded-full aspect-square object-cover border border-gray-300" style={{ width: 36, height: 36 }} />
        ) : (
          <div className="w-9 h-9 bg-gray-300 rounded-full" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg overflow-hidden z-10">
          <Link href="/protected/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
            Mon Profil
          </Link>
          <form action={signOutAction}>
            <button type="submit" className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
              Se déconnecter
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
