'use client';
import { useState, useEffect } from 'react';
import Envelope from '@/components/Envelope';
import SlidingPuzzle from '@/components/SlidingPuzzle';
import Reveal from '@/components/Reveal';

type Stage = 'envelope' | 'opening' | 'puzzle' | 'reveal';

export default function Home() {
  const [stage, setStage] = useState<Stage>('envelope');
  const [showPuzzle, setShowPuzzle] = useState(false);

  const handleEnvelopeClick = () => {
    if (stage !== 'envelope') return;
    setStage('opening');
    setTimeout(() => {
      setStage('puzzle');
      setTimeout(() => setShowPuzzle(true), 50);
    }, 650);
  };

  const handlePuzzleSolved = () => {
    setStage('reveal');
  };

  return (
  <div className=" items-center justify-center pt-20">
      {(stage === 'envelope' || stage === 'opening') && (
        <Envelope isOpening={stage === 'opening'} onClick={handleEnvelopeClick} />
      )}

      {stage === 'puzzle' && (
        <div className={showPuzzle ? 'puzzle-appear' : 'opacity-0'}>
          <SlidingPuzzle onSolved={handlePuzzleSolved} />
        </div>
      )}

      {stage === 'reveal' && <Reveal />}
    </div>
  );
}
