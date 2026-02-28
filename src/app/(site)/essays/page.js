'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './EssayUpload.module.css';

export default function EssayPage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [essays, setEssays] = useState([]);

  const fileInputRef = useRef(null);

  // Get logged in user
  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login';
      } else {
        setUser(user);
        fetchEssays(user.id);
      }
    }

    getUser();
  }, []);

  // Fetch essays (approved OR own essays)
  async function fetchEssays(userId) {
    const { data, error } = await supabase
      .from('essays')
      .select('*')
      .or(`approved.eq.true,user_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (!error) {
      setEssays(data || []);
    }
  }

  function handleFile(selectedFile) {
    if (!selectedFile) return;

    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  }

  async function handleSubmit() {
    if (!file || !user) return;

    setUploading(true);

    const filePath = `essays/${user.id}_${Date.now()}_${file.name}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('essays')
      .upload(filePath, file);

    if (uploadError) {
      alert(uploadError.message);
      setUploading(false);
      return;
    }

    // Get public URL
    const { data } = supabase.storage
      .from('essays')
      .getPublicUrl(filePath);

    const publicUrl = data.publicUrl;

    // Insert into table
    const { error: dbError } = await supabase
      .from('essays')
      .insert({
        user_id: user.id,
        title: file.name,
        file_url: publicUrl,
        file_type: file.type,
        approved: false
      });

    if (dbError) {
      alert(dbError.message);
    } else {
      alert('Essay submitted successfully!');
      setFile(null);
      setPreviewUrl(null);
      fetchEssays(user.id); // 🔥 Refresh list immediately
    }

    setUploading(false);
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h2>Upload Your Essay</h2>

        <div
          className={styles.dropArea}
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <p>Drag & drop your file here<br />or click to select</p>

          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.doc,.docx,.png,.jpg"
            hidden
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {file && (
          <div className={styles.fileInfo}>
            <p><b>Name:</b> {file.name}</p>
            <p><b>Size:</b> {Math.round(file.size / 1024)} KB</p>
            {previewUrl && <img src={previewUrl} alt="Preview" />}
          </div>
        )}

        <button
          className={styles.submitBtn}
          disabled={!file || uploading}
          onClick={handleSubmit}
        >
          {uploading ? 'Uploading...' : 'Submit Essay'}
        </button>
      </div>

      {/* DISPLAY SECTION */}
      <div className={styles.submittedCard}>
        <h2>Submitted Essays</h2>

        {essays.map((essay) => (
          <div key={essay.id}>
            <p><b>{essay.title}</b></p>

            <a href={essay.file_url} target="_blank">
              View Essay
            </a>

            {!essay.approved && (
              <p style={{ color: "orange" }}>Pending Approval</p>
            )}
          </div>
        ))}
      </div>

    </main>
  );
}
