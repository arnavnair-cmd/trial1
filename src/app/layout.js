'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      setRole(data?.role);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <html lang="en">
      <body>
        {/* NAVBAR */}
        {user && (
          <nav
            style={{
              display: 'flex',
              gap: '20px',
              padding: '15px',
              borderBottom: '1px solid #333',
              marginBottom: '30px',
            }}
          >
            <Link href="/">Home</Link>
            <Link href="/essays">Essays</Link>
            <Link href="/announcements">Announcements</Link>
            <Link href="/games">Games</Link>

            {role === 'admin' && (
              <Link href="/admin/announcements">Admin</Link>
            )}

            <button onClick={logout}>Logout</button>
          </nav>
        )}

        {children}
      </body>
    </html>
  );
}
