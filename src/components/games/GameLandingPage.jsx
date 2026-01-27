'use client';

import Heading from '@/components/Heading/Heading';
import Navigation_Bar from '@/components/Navigation/Navigation_Bar';
import Game_Page from '@/components/Game_Page/Game_Page';
import Footer from '@/components/Footer/Footer';

function GameLandingPage() {
  return (
    <div
      style={{
        backgroundImage: "url('/assets/BGLanding.png')",
        ///backgroundSize: 'cover',
        ///backgroundPosition: 'center',
        padding: '40px',
        
      }}
    >
      
      <Game_Page />
      <Footer />
    </div>
  );
}

export default GameLandingPage;
