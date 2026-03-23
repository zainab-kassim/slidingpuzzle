'use client';
import { useEffect, useState } from 'react';

const IMAGE_URL =
  'https://oqk3pkp15w.ufs.sh/f/H3vgRA928TvFQAJ53T7ugWwrjJ4pqYinMDP7NROVkxHdfK9B';




export default function Reveal() {  

  return (
    <div className="relative flex flex-col items-center gap-8">

      {/* Main image */}
      <div
        className="reveal-appear relative"
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 0 60px rgba(255,215,0,0.2), 0 0 120px rgba(255,107,157,0.2), 0 30px 80px rgba(0,0,0,0.1)',
          background: '#FFD700',
          padding: '2px',
        }}
      >
        {/* Yellow background card */}
        <div
          style={{
            width: 280,
            height: 280,
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <img
            src={IMAGE_URL}
            alt="SpongeBob and Patrick"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>
      </div>

      {/* Message */}
      <div className="text-float text-center flex flex-col gap-3">
        <p
         className='text-black text-lg font-bold '
        >
          Together Forever 💞
        </p>
    
      </div>
    </div>
  );
}
