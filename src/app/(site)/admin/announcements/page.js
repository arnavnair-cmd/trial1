export const dynamic = "force-dynamic";
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import styles from './AdminAnnouncements.module.css';

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
      fetchAnnouncements();
    }
  }

  return (
    <div className={styles.mainWrap}>
      <div className={styles.mainCont}>
        <h1 className={styles.heading}>Admin Announcements</h1>

        <h2 className={styles.titles}>Post Announcement</h2>

        <form onSubmit={createAnnouncement}>
          <div className={styles.postCont}>
            <input
              placeholder="Announcement Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={styles.aTitleBox}
            />

            <textarea
              placeholder="Announcement message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className={styles.aTextBox}
            />

            <button
              type="submit"
              className={styles.postBtn}
            >
              Post Announcement
            </button>
          </div>
        </form>

        <hr className={styles.divider} />

        <h2 className={styles.titles}>Past Announcements</h2>

        {announcements.map((a) => (
          <div
            key={a.id}
            className={styles.post}
          >
            <h3>{a.title}</h3>
            <p>{a.message}</p>

            <small>
              {new Date(a.created_at).toLocaleString('en-IN')}
            </small>

            <br /><br />

            <button
              className={styles.dltBtn}
              onClick={() => deleteAnnouncement(a.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}