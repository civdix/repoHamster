'use client';

interface HamsterMascotProps {
  variant?: 'avatar' | 'workstation' | 'detective' | 'celebrating' | 'thinking' | 'empty';
  className?: string;
  size?: number;
}

export function HamsterMascot({ variant = 'avatar', className = '', size }: HamsterMascotProps) {
  // 1. Icon / Avatar Variant (Iconic Silhouette)
  if (variant === 'avatar') {
    const dim = size || 40;
    return (
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="hoodieGrad" x1="20" y1="50" x2="80" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9333ea" />
            <stop offset="1" stopColor="#581c87" />
          </linearGradient>
          <linearGradient id="headphoneGrad" x1="10" y1="20" x2="90" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a3e635" />
            <stop offset="1" stopColor="#4d7c0f" />
          </linearGradient>
          <radialGradient id="cheekGlow" cx="50%" cy="50%" r="50%">
            <stop stopColor="#f472b6" stopOpacity="0.4" />
            <stop offset="1" stopColor="#f472b6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Headphone Arch */}
        <path
          d="M 22 45 C 22 20, 78 20, 78 45"
          stroke="#1f2937"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M 25 43 C 25 24, 75 24, 75 43"
          stroke="url(#headphoneGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Hamster Ears */}
        <ellipse cx="28" cy="30" rx="9" ry="11" fill="#f59e0b" />
        <ellipse cx="28" cy="30" rx="5" ry="7" fill="#fbbf24" />
        <ellipse cx="72" cy="30" rx="9" ry="11" fill="#f59e0b" />
        <ellipse cx="72" cy="30" rx="5" ry="7" fill="#fbbf24" />

        {/* Hoodie Body (Developer Attire) */}
        <path
          d="M 24 85 C 24 64, 76 64, 76 85 C 76 96, 24 96, 24 85 Z"
          fill="url(#hoodieGrad)"
        />
        {/* Hoodie Strings */}
        <path d="M 44 72 Q 43 82 41 85" stroke="#e9d5ff" strokeWidth="2" strokeLinecap="round" />
        <path d="M 56 72 Q 57 82 59 85" stroke="#e9d5ff" strokeWidth="2" strokeLinecap="round" />

        {/* Hamster Head */}
        <ellipse cx="50" cy="52" rx="27" ry="24" fill="#f59e0b" />
        {/* Cream Face Patch */}
        <ellipse cx="50" cy="57" rx="19" ry="16" fill="#fef3c7" />

        {/* Headphone Earcups (over-ear gaming/coder style) */}
        <rect x="14" y="38" width="10" height="20" rx="5" fill="#111827" stroke="#a3e635" strokeWidth="2" />
        <rect x="76" y="38" width="10" height="20" rx="5" fill="#111827" stroke="#a3e635" strokeWidth="2" />
        <ellipse cx="19" cy="48" rx="2" ry="4" fill="#a3e635" />
        <ellipse cx="81" cy="48" rx="2" ry="4" fill="#a3e635" />

        {/* Big Curious Eyes */}
        <ellipse cx="40" cy="49" rx="4" ry="5.5" fill="#0f172a" />
        <circle cx="38.5" cy="47.5" r="1.5" fill="#ffffff" />
        <ellipse cx="60" cy="49" rx="4" ry="5.5" fill="#0f172a" />
        <circle cx="58.5" cy="47.5" r="1.5" fill="#ffffff" />

        {/* Rosy Cheeks */}
        <ellipse cx="33" cy="57" rx="5" ry="3.5" fill="url(#cheekGlow)" />
        <ellipse cx="67" cy="57" rx="5" ry="3.5" fill="url(#cheekGlow)" />

        {/* Cute Nose */}
        <polygon points="50,56 46.5,53 53.5,53" fill="#ec4899" />

        {/* Mouth with adorable buck tooth */}
        <path d="M 50 56 Q 47 62 43 60" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M 50 56 Q 53 62 57 60" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <rect x="48.5" y="58" width="3" height="3" rx="0.5" fill="#ffffff" stroke="#78350f" strokeWidth="0.8" />

        {/* Whiskers */}
        <line x1="26" y1="56" x2="16" y2="53" stroke="#b45309" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="25" y1="60" x2="15" y2="61" stroke="#b45309" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="74" y1="56" x2="84" y2="53" stroke="#b45309" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="75" y1="60" x2="85" y2="61" stroke="#b45309" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  // 2. Workstation Hero Illustration Variant
  if (variant === 'workstation') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 540 380"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-2xl max-w-lg lg:max-w-xl"
        >
          <defs>
            <linearGradient id="deskGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop stopColor="#a855f7" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#a3e635" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="monitorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop stopColor="#1a2035" />
              <stop offset="100%" stopColor="#0d111d" />
            </linearGradient>
            <linearGradient id="screenCode" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop stopColor="#0c101d" />
              <stop offset="100%" stopColor="#05070d" />
            </linearGradient>
          </defs>

          {/* Ambient Lighting / Developer Room Glow */}
          <ellipse cx="270" cy="220" rx="240" ry="140" fill="url(#deskGlow)" />

          {/* Modern Ultra-Wide Curved Monitor */}
          <rect x="70" y="30" width="400" height="210" rx="14" fill="url(#monitorGrad)" stroke="#27324b" strokeWidth="3" />
          <rect x="82" y="42" width="376" height="186" rx="8" fill="url(#screenCode)" />

          {/* Terminal Window Header on Screen */}
          <rect x="82" y="42" width="376" height="24" rx="8" fill="#131929" />
          <circle cx="98" cy="54" r="4" fill="#f43f5e" />
          <circle cx="112" cy="54" r="4" fill="#f59e0b" />
          <circle cx="126" cy="54" r="4" fill="#10b981" />
          <text x="210" y="58" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="600">
            repohamster ~ debugging-session
          </text>

          {/* Code Editor Content */}
          <text x="100" y="85" fill="#a855f7" fontSize="11" fontFamily="JetBrains Mono, monospace">
            async function <tspan fill="#38bdf8">resolveRaceCondition</tspan>() &#123;
          </text>
          <text x="115" y="105" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono, monospace">
            // Inspecting mutex lock & sliding window
          </text>
          <text x="115" y="125" fill="#a3e635" fontSize="11" fontFamily="JetBrains Mono, monospace">
            const <tspan fill="#f1f5f9">lock</tspan> = await <tspan fill="#fbbf24">acquireDistributedMutex</tspan>(sku);
          </text>
          <text x="115" y="145" fill="#f43f5e" fontSize="11" fontFamily="JetBrains Mono, monospace">
            - stock -= requestedQty; // BUG: Non-atomic write!
          </text>
          <text x="115" y="165" fill="#a3e635" fontSize="11" fontFamily="JetBrains Mono, monospace">
            + await db.inventory.atomicDecrement(sku, qty); // FIXED ✓
          </text>
          <text x="100" y="185" fill="#a855f7" fontSize="11" fontFamily="JetBrains Mono, monospace">
            &#125;
          </text>

          {/* Terminal Status / Floating Pill */}
          <rect x="290" y="170" width="155" height="45" rx="8" fill="#1e1335" stroke="#a855f7" strokeWidth="1.5" />
          <text x="305" y="190" fill="#a3e635" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="700">
            ✓ 5/5 TESTS PASSING
          </text>
          <text x="305" y="205" fill="#c084fc" fontSize="9" fontFamily="JetBrains Mono, monospace">
            Ready to create Pull Request
          </text>

          {/* Monitor Stand */}
          <path d="M 255 240 L 250 280 L 290 280 L 285 240 Z" fill="#1e293b" />
          <ellipse cx="270" cy="280" rx="45" ry="7" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

          {/* Developer Desk Surface */}
          <rect x="20" y="275" width="500" height="18" rx="5" fill="#131826" stroke="#21293f" strokeWidth="2" />

          {/* Mechanical Keyboard with RGB Underglow */}
          <rect x="180" y="260" width="180" height="28" rx="5" fill="#090d16" stroke="#a3e635" strokeWidth="1.5" />
          <line x1="190" y1="268" x2="350" y2="268" stroke="#334155" strokeWidth="3" strokeDasharray="6 4" />
          <line x1="190" y1="276" x2="350" y2="276" stroke="#334155" strokeWidth="3" strokeDasharray="6 4" />

          {/* Hamster Coder Mascot Behind Desk */}
          {/* Headphone band */}
          <path d="M 235 240 C 235 185, 305 185, 305 240" stroke="#111827" strokeWidth="9" strokeLinecap="round" />
          <path d="M 238 238 C 238 190, 302 190, 302 238" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" />

          {/* Ears */}
          <ellipse cx="242" cy="205" rx="11" ry="14" fill="#f59e0b" />
          <ellipse cx="242" cy="205" rx="6" ry="9" fill="#fde68a" />
          <ellipse cx="298" cy="205" rx="11" ry="14" fill="#f59e0b" />
          <ellipse cx="298" cy="205" rx="6" ry="9" fill="#fde68a" />

          {/* Purple Hoodie Body */}
          <path d="M 225 285 C 225 245, 315 245, 315 285 Z" fill="#9333ea" stroke="#7e22ce" strokeWidth="2" />

          {/* Hamster Head */}
          <ellipse cx="270" cy="235" rx="34" ry="30" fill="#f59e0b" />
          <ellipse cx="270" cy="242" rx="24" ry="20" fill="#fef3c7" />

          {/* Headphones over ears */}
          <rect x="225" y="222" width="12" height="25" rx="6" fill="#090d16" stroke="#a3e635" strokeWidth="2.5" />
          <rect x="303" y="222" width="12" height="25" rx="6" fill="#090d16" stroke="#a3e635" strokeWidth="2.5" />
          <circle cx="231" cy="235" r="3" fill="#a3e635" />
          <circle cx="309" cy="235" r="3" fill="#a3e635" />

          {/* Eyes (focused on terminal screen) */}
          <ellipse cx="258" cy="232" rx="5" ry="7" fill="#090d16" />
          <circle cx="256" cy="230" r="2" fill="#ffffff" />
          <ellipse cx="282" cy="232" rx="5" ry="7" fill="#090d16" />
          <circle cx="280" cy="230" r="2" fill="#ffffff" />

          {/* Cute Nose and Cheeks */}
          <ellipse cx="249" cy="242" rx="6" ry="4" fill="#f472b6" fillOpacity="0.4" />
          <ellipse cx="291" cy="242" rx="6" ry="4" fill="#f472b6" fillOpacity="0.4" />
          <polygon points="270,241 266,237 274,237" fill="#ec4899" />
          {/* Mouth & Tooth */}
          <path d="M 270 241 Q 266 248 261 246" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M 270 241 Q 274 248 279 246" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <rect x="268.5" y="243" width="3" height="4" rx="0.5" fill="#ffffff" stroke="#78350f" strokeWidth="0.8" />

          {/* Paws on Keyboard */}
          <ellipse cx="225" cy="268" rx="8" ry="6" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
          <ellipse cx="315" cy="268" rx="8" ry="6" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />

          {/* Coffee Mug with Code Symbol */}
          <rect x="90" y="252" width="22" height="24" rx="4" fill="#a855f7" />
          <path d="M 112 258 C 117 258, 117 268, 112 268" stroke="#a855f7" strokeWidth="2.5" fill="none" />
          <text x="94" y="268" fill="#f3e8ff" fontSize="9" fontFamily="monospace" fontWeight="bold">&lt;/&gt;</text>
          {/* Steam rising */}
          <path d="M 98 246 Q 96 240 99 236" stroke="#c084fc" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M 104 245 Q 107 239 103 234" stroke="#c084fc" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />

          {/* Cute Bug Mascot Toy on the Desk */}
          <ellipse cx="430" cy="267" rx="9" ry="7" fill="#a3e635" />
          <ellipse cx="438" cy="267" rx="4" ry="4" fill="#090d16" />
          <line x1="424" y1="264" x2="420" y2="260" stroke="#4d7c0f" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="424" y1="270" x2="420" y2="274" stroke="#4d7c0f" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="432" y1="262" x2="432" y2="258" stroke="#4d7c0f" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="439" cy="266" r="1" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  // 3. Detective / Bug Hunter Variant
  if (variant === 'detective') {
    const dim = size || 120;
    return (
      <svg width={dim} height={dim} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Detective Hamster Inspecting Bug */}
        <ellipse cx="50" cy="60" rx="30" ry="28" fill="#f59e0b" />
        <ellipse cx="50" cy="65" rx="20" ry="18" fill="#fef3c7" />

        {/* Ears */}
        <ellipse cx="26" cy="36" rx="10" ry="12" fill="#f59e0b" />
        <ellipse cx="26" cy="36" rx="6" ry="8" fill="#fde68a" />
        <ellipse cx="74" cy="36" rx="10" ry="12" fill="#f59e0b" />
        <ellipse cx="74" cy="36" rx="6" ry="8" fill="#fde68a" />

        {/* Coder Purple Cap / Beanie */}
        <path d="M 24 45 C 24 22, 76 22, 76 45 Z" fill="#7e22ce" />
        <rect x="20" y="43" width="60" height="7" rx="3" fill="#a855f7" />

        {/* Curious Big Eyes */}
        <ellipse cx="40" cy="56" rx="4.5" ry="6" fill="#0f172a" />
        <circle cx="38" cy="54" r="1.5" fill="#ffffff" />
        <ellipse cx="60" cy="56" rx="4.5" ry="6" fill="#0f172a" />
        <circle cx="58" cy="54" r="1.5" fill="#ffffff" />

        {/* Nose & Tooth */}
        <polygon points="50,63 47,60 53,60" fill="#ec4899" />
        <rect x="48.5" y="65" width="3" height="3.5" rx="0.5" fill="#ffffff" stroke="#78350f" strokeWidth="0.8" />

        {/* Magnifying Glass */}
        <circle cx="85" cy="72" r="18" stroke="#a3e635" strokeWidth="4" fill="#a3e635" fillOpacity="0.1" />
        <line x1="98" y1="85" x2="112" y2="99" stroke="#65a30d" strokeWidth="6" strokeLinecap="round" />

        {/* Caught Bug Inside Glass */}
        <ellipse cx="85" cy="72" rx="7" ry="5.5" fill="#f43f5e" />
        <circle cx="90" cy="72" r="3.5" fill="#0f172a" />
        <line x1="82" y1="67" x2="80" y2="64" stroke="#9f1239" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="82" y1="77" x2="80" y2="80" stroke="#9f1239" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="91" cy="71" r="0.8" fill="#ffffff" />
      </svg>
    );
  }

  // 4. Celebrating / Winner Variant
  if (variant === 'celebrating') {
    const dim = size || 120;
    return (
      <svg width={dim} height={dim} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Confetti */}
        <circle cx="20" cy="20" r="3" fill="#a3e635" />
        <circle cx="95" cy="25" r="3.5" fill="#c084fc" />
        <polygon points="15,40 19,43 14,46" fill="#fbbf24" />
        <polygon points="102,50 106,53 101,56" fill="#a3e635" />

        {/* Hamster Body */}
        <ellipse cx="60" cy="65" rx="32" ry="30" fill="#f59e0b" />
        <ellipse cx="60" cy="70" rx="22" ry="20" fill="#fef3c7" />

        {/* Ears */}
        <ellipse cx="36" cy="38" rx="10" ry="12" fill="#f59e0b" />
        <ellipse cx="36" cy="38" rx="6" ry="8" fill="#fde68a" />
        <ellipse cx="84" cy="38" rx="10" ry="12" fill="#f59e0b" />
        <ellipse cx="84" cy="38" rx="6" ry="8" fill="#fde68a" />

        {/* Headphones with Lime Glow */}
        <path d="M 32 50 C 32 25, 88 25, 88 50" stroke="#a3e635" strokeWidth="4" strokeLinecap="round" />
        <rect x="24" y="44" width="9" height="18" rx="4" fill="#090d16" stroke="#a3e635" strokeWidth="2" />
        <rect x="87" y="44" width="9" height="18" rx="4" fill="#090d16" stroke="#a3e635" strokeWidth="2" />

        {/* Happy Curved Cheerful Eyes ^_^ */}
        <path d="M 44 58 Q 50 50 56 58" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 64 58 Q 70 50 76 58" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Rosy Cheeks */}
        <ellipse cx="40" cy="66" rx="6" ry="4" fill="#f472b6" fillOpacity="0.5" />
        <ellipse cx="80" cy="66" rx="6" ry="4" fill="#f472b6" fillOpacity="0.5" />

        {/* Nose & Big Smile */}
        <polygon points="60,65 56,62 64,62" fill="#ec4899" />
        <path d="M 50 68 Q 60 80 70 68" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="#78350f" />
        <rect x="58.5" y="69" width="3" height="4" rx="0.5" fill="#ffffff" />

        {/* Victory Paws with Lime Checkmark Flag */}
        <line x1="88" y1="75" x2="108" y2="35" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
        <rect x="98" y="32" width="20" height="15" rx="3" fill="#a3e635" />
        <path d="M 103 39 L 107 43 L 115 35" stroke="#090d16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }

  // 5. Thinking / Socratic AI Variant
  if (variant === 'thinking') {
    const dim = size || 100;
    return (
      <svg width={dim} height={dim} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Floating Question Mark / Sparkles */}
        <text x="74" y="24" fill="#a855f7" fontSize="16" fontFamily="JetBrains Mono, monospace" fontWeight="bold">?</text>
        <circle cx="22" cy="22" r="2" fill="#a3e635" />

        {/* Hamster */}
        <ellipse cx="50" cy="55" rx="26" ry="24" fill="#f59e0b" />
        <ellipse cx="50" cy="60" rx="18" ry="16" fill="#fef3c7" />

        {/* Ears */}
        <ellipse cx="30" cy="32" rx="8" ry="10" fill="#f59e0b" />
        <ellipse cx="30" cy="32" rx="5" ry="7" fill="#fde68a" />
        <ellipse cx="70" cy="32" rx="8" ry="10" fill="#f59e0b" />
        <ellipse cx="70" cy="32" rx="5" ry="7" fill="#fde68a" />

        {/* Looking Upward in Thought */}
        <ellipse cx="40" cy="50" rx="4" ry="5.5" fill="#0f172a" />
        <circle cx="41" cy="48" r="1.5" fill="#ffffff" />
        <ellipse cx="60" cy="50" rx="4" ry="5.5" fill="#0f172a" />
        <circle cx="61" cy="48" r="1.5" fill="#ffffff" />

        {/* Nose & Pondering Mouth */}
        <polygon points="50,56 47,53 53,53" fill="#ec4899" />
        <ellipse cx="50" cy="62" rx="2.5" ry="2" fill="#78350f" />

        {/* Paw on Chin */}
        <ellipse cx="60" cy="64" rx="6" ry="5" fill="#fde68a" stroke="#d97706" strokeWidth="1.2" />
      </svg>
    );
  }

  // 6. Sleeping / Empty State Variant
  if (variant === 'empty') {
    const dim = size || 160;
    return (
      <svg width={dim} height={dim} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Floating zzZ */}
        <text x="105" y="45" fill="#a855f7" fontSize="14" fontFamily="JetBrains Mono, monospace" fontWeight="bold">z</text>
        <text x="118" y="32" fill="#c084fc" fontSize="18" fontFamily="JetBrains Mono, monospace" fontWeight="bold">Z</text>
        <text x="134" y="18" fill="#a3e635" fontSize="22" fontFamily="JetBrains Mono, monospace" fontWeight="bold">Z</text>

        {/* Mechanical Keyboard Bed */}
        <rect x="20" y="105" width="120" height="30" rx="6" fill="#131826" stroke="#21293f" strokeWidth="2" />
        <line x1="30" y1="115" x2="130" y2="115" stroke="#26314d" strokeWidth="3" strokeDasharray="5 3" />
        <line x1="30" y1="123" x2="130" y2="123" stroke="#26314d" strokeWidth="3" strokeDasharray="5 3" />

        {/* Hamster Curled Up Sleeping */}
        <ellipse cx="75" cy="85" rx="36" ry="28" fill="#f59e0b" />
        <ellipse cx="68" cy="88" rx="24" ry="18" fill="#fef3c7" />

        {/* Droopy Ears */}
        <ellipse cx="50" cy="68" rx="9" ry="11" fill="#f59e0b" transform="rotate(-15 50 68)" />
        <ellipse cx="50" cy="68" rx="5" ry="7" fill="#fde68a" transform="rotate(-15 50 68)" />
        <ellipse cx="98" cy="72" rx="9" ry="11" fill="#f59e0b" transform="rotate(25 98 72)" />
        <ellipse cx="98" cy="72" rx="5" ry="7" fill="#fde68a" transform="rotate(25 98 72)" />

        {/* Closed Peaceful Sleeping Eyes - - */}
        <path d="M 52 82 Q 57 86 62 82" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 72 82 Q 77 86 82 82" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Tiny Rosy Cheeks */}
        <circle cx="48" cy="87" r="4" fill="#f472b6" fillOpacity="0.4" />
        <circle cx="86" cy="87" r="4" fill="#f472b6" fillOpacity="0.4" />

        {/* Cute Nose */}
        <polygon points="67,86 64,83 70,83" fill="#ec4899" />

        {/* Curled Paws holding a tiny bug plushie */}
        <ellipse cx="86" cy="98" rx="7" ry="5.5" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
        <ellipse cx="96" cy="99" rx="6" ry="4.5" fill="#a3e635" />
      </svg>
    );
  }

  return null;
}
