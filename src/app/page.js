'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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
    <div style={{ padding: '40px', maxWidth: '700px', margin: 'auto' }}>
      <h1>Event Feed</h1>

      {/* CREATE POST */}
      <form onSubmit={createPost}>
        <textarea
          placeholder="Post an event update..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <br />
        <button type="submit">Post</button>
      </form>

      <hr />


      {/*Announcements */}
      {showPopup && latestAnnouncement && (
        <div
          style={{
            background: '#222',
            border: '1px solid #555',
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
      )}


      {/* POSTS */}
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: '1px solid #ccc',
            padding: '15px',
            marginTop: '25px',
            borderRadius: '8px',
          }}
        >

          <p>
            <strong>{profiles[post.user_id] || 'Unknown User'}</strong>
          </p>
          <p>{post.content}</p>

          {post.image_url && (
            <img
              src={post.image_url}
              alt="Post image"
              style={{
                width: '100%',
                marginTop: '10px',
                borderRadius: '8px',
              }}
            />
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
      ))}
    </div>
  );
}
