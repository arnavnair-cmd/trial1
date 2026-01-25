'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>Admin Dashboard</h1>

      <ul>
        <li><Link href="/admin/announcements">Manage Announcements</Link></li>
        <li><Link href="/admin/crosswords">Manage Crosswords</Link></li>
        <li><Link href="/admin/rebusted">Manage ReBusted</Link></li>
        <li><Link href="/admin/users">View Users</Link></li>
      </ul>
    </div>
  );
}
