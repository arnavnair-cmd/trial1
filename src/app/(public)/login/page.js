'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link'


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      window.location.href = '/dashboard';
    }
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Login</button>

        <p style={{ marginTop: "12px" }}>
          New here?{" "}
          <Link href="/signup" style={{ color: "#6a00ff", fontWeight: "bold" }}>
            Create an account
          </Link>
        </p>

      </form>

      <p>{message}</p>
    </div>
  );
}
