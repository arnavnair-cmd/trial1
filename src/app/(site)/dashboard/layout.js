'use client';

import Heading from '@/components/Heading/Heading';
import Navigation_Bar from '@/components/Navigation/Navigation_Bar';
import Footer from '@/components/Footer/Footer';

export default function DashboardLayout({ children }) {
  return (
    <>
      
      

      {/* THIS is where dashboard content replaces the old section */}
      <main style={{ padding: '40px' }}>
        {children}
      </main>

      <Footer />
    </>
  );
}
