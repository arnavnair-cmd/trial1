'use client';

import Link from 'next/link';

export default function UserDashboard() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>User Dashboard</h1>

      <ul>
        <li><Link href="/announcements">📢 Announcements</Link></li>
        <li><Link href="/essays">📝 Essays</Link></li>
        <li><Link href="/games">🎮 Games</Link></li>
        <li><Link href="/crossword">🧩 Daily Crossword</Link></li>
      </ul>
    </div>
  );
}
