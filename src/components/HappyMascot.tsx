import React, { useState, useEffect } from 'react';
import { SpiderSuitTheme } from '../types';

export type HappyExpression = 'happy' | 'studying' | 'cheer' | 'thinking' | 'proud' | 'wink';
export type { SpiderSuitTheme };

export interface SuitOption {
  id: SpiderSuitTheme;
  name: string;
  badge: string;
  icon: string;
  desc: string;
  themeColor: string;
  bgGrad: string;
}

export const SPIDER_SUITS: SuitOption[] = [
  {
    id: 'spider-red',
    name: '클래식 피터 레드',
    badge: '오리지널',
    icon: '🔴',
    desc: '전통의 피터 파커 레드 & 로열 블루',
    themeColor: '#EF4444',
    bgGrad: 'from-red-500 to-blue-600',
  },
  {
    id: 'spider-black',
    name: '스텔스 심비오트 블랙',
    badge: '시크 다크',
    icon: '⚫',
    desc: '강력한 집중력의 매트 블랙 & 화이트 웹',
    themeColor: '#1E293B',
    bgGrad: 'from-slate-800 to-slate-950',
  },
  {
    id: 'spider-gold',
    name: '아이언 스파이더 골드',
    badge: '하이테크',
    icon: '🟡',
    desc: '토니 스타크 나노테크 골드 & 크림슨',
    themeColor: '#F59E0B',
    bgGrad: 'from-amber-500 to-red-600',
  },
  {
    id: 'spider-blue',
    name: '2099 사이버 블루',
    badge: '미래형',
    icon: '🔵',
    desc: '사이버 네온 블루 & 일렉트릭 인디고',
    themeColor: '#0284C7',
    bgGrad: 'from-sky-500 to-indigo-700',
  },
  {
    id: 'spider-pink',
    name: '스파이더 그웬 핑크',
    badge: '스타일리시',
    icon: '🌸',
    desc: '화이트 후드 & 네온 핑크 & 민트 틸',
    themeColor: '#EC4899',
    bgGrad: 'from-pink-500 to-teal-500',
  },
  {
    id: 'spider-purple',
    name: '마일즈 섀도우 퍼플',
    badge: '스트리트',
    icon: '🟣',
    desc: '마일즈 모랄레스 딥 퍼플 & 마젠타 웹',
    themeColor: '#9333EA',
    bgGrad: 'from-purple-600 to-red-600',
  },
  {
    id: 'spider-green',
    name: '코스믹 에메랄드 그린',
    badge: '에너지',
    icon: '🟢',
    desc: '우주 에너지를 품은 네온 에메랄드 그린',
    themeColor: '#10B981',
    bgGrad: 'from-emerald-500 to-teal-700',
  },
];

interface HappyMascotProps {
  expression?: HappyExpression;
  suitTheme?: SpiderSuitTheme;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  speechText?: string;
  showSpeech?: boolean;
  interactive?: boolean;
  onSpeechClick?: () => void;
  onSuitChange?: (newSuit: SpiderSuitTheme) => void;
}

const SPIDER_CHEER_MESSAGES = [
  '친절한 이웃 해피가 수능 1등급 거미줄을 쐈어! 🕸️✨',
  '스파이더 센스 발동! 이 문장의 핵심 주어·동사를 찾아봐! 🕷️⚡',
  '끊어읽기(Chunking)로 긴 수능 문장도 단숨에 낚아채자! 🚀',
  '모르는 단어는 거미줄로 낚아서 해피 단어장에 쏙! 📚',
  '큰 힘에는 큰 집중력이 따르는 법! 오늘 1장 완독 가자! 💪',
  '매일 15분 루틴이면 킬러 문항도 거뜬히 탈출! 🌟',
  '오늘도 집중력 최고! 해피 스파이더 도장 쾅쾅! 💮',
];

