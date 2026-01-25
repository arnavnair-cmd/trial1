'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function AdminAnnouncements() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
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

  async function createAnnouncement(e) {
    e.preventDefault();

    const { error } = await supabase.from('announcements').insert({
      title,
      message,
    });

    if (error) {
      alert('Only admins can create announcements');
      return;
    }

    setTitle('');
    setMessage('');
    fetchAnnouncements();
  }

  return (
    <div style={{ padding: '40px', maxWidth: '700px', margin: 'auto' }}>
      <h1>Admin Announcements</h1>

      <form onSubmit={createAnnouncement}>
        <input
          placeholder="Announcement title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Announcement message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button type="submit">Post Announcement</button>
      </form>

      <hr />

      {announcements.map((a) => (
        <div key={a.id} style={{ marginBottom: '20px' }}>
          <h3>{a.title}</h3>
          <p>{a.message}</p>
          <small>
            {new Date(a.created_at).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </small>
        </div>
      ))}
    </div>
  );
}
