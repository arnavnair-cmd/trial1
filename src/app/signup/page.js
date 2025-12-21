'use client';
import { supabase } from '@/lib/supabase';

export default function Signup() {
  async function handleSignup() {
    await supabase.auth.signUp({
      email: 'test@gmail.com',
      password: 'password123'
    });
  }

  return <button onClick={handleSignup}>Sign Up</button>;
}
