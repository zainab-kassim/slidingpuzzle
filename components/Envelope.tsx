'use client';

interface EnvelopeProps {
  isOpening: boolean;
  onClick: () => void;
}

export default function Envelope({ isOpening, onClick }: EnvelopeProps) {
  return (
    <div className="flex flex-col items-center gap-10">
      {/* Hint text */}
      <p
        className="text-black text-sm font-bold tracking-widest uppercase"
        style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.2em' }}
      >
        Tap to open
      </p>

      {/* Envelope */}
      <div
        onClick={onClick}
        className={`relative cursor-pointer select-none ${isOpening ? 'envelope-opening' : 'envelope-pulse'}`}
        style={{ width: 500, height: 200 }}
      >
        {/* Envelope body */}
       <img className="" src="https://oqk3pkp15w.ufs.sh/f/H3vgRA928TvFXFBEp36Zp2GVTj8NSYIa3W1KHRsqndiAJ5Bu" alt="envelope" />
      </div>
    </div>
  );
}
