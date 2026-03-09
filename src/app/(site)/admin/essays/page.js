
'use client';

export const dynamic = "force-dynamic";
import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabase';

export default function AdminEssays() {
  const [essays, setEssays] = useState([]);

  async function fetchEssays() {
    const { data } = await supabase
      .from('essays')
      .select('*')
      .order('created_at', { ascending: false });

    setEssays(data || []);
  }

  async function approveEssay(id) {
    await supabase
      .from('essays')
      .update({ approved: true })
      .eq('id', id);

    fetchEssays();
  }

  async function deleteEssay(id) {
    if (!confirm('Delete this essay?')) return;

    await supabase
      .from('essays')
      .delete()
      .eq('id', id);

    fetchEssays();
  }

  useEffect(() => {
    fetchEssays();
  }, []);

  return (
    <div style={{ padding: '40px' }}>
      <h1>Admin – Essay Moderation</h1>

      {essays.map((e) => (
        <div
          key={e.id}
          style={{
            border: '1px solid #555',
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '8px',
          }}
        >
          <h3>{e.title}</h3>
          <p>Author ID: {e.user_id}</p>

          <a href={e.file_url} target="_blank">
            📄 View Essay
          </a>

          <p>Status: {e.approved ? '✅ Approved' : '⏳ Pending'}</p>

          {!e.approved && (
            <button onClick={() => approveEssay(e.id)}>
              ✅ Approve
            </button>
          )}

          <button
            style={{ marginLeft: '10px', background: 'red', color: 'white' }}
            onClick={() => deleteEssay(e.id)}
          >
            🗑 Delete
          </button>
        </div>
      ))}
    </div>
  );
}
