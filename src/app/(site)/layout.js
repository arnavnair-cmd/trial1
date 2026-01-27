'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

import Heading from '@/components/Heading/Heading';
import Navigation_Bar from '@/components/Navigation/Navigation_Bar';

export default function SiteLayout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <>
      <Heading />
      <Navigation_Bar />
      {children}
    </>
  );
}
