'use client';


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
