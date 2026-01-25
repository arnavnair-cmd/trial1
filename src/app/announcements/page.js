'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    setAnnouncements(data || []);
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1>Announcements</h1>

      {announcements.length === 0 && (
        <p>No announcements yet.</p>
      )}

      {announcements.map((a) => (
        <div key={a.id} style={{ marginBottom: '20px' }}>
          <h3>{a.title}</h3>
          <p>{a.message}</p>
          <small>
            {new Date(a.created_at).toLocaleString('en-IN')}
          </small>
        </div>
      ))}
    </div>
  );
}
