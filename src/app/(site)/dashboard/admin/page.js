'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './AdminDashboard.module.css';

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
    <div className={styles.adminContainer}>
      <h1 className={styles.adminTitle}>Admin Control Panel</h1>

      <div className={styles.adminGrid}>

        <Link href="/admin/announcements" className={styles.adminCard}>
          <div className={styles.icon}>📢</div>
          <h3>Manage Announcements</h3>
          <p>Create, edit and remove announcements</p>
        </Link>

        <Link href="/dashboard/admin/crosswords" className={styles.adminCard}>
          <div className={styles.icon}>🧩</div>
          <h3>Manage Crosswords</h3>
          <p>Edit puzzles and crossword content</p>
        </Link>

        <Link href="/admin/essays" className={styles.adminCard}>
          <div className={styles.icon}>📝</div>
          <h3>Moderate Essays</h3>
          <p>Review and approve essay submissions</p>
        </Link>

        <Link href="/dashboard/admin/rebusted" className={styles.adminCard}>
          <div className={styles.icon}>🎮</div>
          <h3>ReBusted Admin</h3>
          <p>Manage game content and answers</p>
        </Link>

      </div>
    </div>
  );
}
