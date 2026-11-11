'use client';

interface HamsterMascotProps {
  variant?: 'avatar' | 'normal' | 'workstation' | 'detective' | 'celebrating' | 'thinking' | 'empty' | 'angry' | 'mercy';
  className?: string;
  size?: number;
}

export function HamsterMascot({ variant = 'normal', className = '', size }: HamsterMascotProps) {
  const dim = size || 40;

  // Map variants to the user-provided transparent PNG images
  let imageSrc = '/hamsterimage/hamster_normal_use.png';
  let altText = 'RepoHamster Mascot';

  if (variant === 'angry' || variant === 'detective') {
    imageSrc = '/hamsterimage/hamster_angry.png';
    altText = 'Angry Hamster Mascot';
  } else if (variant === 'mercy' || variant === 'thinking' || variant === 'empty') {
    imageSrc = '/hamsterimage/hamster_asking_mercy_and_standing.png';
    altText = 'Hamster Mascot Asking Mercy';
  } else {
    // normal, avatar, workstation, celebrating
    imageSrc = '/hamsterimage/hamster_normal_use.png';
    altText = 'RepoHamster Mascot';
  }

  return (
    <div
      style={{ width: dim, height: dim }}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
    >
      <img
        src={imageSrc}
        alt={altText}
        className="w-full h-full object-contain pointer-events-none drop-shadow"
        loading="lazy"
      />
    </div>
  );
}
