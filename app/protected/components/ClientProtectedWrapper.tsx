'use client';

import dynamic from 'next/dynamic';

const ProtectedContent = dynamic(() => import('./ProtectedContent'), { ssr: false });

export default function ClientProtectedWrapper() {
  return <ProtectedContent />;
}
