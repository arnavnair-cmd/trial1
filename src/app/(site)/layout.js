'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

import Heading from '@/components/Heading/Heading'
import Navigation_Bar from '@/components/Navigation/Navigation_Bar'
import styles from './layStyle.module.css'

export default function SiteLayout({ children }) {
  const [role, setRole] = useState(null)

  useEffect(() => {
    async function getRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        setRole(data?.role)
      }
    }

    getRole()
  }, [])

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.topSection}>
        <Heading />
        <Navigation_Bar role={role} />
      </div>

      <div className={styles.content}>
        {children}
      </div>
    </div>
  )


}
