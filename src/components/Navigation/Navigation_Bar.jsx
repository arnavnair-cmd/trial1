'use client'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import styles from './Navigation_Bar.module.css'

export default function Navigation_Bar() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        setRole(data?.role)
      }
    }

    loadUser()
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <nav className={styles.navgBar}>
      <ul>
        <li><Link href="/home"  className={styles.aTitle}>Home</Link></li>
        <li><Link href="/games"  className={styles.aTitle}>Games</Link></li>
        <li><Link href="/essays"  className={styles.aTitle}>Essays</Link></li>
        <li><Link href="/announcements" className={styles.aTitle}>Announcements</Link></li>

        {role === "admin" && (
          <li><Link href="/dashboard" className={styles.aTitle}>Dashboard</Link></li>
        )}
        {user && <li><button className={styles.logoutBtn} onClick={logout} >Logout</button></li>}
      </ul>
    </nav>
  )
}
