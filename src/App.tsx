import React, { useState, useEffect } from 'react';
import { TabType, Passage, SavedWord, UserProfile, GradeType, SpiderSuitTheme } from './types';
import { CURATED_PASSAGES } from './data/passages';
import { 
  getStoredPassages, 
  saveCustomPassage, 
  getSavedWords, 
  calculateStreak, 
  initDefaultData,
  getUserProfiles,
  getActiveProfile,
  setActiveProfileId,
  createUserProfile,
  deleteUserProfile,
  updateLearnerSuit
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { PassageSelectorModal } from './components/PassageSelectorModal';
import { PassageGeneratorModal } from './components/PassageGeneratorModal';
import { SentenceAnalysisModal } from './components/SentenceAnalysisModal';
import { PrintWorksheetModal } from './components/PrintWorksheetModal';
import { PrintAdminReportModal } from './components/PrintAdminReportModal';
import { UserProfileModal } from './components/UserProfileModal';
import { SuitCustomizerModal } from './components/SuitCustomizerModal';
import { ReadingView } from './components/ReadingView';
import { PracticeView } from './components/PracticeView';
import { VocabularyView } from './components/VocabularyView';
import { AnalyticsView } from './components/AnalyticsView';
import { HappyMascot, SPIDER_SUITS } from './components/HappyMascot';
import { HappyFloatingWidget } from './components/HappyFloatingWidget';
import { Sparkles, User, Award, Palette, Crown, Heart } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('reading');
  const [passages, setPassages] = useState<Passage[]>(CURATED_PASSAGES);
  const [currentPassage, setCurrentPassage] = useState<Passage>(CURATED_PASSAGES[0]);
  const [savedWordsCount, setSavedWordsCount] = useState(0);
  const [streakCount, setStreakCount] = useState(1);

  // User Profiles State
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfile, setActiveProfileState] = useState<UserProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSuitModalOpen, setIsSuitModalOpen] = useState(false);

  const [isPrintReportModalOpen, setIsPrintReportModalOpen] = useState(false);
  const [printReportTargetLearnerId, setPrintReportTargetLearnerId] = useState<string | null>(null);

  // Modals state
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [analysisSentence, setAnalysisSentence] = useState<string | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    initDefaultData();
    refreshAllData();

    const handleStorageSynced = () => {
      refreshAllData();
    };

    window.addEventListener('app_storage_synced', handleStorageSynced);
    return () => {
      window.removeEventListener('app_storage_synced', handleStorageSynced);
    };
  }, []);

  const refreshAllData = () => {
    // 1. Load profiles
    const profs = getUserProfiles();
    setProfiles(profs);
    const currProfile = getActiveProfile();
    setActiveProfileState(currProfile);

    // 2. Load passages
    const loadedPassages = getStoredPassages();
    setPassages(loadedPassages);
    
    // Maintain current or fallback to first
    if (!currentPassage || !loadedPassages.some((p) => p.id === currentPassage.id)) {
      setCurrentPassage(loadedPassages[0] || CURATED_PASSAGES[0]);
    }

    // 3. Load user-scoped stats
    const words = getSavedWords(currProfile?.id);
    setSavedWordsCount(words.length);
    setStreakCount(calculateStreak(currProfile?.id));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSelectProfile = (profileId: string) => {
    setActiveProfileId(profileId);
    refreshAllData();
    const target = profiles.find((p) => p.id === profileId);
    const isTargetMom = target?.name === '열공마미' || target?.isMomOrAdmin;
    if (isTargetMom) {
      setActiveTab('analytics');
      showToast(`'열공마미' 학습 관리 센터로 연결되었습니다. 📊👑`);
    } else {
      setActiveTab('reading');
      showToast(`'${target?.name || '학습자'}' 님 맞춤 독해 모드로 전환되었습니다. ✨`);
    }
  };

  const handleCreateProfile = (name: string, grade: GradeType, targetLevel: string, avatarTheme: SpiderSuitTheme) => {
    const newProf = createUserProfile(name, grade, targetLevel, avatarTheme);
    refreshAllData();
    showToast(`새 학습자 '${newProf.name}' 님이 등록되었습니다! 🕷️✨`);
  };

  const handleDeleteProfile = (profileId: string) => {
    const isCurrentAdmin = activeProfile?.name === '열공마미' || activeProfile?.isMomOrAdmin;
    if (!isCurrentAdmin) {
      showToast('❌ 학습자 삭제는 관리자(열공마미)만 가능합니다.');
      return;
    }
    const success = deleteUserProfile(profileId, true);
    if (success) {
      refreshAllData();
      showToast('학습자 프로필이 삭제되었습니다.');
    }
  };

  const handleUpdateSuit = (profileId: string, newSuit: SpiderSuitTheme) => {
    updateLearnerSuit(profileId, newSuit);
    refreshAllData();
    const suitObj = SPIDER_SUITS.find((s) => s.id === newSuit);
    showToast(`스파이더 수트가 '${suitObj?.name || newSuit}'(으)로 변경되었습니다! 🎨🕸️`);
  };

  const handleActiveLearnerSuitChange = (newSuit: SpiderSuitTheme) => {
    if (activeProfile) {
      handleUpdateSuit(activeProfile.id, newSuit);
    }
  };

  const handleSelectPassage = (passage: Passage) => {
    setCurrentPassage(passage);
    setIsSelectorOpen(false);
    showToast(`'${passage.titleKo}' 지문으로 변경되었습니다. 📖`);
  };

  const handlePassageGenerated = (newPassage: Passage) => {
    saveCustomPassage(newPassage);
    const updated = getStoredPassages();
    setPassages(updated);
    setCurrentPassage(newPassage);
    setActiveTab('reading');
    showToast(`AI 맞춤 수능 지문 '${newPassage.title}'이(가) 생성되었습니다! 🕸️✨`);
  };

  const handleAnalyzeSentence = (sentence: string) => {
    setAnalysisSentence(sentence);
  };

  const handleWordSavedNotification = (word: string) => {
    refreshAllData();
    showToast(`'${word}' 단어가 ${activeProfile?.name || ''} 단어장에 저장되었습니다. 📚`);
  };

  const isMomAdmin = activeProfile?.name === '열공마미' || activeProfile?.isMomOrAdmin;
  const currentSuitTheme = activeProfile?.avatarTheme || 'spider-red';
  const currentSuitObj = SPIDER_SUITS.find((s) => s.id === currentSuitTheme) || SPIDER_SUITS[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-red-600 selection:text-white relative overflow-x-hidden">
      
      {/* Top Main Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentPassage={currentPassage}
        passages={passages}
        onOpenPassageSelector={() => setIsSelectorOpen(true)}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAdminReportModal={() => {
          const learners = profiles.filter((p) => p.name !== '열공마미' && !p.isMomOrAdmin);
          setPrintReportTargetLearnerId(learners[0]?.id || null);
          setIsPrintReportModalOpen(true);
        }}
        activeProfile={activeProfile || undefined}
        savedWordsCount={savedWordsCount}
        streakCount={streakCount}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 sm:top-20 right-3 sm:right-6 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-900 text-white rounded-2xl shadow-xl text-xs font-bold border border-slate-700">
            <span className="text-sm sm:text-base">🕷️</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Daily Cheerful Spider-Man Happy Mascot Banner */}
      <div className="max-w-5xl w-full mx-auto px-2.5 sm:px-6 pt-2.5 sm:pt-4 pb-1 print:hidden">
        <div className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 text-xs flex-1">
            <div 
              className="cursor-pointer hover:scale-105 transition-transform shrink-0" 
              onClick={() => setIsSuitModalOpen(true)}
              title="클릭하여 스파이더 수트 컬러 7종 변경"
            >
              <HappyMascot
                expression="happy"
                suitTheme={currentSuitTheme}
                size="sm"
                showSpeech={false}
                interactive={false}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-700 break-keep flex-wrap">
                <span className="text-red-600 font-black whitespace-nowrap">스파이더맨 해피:</span>
                <span className="text-slate-900 font-bold tracking-wide">
                  {activeProfile && !isMomAdmin && `${activeProfile.name} 님! `}
                  "매일 15분 독해 루틴이 만드는 기적! 오늘도 거미줄처럼 탄탄한 구문 독해로 수능 1등급 잡자! 🕸️✨"
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <p className="text-[10px] text-slate-500 font-medium hidden sm:block break-keep">
                  현재 수트: <span className="font-bold text-slate-700">{currentSuitObj.name}</span> ({currentSuitObj.badge})
                </p>
                <button
                  onClick={() => setIsSuitModalOpen(true)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-red-50 hover:bg-red-100 text-red-700 font-bold border border-red-200 cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <Palette className="w-3 h-3" />
                  <span>수트 색상 변경 (7종)</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* User Profile Quick Tag & Stats */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium whitespace-nowrap shrink-0">
            {activeProfile && (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className={`flex items-center gap-1 px-3 py-1 rounded-xl border font-bold whitespace-nowrap cursor-pointer transition-colors shadow-2xs ${
                  isMomAdmin
                    ? 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-800'
                    : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
                }`}
                title="프로필 / 학습자 변경"
              >
                {isMomAdmin ? <Crown className="w-3 h-3 text-purple-600" /> : <User className="w-3 h-3 text-red-600" />}
                <span>{activeProfile.name} {activeProfile.grade ? `(${activeProfile.grade})` : '관리자'}</span>
              </button>
            )}
            <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 text-slate-700 font-bold whitespace-nowrap">
              ⏱️ 매일 15분
            </span>
            <span className="flex items-center gap-1 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200 text-sky-700 font-bold whitespace-nowrap">
              📚 단어 {savedWordsCount}개
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-2.5 sm:px-6 py-2.5 sm:py-4 pb-28 md:pb-16 print:hidden">
        {activeTab === 'reading' && (
          <ReadingView
            passage={currentPassage}
            onGoToPractice={() => setActiveTab('practice')}
            onGoToVocab={() => setActiveTab('vocab')}
            onAnalyzeSentence={handleAnalyzeSentence}
            onWordSavedNotification={handleWordSavedNotification}
            activeProfile={activeProfile || undefined}
            allPassages={passages}
            onSelectPassage={handleSelectPassage}
            onOpenPassageSelector={() => setIsSelectorOpen(true)}
            onGoToAnalytics={() => setActiveTab('analytics')}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeView
            passage={currentPassage}
            onGoToVocab={() => setActiveTab('vocab')}
            onStudyCompleted={() => {
              setStreakCount(calculateStreak(activeProfile?.id));
              showToast('오늘의 수능 독해 학습 완료 도장 쾅! 💮');
            }}
          />
        )}

        {activeTab === 'vocab' && (
          <VocabularyView
            currentPassage={currentPassage}
            onWordListChanged={refreshAllData}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView 
            streakCount={streakCount} 
            activeProfile={activeProfile || undefined}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onGoToHome={() => setActiveTab('reading')}
            onSelectProfile={handleSelectProfile}
            onOpenSuitModal={() => setIsSuitModalOpen(true)}
          />
        )}
      </main>

      {/* Floating Spider-Man Happy Interactive Companion Widget */}
      {/* Positioned comfortably above the mobile bottom bar to eliminate overlap */}
      <div className="print:hidden">
        <HappyFloatingWidget
          streakCount={streakCount}
          savedWordsCount={savedWordsCount}
          onOpenGenerator={() => setIsGeneratorOpen(true)}
          onOpenPrinter={() => setIsPrintModalOpen(true)}
          onOpenAdminReport={() => {
            const learners = profiles.filter((p) => p.name !== '열공마미' && !p.isMomOrAdmin);
            setPrintReportTargetLearnerId(learners[0]?.id || null);
            setIsPrintReportModalOpen(true);
          }}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          activeProfile={activeProfile || undefined}
          currentPassage={currentPassage}
          onOpenSuitCustomizer={() => setIsSuitModalOpen(true)}
          onUpdateSuit={handleActiveLearnerSuitChange}
        />
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 sm:py-7 text-xs text-slate-500 print:hidden mt-auto mb-14 md:mb-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Left brand info with Happy Spider mascot */}
            <div className="space-y-1 text-center sm:text-left flex flex-col sm:flex-row items-center gap-2.5">
              <HappyMascot
                expression="studying"
                suitTheme={currentSuitTheme}
                size="sm"
                showSpeech={false}
                interactive={false}
              />
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="font-black text-slate-800 text-sm tracking-tight">
                    스파이더맨 해피와 함께하는 하루 한 장 수능 영어 독해
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-bold border border-red-200">
                    CSAT Daily
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] font-medium">
                  스파이더 수트 7종 맞춤 선택 · 열공마미 학습 관리 센터 · 학년/난이도별 AI 독해 & A4 인쇄 🕸️
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-1 text-center sm:text-left font-medium">
            <span>© 2025 해피 수능 영어 다이어리. All rights reserved.</span>
            <span className="text-slate-600 font-bold">Designed with 💖 by 김근혜</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profiles={profiles}
        activeProfileId={activeProfile?.id || ''}
        activeProfile={activeProfile}
        onSelectProfile={handleSelectProfile}
        onCreateProfile={handleCreateProfile}
        onDeleteProfile={handleDeleteProfile}
        onUpdateSuit={handleUpdateSuit}
      />

      <SuitCustomizerModal
        isOpen={isSuitModalOpen}
        onClose={() => setIsSuitModalOpen(false)}
        currentSuit={currentSuitTheme}
        onSelectSuit={handleActiveLearnerSuitChange}
        activeProfile={activeProfile || undefined}
      />

      <PassageSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        passages={passages}
        currentPassageId={currentPassage?.id}
        onSelectPassage={handleSelectPassage}
        onOpenGenerator={() => {
          setIsSelectorOpen(false);
          setIsGeneratorOpen(true);
        }}
        activeProfile={activeProfile || undefined}
      />

      <PassageGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onPassageGenerated={handlePassageGenerated}
      />

      <SentenceAnalysisModal
        isOpen={!!analysisSentence}
        onClose={() => setAnalysisSentence(null)}
        sentence={analysisSentence || ''}
        context={currentPassage?.paragraphs.map((p) => p.textEn).join('\n')}
      />

      <PrintWorksheetModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        passage={currentPassage}
        activeProfile={activeProfile || undefined}
      />

      <PrintAdminReportModal
        isOpen={isPrintReportModalOpen}
        onClose={() => {
          setIsPrintReportModalOpen(false);
          refreshAllData();
        }}
        allProfiles={profiles}
        activeProfile={activeProfile || undefined}
        initialLearnerId={printReportTargetLearnerId}
        onEncouragementUpdated={refreshAllData}
      />

    </div>
  );
}

export default App;
