'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import style from './HomePage.module.css';


export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [newPost, setNewPost] = useState('');
  const [profiles, setProfiles] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchLatestAnnouncement();
  }, []);

  async function fetchLatestAnnouncement() {
    const dismissed = sessionStorage.getItem('announcementDismissed');
    if (dismissed) return;

    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setLatestAnnouncement(data);
      setShowPopup(true);
    }
  }



  useEffect(() => {
    fetchPosts();
    fetchComments();
  }, []);

  // ---------------- POSTS ----------------

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPosts(data || []);
  }


  async function createPost(e) {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let imageUrl = null;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error(uploadError);
        return;
      }

      const { data } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    await supabase.from('posts').insert({
      user_id: user.id,
      content: newPost,
      image_url: imageUrl,
    });

    setNewPost('');
    setImageFile(null);
    fetchPosts();
  }


  // ---------------- COMMENTS ----------------

  async function fetchComments() {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    const grouped = {};
    data.forEach((c) => {
      if (!grouped[c.post_id]) grouped[c.post_id] = [];
      grouped[c.post_id].push(c);
    });

    setComments(grouped);
  }


  async function addComment(postId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      comment: newComment[postId],
    });

    setNewComment({ ...newComment, [postId]: '' });
    fetchComments();
  }

  //-----------------FETCH USER PROFILES ----------------
  async function fetchProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name');

    if (error) {
      console.error(error);
      return;
    }

    const map = {};
    data.forEach((p) => {
      map[p.id] = p.name;
    });

    setProfiles(map);
  }
  useEffect(() => {
    fetchPosts();
    fetchComments();
    fetchProfiles();
  }, []);



  // ---------------- UI ----------------

  return (
    <div className={style.container}>
      <h1 className={style.pageTitle}>Event Feed</h1>

      <form onSubmit={createPost} className={style.postForm}>
        <textarea
          className={style.textArea}
          placeholder="Post an event update..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          required
        />

        <div className={style.formBottom}>
          <label className={style.fileLabel}>
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              hidden
            />
          </label>

          <button type="submit" className={style.postButton}>
            Post
          </button>
        </div>
      </form>

      <hr />



      {/*Announcements */}
      {
        showPopup && latestAnnouncement && (
          <div
            style={{
              background: '#2dd058',
              border: '1px solid #0b0b0b',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '30px',
              position: 'relative',
            }}
          >
            <button
              onClick={() => {
                sessionStorage.setItem('announcementDismissed', 'true');
                setShowPopup(false);
              }}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>

            <h3>{latestAnnouncement.title}</h3>
            <p>{latestAnnouncement.message}</p>

            <small>
              {new Date(latestAnnouncement.created_at).toLocaleString('en-IN')}
            </small>
          </div>
        )
      }


      {/* POSTS */}
      {
        posts.map((post) => (
          <div
            key={post.id} className={style.feedCard}
          >

            <p>
              <strong>{profiles[post.user_id] || 'Unknown User'}</strong>
            </p>
            <p>{post.content}</p>

            {post.image_url && (
              <div className={style.imageWrapper}>
                <img
                  src={post.image_url}
                  alt="Post image"
                  className={style.postImage} />
              </div>
            )}


            <small>
              {new Date(post.created_at).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </small>




            {/* COMMENTS */}
            <div style={{ marginTop: '15px' }}>
              <strong>Comments</strong>

              {(comments[post.id] || []).map((c) => (
                <p key={c.id}>
                  <strong>{profiles[c.user_id] || 'User'}:</strong> {c.comment}
                </p>
              ))
              }

              {/* ADD COMMENT */}
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment[post.id] || ''}
                onChange={(e) =>
                  setNewComment({ ...newComment, [post.id]: e.target.value })
                }
                style={{ width: '100%', marginTop: '10px' }}
              />

              <button onClick={() => addComment(post.id)}>
                Comment
              </button>
            </div>
          </div>
        ))
      }
    </div >
  );
}
