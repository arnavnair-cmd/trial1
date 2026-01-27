'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function EssaysPage() {
  const [essays, setEssays] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchEssays();
  }, []);

  async function fetchEssays() {
    const { data } = await supabase
      .from('essays')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });

    setEssays(data || []);
  }

  async function uploadEssay(e) {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    await supabase.storage
      .from('essays')
      .upload(fileName, file);

    const { data } = supabase.storage
      .from('essays')
      .getPublicUrl(fileName);

    await supabase.from('essays').insert({
      user_id: user.id,
      title,
      file_url: data.publicUrl,
      file_type: fileExt,
    });

    setTitle('');
    setFile(null);
    fetchEssays();
  }

  return (
    <div style={{ padding: '40px', maxWidth: '700px', margin: 'auto' }}>
      <h1>Essays & Poems</h1>

      {/* Upload */}
      <form onSubmit={uploadEssay}>
        <input
          type="text"
          placeholder="Essay title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <button type="submit">Upload</button>
      </form>

      <hr />

      {/* List */}
      {essays.map((e) => (
        <div key={e.id} style={{ marginBottom: '15px' }}>
          <a href={e.file_url} target="_blank">
            📄 {e.title} ({e.file_type})
          </a>
        </div>
      ))}
    </div>
  );
}
