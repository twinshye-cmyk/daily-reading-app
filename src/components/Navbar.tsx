import React from 'react';
import { Passage, TabType, UserProfile } from '../types';
import { 
  Printer, 
  ChevronDown,
  Wand2,
  User,
  Sparkles,
  Crown
} from 'lucide-react';
import { HappyMascot, SpiderSquadLogo } from './HappyMascot';
import { directPrintWorksheet } from '../utils/printWorksheet';

export interface NavbarProps {
  currentPassage?: Passage;
  passages?: Passage[];
  onSelectPassage?: (passage: Passage) => void;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenGenerator: () => void;
  onOpenPrintModal?: () => void;
  onOpenPrinter?: () => void;
  onOpenPassageSelector?: () => void;
  onOpenSelector?: () => void;
  onOpenProfileModal?: () => void;
  onOpenAdminReportModal?: () => void;
  activeProfile?: UserProfile;
  savedWordsCount?: number;
  streakCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPassage,
  passages = [],
  activeTab,
  onTabChange,
  onOpenGenerator,
  onOpenPrintModal,
  onOpenPrinter,
  onOpenPassageSelector,
  onOpenSelector,
  onOpenProfileModal,
  onOpenAdminReportModal,
  activeProfile,
  savedWordsCount = 0,
  streakCount,
}) => {
  const handleOpenSelector = onOpenSelector || onOpenPassageSelector || (() => {});
  const handleOpenPrinter = () => {
    if (currentPassage) {
      directPrintWorksheet(currentPassage, activeProfile);
    }
    if (onOpenPrinter) onOpenPrinter();
    else if (onOpenPrintModal) onOpenPrintModal();
  };
  const isMom = activeProfile?.name === '열공마미' || activeProfile?.isMomOrAdmin;

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs print:hidden">
        <div className="max-w-6xl mx-auto px-2.5 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-1 sm:gap-2">
            
            {/* Logo & Brand Info */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
              <div 
                className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group shrink-0" 
                onClick={() => onTabChange(isMom ? 'analytics' : 'reading')}
              >
                <div className="relative shrink-0 flex items-center">
                  <SpiderSquadLogo
                    size="md"
                    className="shrink-0"
                  />
                </div>
                <div className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
                  <span className={`font-black text-sm sm:text-lg tracking-tight font-outfit whitespace-nowrap ${
                    isMom ? 'text-purple-950' : 'text-slate-900'
                  }`}>
                    {isMom ? '열공마미 학습 관리 센터' : '해피 수능 영어'}
                  </span>
                  <span className={`hidden xs:inline text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md border whitespace-nowrap shrink-0 ${
                    isMom ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {isMom ? '👑 총괄 관리' : '하루한장'}
                  </span>
                </div>
              </div>

              {/* Current Passage Selector Pill (Student Mode Only) */}
              {!isMom && currentPassage && (
                <div className="relative hidden lg:block shrink-0">
                  <button
                    onClick={handleOpenSelector}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-200 cursor-pointer hover:border-blue-300 whitespace-nowrap shrink-0"
                    title="지문 변경하기"
                  >
                    <span className="text-sm">📖</span>
                    <span className="max-w-[130px] xl:max-w-[170px] truncate text-slate-800">{currentPassage.titleKo}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/80 text-slate-700 font-bold shrink-0">
                      {passages.length}편
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 whitespace-nowrap">
              {isMom ? (
                /* Admin Specific Navigation Tabs */
                <>
                  <button
                    onClick={() => onTabChange('analytics')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-purple-700 text-white shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>👑</span>
                    <span className="whitespace-nowrap">학습자 총괄 현황</span>
                  </button>
                  {onOpenAdminReportModal && (
                    <button
                      onClick={onOpenAdminReportModal}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-purple-900 hover:bg-purple-50 transition-all cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>🖨️</span>
                      <span className="whitespace-nowrap">개별 성적표 인쇄</span>
                    </button>
                  )}
                  {onOpenProfileModal && (
                    <button
                      onClick={onOpenProfileModal}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-white/70 transition-all cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>👥</span>
                      <span className="whitespace-nowrap">학습자 관리 & 추가</span>
                    </button>
                  )}
                </>
              ) : (
                /* Student Specific Navigation Tabs */
                <>
                  <button
                    id="tab-reading-btn"
                    onClick={() => onTabChange('reading')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      activeTab === 'reading'
                        ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span>📖</span>
                    <span className="whitespace-nowrap">본문 독해</span>
                  </button>

                  <button
                    id="tab-practice-btn"
                    onClick={() => onTabChange('practice')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      activeTab === 'practice'
                        ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span>🎯</span>
                    <span className="whitespace-nowrap">수능 문제</span>
                  </button>

                  <button
                    id="tab-vocabulary-btn"
                    onClick={() => onTabChange('vocab')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      activeTab === 'vocab'
                        ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span>📚</span>
                    <span className="whitespace-nowrap">단어장</span>
                    {savedWordsCount > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-700 font-bold shrink-0">
                        {savedWordsCount}
                      </span>
                    )}
                  </button>

                  <button
                    id="tab-analytics-btn"
                    onClick={() => onTabChange('analytics')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      activeTab === 'analytics'
                        ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span>📊</span>
                    <span className="whitespace-nowrap">학습 리포트</span>
                  </button>
                </>
              )}
            </nav>

            {/* Action CTAs */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 whitespace-nowrap">
              
              {/* Learner / Admin Profile Button */}
              {activeProfile && onOpenProfileModal && (
                <button
                  onClick={onOpenProfileModal}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 shadow-2xs transition-all ${
                    isMom
                      ? 'bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-950 font-black'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                  title={isMom ? '열공마미 총괄 관리자 모드' : `${activeProfile.name} 프로필 & 수트 설정`}
                >
                  {isMom ? (
                    <Crown className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                  ) : (
                    <span className="text-xs">👤</span>
                  )}
                  <span className="max-w-[65px] sm:max-w-[85px] truncate text-[11px] sm:text-xs">
                    {isMom ? '열공마미' : activeProfile.name}
                  </span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                    isMom ? 'bg-purple-700 text-white' : 'bg-slate-200 text-slate-600 hidden sm:inline'
                  }`}>
                    {isMom ? '관리자' : '학습자'}
                  </span>
                  <ChevronDown className={`w-3 h-3 shrink-0 ${isMom ? 'text-purple-600' : 'text-slate-400'}`} />
                </button>
              )}

              {isMom ? (
                /* Admin Action Shortcuts */
                <>
                  {onOpenAdminReportModal && (
                    <button
                      onClick={onOpenAdminReportModal}
                      className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-black text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
                      title="1인 1매 정밀 성적표 발급 & 출력"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>성적표 인쇄</span>
                    </button>
                  )}
                  {onOpenProfileModal && (
                    <button
                      onClick={onOpenProfileModal}
                      className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl shadow-2xs transition-all cursor-pointer whitespace-nowrap shrink-0"
                      title="학습자 관리 & 학생 모드 전환"
                    >
                      <span>🔄</span>
                      <span className="hidden sm:inline">학습자 전환</span>
                      <span className="sm:hidden text-[11px]">전환</span>
                    </button>
                  )}
                </>
              ) : (
                /* Student Action Shortcuts */
                <>
                  {/* Mobile/Tablet Passage Switcher Button */}
                  <button
                    onClick={handleOpenSelector}
                    className="lg:hidden flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer whitespace-nowrap shrink-0"
                    title="지문 목록 선택"
                  >
                    <span className="text-xs">📖</span>
                    <span className="text-[11px] whitespace-nowrap">지문</span>
                  </button>

                  {/* Streak Badge */}
                  <div 
                    className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-1.5 bg-orange-50 border border-orange-200 rounded-xl text-orange-900 text-xs font-black shadow-2xs hover:scale-105 transition-transform whitespace-nowrap shrink-0"
                    title="연속 열공 스트릭"
                  >
                    <span className="text-xs sm:text-sm">🔥</span>
                    <span className="tracking-tight text-[11px] sm:text-xs whitespace-nowrap">{streakCount}일</span>
                  </div>

                  {/* AI Generator Button (Desktop / Tablet top bar) */}
                  <button
                    id="btn-open-ai-generator"
                    onClick={onOpenGenerator}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
                    title="AI 맞춤 지문 생성"
                  >
                    <Wand2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">AI 지문 생성</span>
                  </button>

                  {/* Print Worksheet Button */}
                  <button
                    id="btn-open-printer"
                    onClick={handleOpenPrinter}
                    className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer whitespace-nowrap shrink-0"
                    title="A4 학습지 인쇄 및 PDF 저장"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="whitespace-nowrap">A4 인쇄</span>
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-1 py-1.5 flex items-center justify-around print:hidden">
        {isMom ? (
          /* Admin Mobile Bar */
          <>
            <button
              onClick={() => onTabChange('analytics')}
              className="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer whitespace-nowrap text-purple-700 font-bold bg-purple-50"
            >
              <span className="text-base">👑</span>
              <span className="text-[10px] whitespace-nowrap font-black">학습자 현황</span>
            </button>
            {onOpenAdminReportModal && (
              <button
                onClick={onOpenAdminReportModal}
                className="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer whitespace-nowrap text-slate-600 hover:text-purple-700"
              >
                <span className="text-base">🖨️</span>
                <span className="text-[10px] whitespace-nowrap">성적표 인쇄</span>
              </button>
            )}
            <button
              onClick={onOpenGenerator}
              className="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer whitespace-nowrap text-blue-700 font-bold bg-blue-50/80 border border-blue-200"
            >
              <span className="text-base">🪄</span>
              <span className="text-[10px] whitespace-nowrap text-blue-700 font-black">AI 지문</span>
            </button>
            {onOpenProfileModal && (
              <button
                onClick={onOpenProfileModal}
                className="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer whitespace-nowrap text-slate-600 hover:text-purple-700"
              >
                <span className="text-base">👥</span>
                <span className="text-[10px] whitespace-nowrap">학습자 관리</span>
              </button>
            )}
          </>
        ) : (
          /* Student Mobile Bar */
          <>
            <button
              onClick={() => onTabChange('reading')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'reading'
                  ? 'text-blue-600 font-bold bg-blue-50'
                  : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              <span className="text-base">🏠</span>
              <span className="text-[10px] whitespace-nowrap">홈 · 독해</span>
            </button>

            <button
              onClick={() => onTabChange('practice')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'practice'
                  ? 'text-blue-600 font-bold bg-blue-50'
                  : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              <span className="text-base">🎯</span>
              <span className="text-[10px] whitespace-nowrap">수능 문제</span>
            </button>

            <button
              onClick={() => onTabChange('vocab')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === 'vocab'
                  ? 'text-blue-600 font-bold bg-blue-50'
                  : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              <span className="text-base">📚</span>
              <span className="text-[10px] whitespace-nowrap">단어장</span>
              {savedWordsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 px-1 py-0.1 rounded-full text-[8px] bg-blue-600 text-white font-bold">
                  {savedWordsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('analytics')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'text-blue-600 font-bold bg-blue-50'
                  : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              <span className="text-base">📊</span>
              <span className="text-[10px] whitespace-nowrap">학습 리포트</span>
            </button>

            {/* Mobile Shortcut for AI Passage Generator (Placed right next to Study Report) */}
            <button
              id="mobile-btn-ai-generator"
              onClick={onOpenGenerator}
              className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-95"
              title="AI 맞춤 수능 지문 생성"
            >
              <span className="text-base animate-pulse">✨</span>
              <span className="text-[10px] font-black whitespace-nowrap">AI 지문생성</span>
            </button>
          </>
        )}
      </div>
    </>
  );
};
