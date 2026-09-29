import React, { useState } from 'react';
import { HappyMascot, HappyExpression, SpiderSuitTheme, SPIDER_SUITS } from './HappyMascot';
import { Sparkles, X, ChevronUp, ChevronDown, Wand2, Printer, Palette, Heart } from 'lucide-react';
import { UserProfile, Passage } from '../types';
import { directPrintWorksheet } from '../utils/printWorksheet';

interface HappyFloatingWidgetProps {
  streakCount: number;
  savedWordsCount: number;
  onOpenGenerator: () => void;
  onOpenPrinter: () => void;
  activeProfile?: UserProfile;
  currentPassage?: Passage;
  onOpenSuitCustomizer?: () => void;
  onUpdateSuit?: (suit: SpiderSuitTheme) => void;
  onOpenAdminReport?: () => void;
  onOpenProfileModal?: () => void;
}

export const HappyFloatingWidget: React.FC<HappyFloatingWidgetProps> = ({
  streakCount,
  savedWordsCount,
  onOpenGenerator,
  onOpenPrinter,
  activeProfile,
  currentPassage,
  onOpenSuitCustomizer,
  onUpdateSuit,
  onOpenAdminReport,
  onOpenProfileModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expression, setExpression] = useState<HappyExpression>('happy');

  const isMom = activeProfile?.name === '열공마미' || activeProfile?.isMomOrAdmin;
  const currentSuit = activeProfile?.avatarTheme || 'spider-red';
  const suitInfo = SPIDER_SUITS.find((s) => s.id === currentSuit) || SPIDER_SUITS[0];

  const expressions: HappyExpression[] = ['happy', 'studying', 'cheer', 'proud', 'wink'];

  const handleMascotClick = () => {
    const nextIdx = (expressions.indexOf(expression) + 1) % expressions.length;
    setExpression(expressions[nextIdx]);
  };

  const handleCycleSuit = () => {
    const allSuits: SpiderSuitTheme[] = [
      'spider-red',
      'spider-black',
      'spider-gold',
      'spider-blue',
      'spider-pink',
      'spider-purple',
      'spider-green',
    ];
    const currentIndex = allSuits.indexOf(currentSuit);
    const nextSuit = allSuits[(currentIndex + 1) % allSuits.length];
    if (onUpdateSuit) {
      onUpdateSuit(nextSuit);
    }
  };

  const handlePrintClick = () => {
    if (currentPassage) {
      directPrintWorksheet(currentPassage, activeProfile);
    }
    onOpenPrinter();
    setIsOpen(false);
  };

  return (
    // Positioned at bottom-20 (80px above bottom on mobile) to NEVER block the mobile bottom tab bar
    <div className="fixed bottom-20 right-3 sm:bottom-4 sm:right-4 z-40 print:hidden flex flex-col items-end">
      {/* Expanded Buddy Card */}
      {isOpen && (
        <div className="mb-2 w-72 sm:w-80 bg-white rounded-3xl p-4 border border-slate-200 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-base">{isMom ? '👑' : suitInfo.icon}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1">
                    {isMom ? (
                      <span className="text-purple-900">열공마미 <span className="text-purple-600">관리자 도우미</span></span>
                    ) : (
                      <span>공부 메이트 <span className="text-red-600">해피</span></span>
                    )}
                  </h4>
                  {!isMom && (
                    <button
                      onClick={onOpenSuitCustomizer || handleCycleSuit}
                      className="text-[10px] px-2 py-0.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg border border-red-200 cursor-pointer flex items-center gap-1"
                      title="스파이더 수트 컬러 7종 변경"
                    >
                      <Palette className="w-3 h-3" />
                      <span>{suitInfo.name.split(' ')[0]}</span>
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  {isMom ? '수험생 학습 관리 & 성적표' : '수능 1등급 파트너'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mom's cheer mini badge if present (for students) */}
          {!isMom && activeProfile?.momEncouragement && (
            <div className="mb-2.5 p-2 bg-pink-50 rounded-xl border border-pink-200 flex items-center gap-2 text-[11px]">
              <span className="text-base">💌</span>
              <p className="text-pink-900 font-bold truncate flex-1">
                엄마: "{activeProfile.momEncouragement.message}"
              </p>
            </div>
          )}

          {/* Mascot speech area */}
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 mb-2.5">
            <HappyMascot
              expression={expression}
              suitTheme={currentSuit}
              size="sm"
              showSpeech={false}
              interactive={true}
              onSpeechClick={handleMascotClick}
            />
            <div className="text-xs font-bold text-slate-700 flex-1">
              <p className={`text-[11px] font-black mb-0.5 flex items-center gap-1 ${
                isMom ? 'text-purple-700' : 'text-red-600'
              }`}>
                <span>{isMom ? '👑 열공마미 가이드:' : `🕸️ ${suitInfo.badge} 해피 조언:`}</span>
              </p>
              <p className="leading-snug text-slate-600 text-[11px]">
                {isMom 
                  ? '"등록된 학생들의 매일 15분 독해 완독 여부와 성적표를 확인해보세요!"'
                  : '"거미줄처럼 단단하게 연결된 구문 독해가 1등급의 열쇠야! ✨"'}
              </p>
            </div>
          </div>

          {/* Quick Stats or Actions for Admin */}
          {isMom ? (
            <div className="space-y-2">
              <button
                onClick={() => {
                  if (onOpenAdminReport) onOpenAdminReport();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>개별 성적표 인쇄/발급</span>
              </button>
              {onOpenProfileModal && (
                <button
                  onClick={() => {
                    onOpenProfileModal();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <span>👥</span>
                  <span>학습자 관리 & 학생 모드 전환</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs mb-2.5 font-bold">
                <div className="bg-orange-50/80 p-2 rounded-2xl border border-orange-200/80 text-orange-900">
                  <span className="block text-[10px] text-orange-600 font-normal">연속 열공</span>
                  <span>🔥 {streakCount}일 달성</span>
                </div>
                <div className="bg-sky-50/80 p-2 rounded-2xl border border-sky-200/80 text-sky-900">
                  <span className="block text-[10px] text-sky-600 font-normal">암기 단어</span>
                  <span>📚 {savedWordsCount}개 보관</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                <button
                  onClick={() => {
                    onOpenGenerator();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center gap-1 px-2.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-xs cursor-pointer text-center"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>AI 지문 생성</span>
                </button>
                <button
                  onClick={handlePrintClick}
                  className="flex items-center justify-center gap-1 px-2.5 py-2 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition-all shadow-xs cursor-pointer text-center"
                  title="A4 1장 학습지 즉시 인쇄 및 PDF 저장"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>A4 1장 인쇄</span>
                </button>
              </div>
            </>
          )}

        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 p-1.5 sm:px-3.5 sm:py-2 bg-white hover:bg-slate-50 text-slate-800 rounded-full border border-slate-200 shadow-xl hover:border-slate-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        title="스파이더맨 해피 친구 열기"
      >
        <HappyMascot
          expression={expression}
          suitTheme={currentSuit}
          size="sm"
          showSpeech={false}
          interactive={false}
        />
        <div className="hidden sm:flex flex-col text-left pr-1">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-black text-slate-900">
              해피 스파이더
            </span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 font-bold text-slate-600">
              {suitInfo.badge}
            </span>
          </div>
          <span className="text-[9px] text-red-600 font-bold">1등급 지킴이! ⚡</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
        )}
      </button>
    </div>
  );
};

// Aliases for compatibility
export const TangerineFloatingWidget = HappyFloatingWidget;
export const GanadiFloatingWidget = HappyFloatingWidget;
