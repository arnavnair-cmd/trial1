'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function protectAdmin() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setLoading(false);
    }

    protectAdmin();
  }, []);

  if (loading) return <p>Loading admin tools...</p>;

  return (
    <div>
      <h1>Admin Control Panel</h1>

      <ul style={{ marginTop: '20px' }}>
        <li>
          <Link href="/admin/announcements">📢 Manage Announcements</Link>
        </li>

        <li>
          <Link href="/dashboard/admin/crosswords">🧩 Manage Crosswords</Link>
        </li>

        <li>
          <Link href="/admin/essays">📝 Moderate Essays</Link>
        </li>

        <li>
          <Link href="/dashboard/admin/rebusted">🎮 ReBusted Admin</Link>
        </li>
      </ul>

    </div>
  );
}