export const HappyMascot: React.FC<HappyMascotProps> = ({
  expression = 'happy',
  suitTheme: initialSuit = 'spider-red',
  size = 'md',
  className = '',
  speechText,
  showSpeech = true,
  interactive = true,
  onSpeechClick,
  onSuitChange,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [suit, setSuit] = useState<SpiderSuitTheme>(initialSuit || 'spider-red');

  useEffect(() => {
    if (initialSuit) {
      setSuit(initialSuit);
    }
  }, [initialSuit]);

  const sizeStyles = {
    sm: { container: 'w-10 h-10', svg: 'w-10 h-10', speech: 'text-[10px] p-1.5' },
    md: { container: 'w-16 h-16', svg: 'w-16 h-16', speech: 'text-xs p-2.5' },
    lg: { container: 'w-24 h-24', svg: 'w-24 h-24', speech: 'text-xs p-3' },
    xl: { container: 'w-32 h-32', svg: 'w-32 h-32', speech: 'text-sm p-3.5' },
  }[size];

  const handleClick = () => {
    if (!interactive) return;
    setIsBouncing(true);
    setCurrentMessageIndex((prev) => (prev + 1) % SPIDER_CHEER_MESSAGES.length);
    
    // Cycle through all available spider suits
    const suits: SpiderSuitTheme[] = [
      'spider-red',
      'spider-black',
      'spider-gold',
      'spider-blue',
      'spider-pink',
      'spider-purple',
      'spider-green',
    ];
    const nextSuit = suits[(suits.indexOf(suit) + 1) % suits.length];
    setSuit(nextSuit);
    if (onSuitChange) {
      onSuitChange(nextSuit);
    }

    setTimeout(() => setIsBouncing(false), 600);
    if (onSpeechClick) onSpeechClick();
  };

  const displayText = speechText || SPIDER_CHEER_MESSAGES[currentMessageIndex];

  // Suit Color Palette Definitions
  const suitConfig = {
    'spider-red': {
      maskGrad: { start: '#EF4444', mid: '#DC2626', end: '#991B1B' },
      bodyColor: '#2563EB',
      bodyStroke: '#1D4ED8',
      webColor: '#450A0A',
      eyeRim: '#0F172A',
      nameTag: 'bg-red-600 text-white',
      badgeIcon: '🕸️',
    },
    'spider-black': {
      maskGrad: { start: '#334155', mid: '#1E293B', end: '#090D16' },
      bodyColor: '#0F172A',
      bodyStroke: '#020617',
      webColor: '#94A3B8',
      eyeRim: '#FFFFFF',
      nameTag: 'bg-slate-900 text-white',
      badgeIcon: '🕷️',
    },
    'spider-gold': {
      maskGrad: { start: '#F59E0B', mid: '#D97706', end: '#78350F' },
      bodyColor: '#B45309',
      bodyStroke: '#78350F',
      webColor: '#451A03',
      eyeRim: '#1E293B',
      nameTag: 'bg-amber-600 text-white',
      badgeIcon: '⚡',
    },
    'spider-blue': {
      maskGrad: { start: '#38BDF8', mid: '#0284C7', end: '#075985' },
      bodyColor: '#1E293B',
      bodyStroke: '#0F172A',
      webColor: '#082F49',
      eyeRim: '#0F172A',
      nameTag: 'bg-sky-600 text-white',
      badgeIcon: '🚀',
    },
    'spider-pink': {
      maskGrad: { start: '#F472B6', mid: '#DB2777', end: '#831843' },
      bodyColor: '#14B8A6',
      bodyStroke: '#0F766E',
      webColor: '#500724',
      eyeRim: '#0F172A',
      nameTag: 'bg-pink-600 text-white',
      badgeIcon: '🌸',
    },
    'spider-purple': {
      maskGrad: { start: '#A855F7', mid: '#7E22CE', end: '#3B0764' },
      bodyColor: '#BE123C',
      bodyStroke: '#881337',
      webColor: '#2E1065',
      eyeRim: '#0F172A',
      nameTag: 'bg-purple-600 text-white',
      badgeIcon: '🟣',
    },
    'spider-green': {
      maskGrad: { start: '#34D399', mid: '#059669', end: '#064E3B' },
      bodyColor: '#0F766E',
      bodyStroke: '#115E59',
      webColor: '#022C22',
      eyeRim: '#0F172A',
      nameTag: 'bg-emerald-600 text-white',
      badgeIcon: '🟢',
    },
  }[suit] || {
    maskGrad: { start: '#EF4444', mid: '#DC2626', end: '#991B1B' },
    bodyColor: '#2563EB',
    bodyStroke: '#1D4ED8',
    webColor: '#450A0A',
    eyeRim: '#0F172A',
    nameTag: 'bg-red-600 text-white',
    badgeIcon: '🕸️',
  };

  return (
    <div className={`relative flex items-center gap-2.5 ${className}`}>
      {/* Cute Spider-Man Chibi Mascot SVG */}
      <div
        onClick={handleClick}
        className={`relative ${sizeStyles.container} cursor-pointer shrink-0 transition-transform select-none ${
          isBouncing ? 'scale-125 -rotate-6' : 'hover:scale-110 active:scale-95'
        }`}
        title="스파이더맨 해피를 클릭하면 수트와 응원 메시지가 바뀌어요! 🕸️"
      >
        <svg
          viewBox="0 0 120 120"
          className={`${sizeStyles.svg} filter drop-shadow-md select-none`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Mask Radial Gradient */}
            <radialGradient id={`spiderMaskGrad-${suit}`} cx="45%" cy="38%" r="65%">
              <stop offset="0%" stopColor={suitConfig.maskGrad.start} />
              <stop offset="60%" stopColor={suitConfig.maskGrad.mid} />
              <stop offset="100%" stopColor={suitConfig.maskGrad.end} />
            </radialGradient>

            {/* Lens Glowing White Gradient */}
            <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="80%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            {/* Smart Glasses Metallic Gradient */}
            <linearGradient id="glassesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>

            {/* Gold Star Sparkle */}
            <linearGradient id="goldSparkle" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Soft Ground Shadow */}
          <ellipse cx="60" cy="112" rx="28" ry="5" fill="#0F172A" fillOpacity="0.15" />

          {/* Web Shoot Effect (Cheer mode) */}
          {expression === 'cheer' && (
            <g className="animate-pulse">
              <path d="M20 50 Q 8 40 2 24" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="3 3" />
              <path d="M100 50 Q 112 40 118 24" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="3 3" />
              <circle cx="2" cy="24" r="3" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
              <circle cx="118" cy="24" r="3" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
            </g>
          )}

          {/* Hanging Web Thread (Thinking mode) */}
          {expression === 'thinking' && (
            <path d="M60 0 L 60 22" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 2" />
          )}

          {/* Cute Chibi Hero Body / Suit Shoulders */}
          <path
            d="M38 92 C38 86, 48 82, 60 82 C72 82, 82 86, 82 92 L86 110 L34 110 Z"
            fill={suitConfig.bodyColor}
            stroke={suitConfig.bodyStroke}
            strokeWidth="1.8"
          />
          {/* Spider Chest Emblem */}
          <path
            d="M60 88 L 56 94 L 60 97 L 64 94 Z"
            fill="#0F172A"
          />
          <path d="M56 90 L 51 87 M 64 90 L 69 87 M 56 93 L 50 95 M 64 93 L 70 95 M 57 96 L 52 100 M 63 96 L 68 100" stroke="#0F172A" strokeWidth="1.2" strokeLinecap="round" />

          {/* Main Spider-Man Head (Cute Round Shape) */}
          <ellipse
            cx="60"
            cy="56"
            rx="36"
            ry="38"
            fill={`url(#spiderMaskGrad-${suit})`}
            stroke="#1E293B"
            strokeWidth="2.5"
          />

          {/* Spider Web Pattern on Mask */}
          <g stroke={suitConfig.webColor} strokeWidth="1.2" strokeOpacity="0.75" fill="none">
            {/* Center Web Node */}
            <circle cx="60" cy="56" r="1.5" fill={suitConfig.webColor} />
            {/* Radial Lines from Nose/Center */}
            <line x1="60" y1="56" x2="60" y2="18" />
            <line x1="60" y1="56" x2="36" y2="24" />
            <line x1="60" y1="56" x2="84" y2="24" />
            <line x1="60" y1="56" x2="25" y2="44" />
            <line x1="60" y1="56" x2="95" y2="44" />
            <line x1="60" y1="56" x2="25" y2="68" />
            <line x1="60" y1="56" x2="95" y2="68" />
            <line x1="60" y1="56" x2="38" y2="88" />
            <line x1="60" y1="56" x2="82" y2="88" />
            <line x1="60" y1="56" x2="60" y2="94" />

            {/* Concentric Web Arcs */}
            <path d="M47 38 Q 60 44 73 38" />
            <path d="M37 49 Q 60 58 83 49" />
            <path d="M38 67 Q 60 58 82 67" />
            <path d="M48 78 Q 60 72 72 78" />
          </g>

          {/* Cute Rosy Cheeks (Chibi style) */}
          <circle cx="35" cy="65" r="5.5" fill="#FDA4AF" fillOpacity="0.5" />
          <circle cx="85" cy="65" r="5.5" fill="#FDA4AF" fillOpacity="0.5" />

          {/* Spider-Man Eyes / Lenses with Expressions */}
          {expression === 'wink' ? (
            <>
              {/* Left Eye: Big Open Heroic Spider Eye */}
              <path
                d="M34 46 C40 38, 52 44, 52 60 C42 62, 34 56, 34 46 Z"
                fill="url(#lensGrad)"
                stroke={suitConfig.eyeRim}
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
              {/* Right Eye: Cute Wink Closed Line */}
              <path
                d="M68 56 Q 77 48 86 56"
                stroke={suitConfig.eyeRim}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : expression === 'happy' || expression === 'cheer' ? (
            <>
              {/* Joyful Beaming Eyes (Upcurved heroic smile lenses) */}
              <path
                d="M34 50 C40 40, 52 46, 52 60 C44 57, 38 55, 34 50 Z"
                fill="url(#lensGrad)"
                stroke={suitConfig.eyeRim}
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
              <path
                d="M86 50 C80 40, 68 46, 68 60 C76 57, 82 55, 86 50 Z"
                fill="url(#lensGrad)"
                stroke={suitConfig.eyeRim}
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
            </>
          ) : expression === 'studying' ? (
            <>
              {/* Focused Spider Eyes */}
              <path
                d="M36 48 C41 42, 51 46, 51 58 C43 60, 36 56, 36 48 Z"
                fill="url(#lensGrad)"
                stroke={suitConfig.eyeRim}
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M84 48 C79 42, 69 46, 69 58 C77 60, 84 56, 84 48 Z"
                fill="url(#lensGrad)"
                stroke={suitConfig.eyeRim}
                strokeWidth="3"
                strokeLinejoin="round"
              />
              {/* Smart Glasses over Spider Mask */}
              <circle cx="44" cy="54" r="10" stroke="url(#glassesGrad)" strokeWidth="2.5" fill="#60A5FA" fillOpacity="0.2" />
              <circle cx="76" cy="54" r="10" stroke="url(#glassesGrad)" strokeWidth="2.5" fill="#60A5FA" fillOpacity="0.2" />
              <path d="M54 54 L 66 54" stroke="url(#glassesGrad)" strokeWidth="2.5" />
              <path d="M34 52 L 26 50" stroke="url(#glassesGrad)" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M86 52 L 94 50" stroke="url(#glassesGrad)" strokeWidth="2.2" strokeLinecap="round" />
            </>
          ) : expression === 'proud' ? (
            <>
              {/* Sparkly Spider Eyes */}
              <path
                d="M34 46 C40 38, 52 44, 52 60 C42 62, 34 56, 34 46 Z"
                fill="url(#lensGrad)"
                stroke={suitConfig.eyeRim}
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
              <path
                d="M86 46 C80 38, 68 44, 68 60 C78 62, 86 56, 86 46 Z"
                fill="url(#lensGrad)"
                stroke={suitConfig.eyeRim}
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
              {/* CSAT 1st Grade Graduation Cap (수능 1등급 학사모) */}
              <polygon points="60,4 92,15 60,23 28,15" fill="#0F172A" stroke="#334155" strokeWidth="1" />
              <rect x="52" y="17" width="16" height="7" rx="1.5" fill="#1E293B" />
              <path d="M88 15 Q 92 27 90 33" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="90" cy="33" r="2.2" fill="#F59E0B" />
            </>
          ) : (
            <>
              {/* Classic Big Chibi Spider Eyes */}
              <path
                d="M34 46 C40 38, 52 44, 52 60 C42 62, 34 56, 34 46 Z"
                fill="url(#lensGrad)"
                stroke={suitConfig.eyeRim}
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
              <path
                d="M86 46 C80 38, 68 44, 68 60 C78 62, 86 56, 86 46 Z"
                fill="url(#lensGrad)"
                stroke={suitConfig.eyeRim}
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Hands and Props */}
          {expression === 'cheer' ? (
            <>
              {/* Web Shooter Hands Pose */}
              <circle cx="18" cy="54" r="6" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
              <circle cx="102" cy="54" r="6" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
              <rect x="14" y="52" width="4" height="4" fill="#0F172A" rx="1" />
              <rect x="102" y="52" width="4" height="4" fill="#0F172A" rx="1" />
            </>
          ) : expression === 'studying' ? (
            <>
              {/* Holding Smart Blue Pen */}
              <circle cx="28" cy="80" r="5.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
              <circle cx="92" cy="78" r="5.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
              <polygon points="86,74 102,56 106,60 90,78" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.2" />
              <polygon points="86,74 83,77 90,78" fill="#EF4444" />
              <polygon points="83,77 81,79 84,79" fill="#0F172A" />
            </>
          ) : (
            <>
              {/* Little Hero Hands */}
              <circle cx="28" cy="80" r="5.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
              <circle cx="92" cy="80" r="5.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
            </>
          )}

          {/* Sparkle of Hero Intelligence */}
          <path
            d="M14 24 Q 16 18 20 24 Q 26 26 20 28 Q 18 34 16 28 Q 10 26 14 24 Z"
            fill="url(#goldSparkle)"
          />
        </svg>

        {/* Mascot Name Badge: "해피 🕷️" */}
        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 ${suitConfig.nameTag} text-[9px] font-black px-2 py-0.2 rounded-full shadow-xs border border-white whitespace-nowrap select-none flex items-center gap-0.5`}>
          <span>해피</span>
          <span>{suitConfig.badgeIcon}</span>
        </div>
      </div>

      {/* Speech Bubble */}
      {showSpeech && (
        <div
          onClick={handleClick}
          className={`relative bg-white border border-slate-200 text-slate-800 rounded-2xl shadow-xs ${sizeStyles.speech} font-bold max-w-[280px] sm:max-w-xs cursor-pointer hover:border-blue-300 transition-all select-none`}
        >
          {/* Arrow point */}
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-l border-b border-slate-200 transform rotate-45" />
          <p className="leading-snug text-slate-700">
            {displayText}
          </p>
        </div>
      )}
    </div>
  );
};

// Aliases for compatibility
export const TangerineMascot = HappyMascot;
export const GanadiMascot = HappyMascot;
export type TangerineExpression = HappyExpression;
export type GanadiExpression = HappyExpression;

/**
 * Multi-colored Spider-Man Squad Logo
 * Displays a lively cluster of chibi Spider-Men in multiple colors:
 * Classic Red, Cyber Blue, Iron Gold, and Gwen Pink.
 */
export const SpiderSquadLogo: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}> = ({
  className = '',
  size = 'md',
  interactive = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-9 sm:w-14 sm:h-10',
    md: 'w-14 h-10 sm:w-16 sm:h-11',
    lg: 'w-20 h-14',
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className} ${
        interactive ? 'cursor-pointer transition-transform hover:scale-105 active:scale-95' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="수능 1등급 해피 스파이더 군단 (레드 · 블루 · 골드 · 핑크) 🕸️⚡"
    >
      <svg
        viewBox="0 0 150 100"
        className={`${sizeClasses} filter drop-shadow-sm`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients for each Spider-Man suit */}
          {/* 1. Red (Classic Peter) */}
          <radialGradient id="squad-red" cx="45%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="60%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </radialGradient>

          {/* 2. Blue (Cyber Blue) */}
          <radialGradient id="squad-blue" cx="45%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="60%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#075985" />
          </radialGradient>

          {/* 3. Gold / Yellow (Iron Spider) */}
          <radialGradient id="squad-gold" cx="45%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </radialGradient>

          {/* 4. Pink (Gwen Pink) */}
          <radialGradient id="squad-pink" cx="45%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="60%" stopColor="#DB2777" />
            <stop offset="100%" stopColor="#9D174D" />
          </radialGradient>

          {/* Eye Lens Grad */}
          <linearGradient id="squad-lens" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Gold Sparkle */}
          <linearGradient id="squad-sparkle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* Web thread connector between the team */}
        <path
          d="M26 62 Q 72 38 124 62"
          stroke="#CBD5E1"
          strokeWidth="1.2"
          strokeDasharray="2 2"
        />

        {/* ------------------------------------------------------------- */}
        {/* SPIDER 1: LEFT - BLUE SPIDER (2099 Cyber Blue) */}
        {/* ------------------------------------------------------------- */}
        <g className="transition-transform duration-200 origin-[34px_62px]">
          {/* Mini Blue Body */}
          <path
            d="M20 80 C20 75, 27 72, 34 72 C41 72, 48 75, 48 80 L50 94 L18 94 Z"
            fill="#1E293B"
            stroke="#0F172A"
            strokeWidth="1.2"
          />
          {/* Blue Head */}
          <ellipse cx="34" cy="60" rx="22" ry="23" fill="url(#squad-blue)" stroke="#0F172A" strokeWidth="2" />
          
          {/* Blue Web Lines */}
          <g stroke="#082F49" strokeWidth="0.8" strokeOpacity="0.8" fill="none">
            <line x1="34" y1="60" x2="34" y2="38" />
            <line x1="34" y1="60" x2="16" y2="46" />
            <line x1="34" y1="60" x2="52" y2="46" />
            <line x1="34" y1="60" x2="14" y2="68" />
            <line x1="34" y1="60" x2="54" y2="68" />
            <path d="M24 50 Q 34 54 44 50" />
            <path d="M19 64 Q 34 58 49 64" />
          </g>

          {/* Cheeks */}
          <circle cx="20" cy="66" r="3.2" fill="#BAE6FD" fillOpacity="0.6" />
          <circle cx="48" cy="66" r="3.2" fill="#BAE6FD" fillOpacity="0.6" />

          {/* Blue Hero Eyes */}
          <path
            d="M20 56 C24 50, 30 54, 30 63 C25 61, 22 59, 20 56 Z"
            fill="url(#squad-lens)"
            stroke="#0F172A"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M48 56 C44 50, 38 54, 38 63 C43 61, 46 59, 48 56 Z"
            fill="url(#squad-lens)"
            stroke="#0F172A"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Small Blue Badge */}
          <rect x="22" y="86" width="24" height="8" rx="4" fill="#0284C7" stroke="#FFFFFF" strokeWidth="0.8" />
          <text x="34" y="92.5" fill="#FFFFFF" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            블루
          </text>
        </g>

        {/* ------------------------------------------------------------- */}
        {/* SPIDER 2: RIGHT - GOLD/YELLOW SPIDER (Iron Spider Gold) */}
        {/* ------------------------------------------------------------- */}
        <g className="transition-transform duration-200 origin-[114px_62px]">
          {/* Mini Gold Body */}
          <path
            d="M100 80 C100 75, 107 72, 114 72 C121 72, 128 75, 128 80 L130 94 L98 94 Z"
            fill="#B45309"
            stroke="#78350F"
            strokeWidth="1.2"
          />
          {/* Gold Head */}
          <ellipse cx="114" cy="60" rx="22" ry="23" fill="url(#squad-gold)" stroke="#1E293B" strokeWidth="2" />
          
          {/* Gold Web Lines */}
          <g stroke="#78350F" strokeWidth="0.8" strokeOpacity="0.85" fill="none">
            <line x1="114" y1="60" x2="114" y2="38" />
            <line x1="114" y1="60" x2="96" y2="46" />
            <line x1="114" y1="60" x2="132" y2="46" />
            <line x1="114" y1="60" x2="94" y2="68" />
            <line x1="114" y1="60" x2="134" y2="68" />
            <path d="M104 50 Q 114 54 124 50" />
            <path d="M99 64 Q 114 58 129 64" />
          </g>

          {/* Cheeks */}
          <circle cx="100" cy="66" r="3.2" fill="#FDE68A" fillOpacity="0.7" />
          <circle cx="128" cy="66" r="3.2" fill="#FDE68A" fillOpacity="0.7" />

          {/* Gold Hero Eyes */}
          <path
            d="M100 56 C104 50, 110 54, 110 63 C105 61, 102 59, 100 56 Z"
            fill="url(#squad-lens)"
            stroke="#1E293B"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M128 56 C124 50, 118 54, 118 63 C123 61, 126 59, 128 56 Z"
            fill="url(#squad-lens)"
            stroke="#1E293B"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Small Gold Badge */}
          <rect x="102" y="86" width="24" height="8" rx="4" fill="#D97706" stroke="#FFFFFF" strokeWidth="0.8" />
          <text x="114" y="92.5" fill="#FFFFFF" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            골드
          </text>
        </g>

        {/* ------------------------------------------------------------- */}
        {/* SPIDER 3: TOP-CENTER ACCENT - GWEN PINK SPIDER */}
        {/* ------------------------------------------------------------- */}
        <g className="transition-transform duration-200">
          <ellipse cx="74" cy="24" rx="14" ry="15" fill="url(#squad-pink)" stroke="#1E293B" strokeWidth="1.5" />
          {/* Pink Web */}
          <g stroke="#831843" strokeWidth="0.6" strokeOpacity="0.8" fill="none">
            <line x1="74" y1="24" x2="74" y2="10" />
            <line x1="74" y1="24" x2="62" y2="15" />
            <line x1="74" y1="24" x2="86" y2="15" />
            <path d="M67 18 Q 74 21 81 18" />
          </g>
          {/* Pink Eyes */}
          <path
            d="M66 22 C68 18, 71 20, 71 26 C68 25, 67 24, 66 22 Z"
            fill="url(#squad-lens)"
            stroke="#1E293B"
            strokeWidth="1.4"
          />
          <path
            d="M82 22 C80 18, 77 20, 77 26 C80 25, 81 24, 82 22 Z"
            fill="url(#squad-lens)"
            stroke="#1E293B"
            strokeWidth="1.4"
          />
        </g>

        {/* ------------------------------------------------------------- */}
        {/* SPIDER 4: MAIN FRONT-CENTER - CLASSIC PETER RED SPIDER */}
        {/* ------------------------------------------------------------- */}
        <g className="transition-transform duration-200 origin-[74px_58px]">
          {/* Ground soft shadow */}
          <ellipse cx="74" cy="95" rx="26" ry="4" fill="#0F172A" fillOpacity="0.18" />

          {/* Red Body / Shoulders */}
          <path
            d="M54 78 C54 72, 63 68, 74 68 C85 68, 94 72, 94 78 L97 96 L51 96 Z"
            fill="#2563EB"
            stroke="#1D4ED8"
            strokeWidth="1.5"
          />
          {/* Chest spider emblem */}
          <path d="M74 74 L 71 79 L 74 81 L 77 79 Z" fill="#0F172A" />

          {/* Main Red Head */}
          <ellipse cx="74" cy="52" rx="27" ry="28" fill="url(#squad-red)" stroke="#1E293B" strokeWidth="2.4" />

          {/* Red Web Pattern */}
          <g stroke="#450A0A" strokeWidth="1" strokeOpacity="0.8" fill="none">
            <circle cx="74" cy="52" r="1.2" fill="#450A0A" />
            <line x1="74" y1="52" x2="74" y2="25" />
            <line x1="74" y1="52" x2="52" y2="34" />
            <line x1="74" y1="52" x2="96" y2="34" />
            <line x1="74" y1="52" x2="48" y2="52" />
            <line x1="74" y1="52" x2="100" y2="52" />
            <line x1="74" y1="52" x2="52" y2="70" />
            <line x1="74" y1="52" x2="96" y2="70" />
            <line x1="74" y1="52" x2="74" y2="79" />
            <path d="M62 38 Q 74 43 86 38" />
            <path d="M54 48 Q 74 55 94 48" />
            <path d="M56 62 Q 74 55 92 62" />
          </g>

          {/* Cute Rosy Cheeks */}
          <circle cx="54" cy="59" r="4.2" fill="#FDA4AF" fillOpacity="0.6" />
          <circle cx="94" cy="59" r="4.2" fill="#FDA4AF" fillOpacity="0.6" />

          {/* Big Heroic Expressive Red Spider Eyes */}
          <path
            d="M54 47 C59 39, 68 44, 68 56 C61 54, 57 52, 54 47 Z"
            fill="url(#squad-lens)"
            stroke="#0F172A"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <path
            d="M94 47 C89 39, 80 44, 80 56 C87 54, 91 52, 94 47 Z"
            fill="url(#squad-lens)"
            stroke="#0F172A"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />

          {/* Mascot Center Badge: "해피 🕷️" */}
          <rect x="58" y="87" width="32" height="11" rx="5.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
          <text x="74" y="95" fill="#FFFFFF" fontSize="7.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            해피 🕸️
          </text>
        </g>

        {/* Gold Star Sparkle on top left */}
        <path
          d="M10 20 Q 12 14 16 20 Q 22 22 16 24 Q 14 30 12 24 Q 6 22 10 20 Z"
          fill="url(#squad-sparkle)"
          className="animate-pulse"
        />
        <path
          d="M136 18 Q 138 13 141 18 Q 146 19 141 21 Q 139 26 138 21 Q 133 19 136 18 Z"
          fill="url(#squad-sparkle)"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};

