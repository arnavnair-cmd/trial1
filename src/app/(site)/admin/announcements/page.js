'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabase';

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
    6
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
  async function deleteAnnouncement(id) {
    const confirmDelete = confirm(
      'Are you sure you want to delete this announcement?'
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      fetchAnnouncements(); // refresh list
    }
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
        <div
          key={a.id}
          style={{
            border: '1px solid #555',
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '8px',
          }}
        >
          <h3>{a.title}</h3>
          <p>{a.message}</p>

          <small>
            {new Date(a.created_at).toLocaleString('en-IN')}
          </small>

          <br /><br />

          <button
            style={{ background: 'red', color: 'white' }}
            onClick={() => deleteAnnouncement(a.id)}
          >
            🗑 Delete
          </button>
        </div>
      ))}

    </div>
  );
}
