'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from "./Announcements.module.css";

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
    <div className={styles.page}>
      <div className={styles.mainWrap}>
        <h1 className={styles.heading}>Announcements</h1>

        {announcements.length === 0 && (
          <p>No announcements yet.</p>
        )}

        {announcements.map((a) => (
          <div key={a.id} className={styles.announcement}>
            <h3 className={styles.annTitle}>{a.title}</h3>
            <p>{a.message}</p>
            <small>
              {new Date(a.created_at).toLocaleString('en-IN')}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}