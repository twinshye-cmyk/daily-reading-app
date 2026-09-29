import React, { useState, useEffect } from 'react';
import { StudyRecord, UserProfile, MomEncouragement, SpiderSuitTheme } from '../types';
import { 
  BarChart3, 
  Flame, 
  Clock, 
  Award, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  BookOpen, 
  Layers,
  ArrowLeft,
  RotateCcw,
  User,
  GraduationCap,
  Crown,
  Send,
  Heart,
  Star,
  Trophy,
  Check,
  Printer,
  ChevronRight,
  ShieldCheck,
  Smile,
  MessageSquareQuote,
  Trash2
} from 'lucide-react';
import { 
  getStudyRecords, 
  getSavedWords, 
  clearStudyRecords, 
  getUserProfiles, 
  calculateStreak,
  sendMomEncouragement,
  updateLearnerSuit,
  resetLearnerData,
  resetAllLearnersData,
  deleteUserProfile
} from '../utils/storage';
import { HappyMascot, SPIDER_SUITS } from './HappyMascot';
import { PrintAdminReportModal } from './PrintAdminReportModal';

interface AnalyticsViewProps {
  streakCount: number;
  onGoToHome?: () => void;
  activeProfile?: UserProfile;
  onOpenProfileModal?: () => void;
  onSelectProfile?: (profileId: string) => void;
  onOpenSuitModal?: () => void;
}

const MOM_STAMP_CONFIG: Record<MomEncouragement['stamp'], { label: string; icon: string; bg: string; border: string; text: string }> = {
  heart: { label: '사랑의 응원 도장', icon: '💖', bg: 'bg-pink-50', border: 'border-pink-300', text: 'text-pink-700' },
  king: { label: '수능 1등급 보증 도장', icon: '👑', bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700' },
  fire: { label: '열공 불꽃 도장', icon: '🔥', bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700' },
  star: { label: '슈퍼스타 성실 도장', icon: '⭐', bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700' },
  trophy: { label: '수능 대박 트로피 도장', icon: '🏆', bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700' },
  spider: { label: '스파이더 영웅 도장', icon: '🕸️', bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700' },
};

const MOM_PRESET_MESSAGES = [
  '매일 꾸준히 15분 독해 루틴 지키는 모습이 정말 자랑스러워! 💖',
  '오늘도 집중력 최고! 어려운 구문도 침착하게 정복했네! 🌟',
  '수능 영어 1등급을 향해 하루하루 차근차근 나아가자! 엄마가 늘 응원해! 👑',
  '단어 암기까지 완벽 마스터! 수능 어휘왕 등극! 📚',
  '큰 힘에는 큰 실력이 따르는 법! 지치지 말고 파이팅! 💪',
];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ 
  streakCount, 
  onGoToHome,
  activeProfile,
  onOpenProfileModal,
  onSelectProfile,
  onOpenSuitModal,
}) => {
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [memorizedWordCount, setMemorizedWordCount] = useState(0);
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>([]);
  
  // Mom Admin State
  const isMomAdmin = activeProfile?.name === '열공마미' || activeProfile?.isMomOrAdmin;
  const [selectedLearnerForDetail, setSelectedLearnerForDetail] = useState<string | null>(null);
  const [deletingProfileId, setDeletingProfileId] = useState<string | null>(null);
  
  // Admin Record Reset Modal State
  const [showAdminResetModal, setShowAdminResetModal] = useState(false);
  const [adminResetTargetId, setAdminResetTargetId] = useState<string>('all');
  const [adminResetOptions, setAdminResetOptions] = useState({
    resetRecords: true,
    resetWords: true,
    resetEncouragement: false,
  });

  const handleDeleteLearner = (profileId: string) => {
    deleteUserProfile(profileId, true);
    setDeletingProfileId(null);
    loadData();
  };

  // Print Admin Report Modal State
  const [isPrintReportModalOpen, setIsPrintReportModalOpen] = useState(false);
  const [printReportTargetLearnerId, setPrintReportTargetLearnerId] = useState<string | null>(null);
  
  // Encouragement form state (Mom -> Learner)
  const [targetLearnerId, setTargetLearnerId] = useState<string>('');
  const [encMessage, setEncMessage] = useState<string>('');
  const [encStamp, setEncStamp] = useState<MomEncouragement['stamp']>('heart');
  const [showEncSuccessToast, setShowEncSuccessToast] = useState<string | null>(null);

  const loadData = () => {
    const profs = getUserProfiles();
    setAllProfiles(profs);

    // Target learner for detail in mom mode or current user
    const targetUid = isMomAdmin && selectedLearnerForDetail 
      ? selectedLearnerForDetail 
      : activeProfile?.id;

    const r = getStudyRecords(targetUid);
    setRecords(r);
    const words = getSavedWords(targetUid);
    setMemorizedWordCount(words.filter((w) => w.status === 'memorized').length);
  };

  useEffect(() => {
    loadData();

    const handleSynced = () => {
      loadData();
    };

    window.addEventListener('app_storage_synced', handleSynced);
    return () => {
      window.removeEventListener('app_storage_synced', handleSynced);
    };
  }, [activeProfile?.id, selectedLearnerForDetail, isMomAdmin]);

  const handleAdminResetExecute = () => {
    if (adminResetTargetId === 'all') {
      resetAllLearnersData({
        resetRecords: adminResetOptions.resetRecords,
        resetWords: adminResetOptions.resetWords,
        resetEncouragement: adminResetOptions.resetEncouragement,
      });
      setShowEncSuccessToast('전체 학생의 학습 기록이 초기화되었습니다. 🔄');
    } else {
      resetLearnerData(adminResetTargetId, {
        resetRecords: adminResetOptions.resetRecords,
        resetWords: adminResetOptions.resetWords,
        resetEncouragement: adminResetOptions.resetEncouragement,
      });
      const targetLearner = allProfiles.find((p) => p.id === adminResetTargetId);
      setShowEncSuccessToast(`'${targetLearner?.name || '학습자'}' 학생의 기록이 초기화되었습니다. 🔄`);
    }
    loadData();
    setShowAdminResetModal(false);
    setTimeout(() => setShowEncSuccessToast(null), 3000);
  };

  const handleSendEncouragement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetLearnerId) return;
    const finalMsg = encMessage.trim() || MOM_PRESET_MESSAGES[0];
    const updated = sendMomEncouragement(targetLearnerId, finalMsg, encStamp, '열공마미');
    if (updated) {
      setAllProfiles(getUserProfiles());
      setShowEncSuccessToast(`'${updated.name}' 학생에게 칭찬 도장 & 응원 편지를 전송했습니다! 💌`);
      setTimeout(() => setShowEncSuccessToast(null), 3000);
      setEncMessage('');
    }
  };

  // Learners list (excluding Mom)
  const learners = allProfiles.filter((p) => p.name !== '열공마미' && !p.isMomOrAdmin);

  // Compute student stats
  const totalCompleted = records.length;
  const totalSeconds = records.reduce((acc, r) => acc + (r.timeSpentSeconds || 0), 0);
  const totalMinutes = Math.round(totalSeconds / 60);
  const averageScore =
    totalCompleted > 0
      ? Math.round(records.reduce((acc, r) => acc + (r.score || 0), 0) / totalCompleted)
      : 0;

  const categoryCounts: Record<string, number> = {
    science: 0,
    tech: 0,
    economy: 0,
    psychology: 0,
    art: 0,
    humanities: 0,
  };

  records.forEach((r) => {
    if (categoryCounts[r.category] !== undefined) {
      categoryCounts[r.category]++;
    } else {
      categoryCounts.science++;
    }
  });

  const categoryLabels: Record<string, string> = {
    science: '과학·생명',
    tech: 'AI·기술',
    economy: '경제·경영',
    psychology: '심리·행동',
    art: '예술·건축',
    humanities: '인문·철학',
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const today = new Date();
  const past30Days = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date(today.getTime() - (27 - i) * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const studied = records.some((r) => r.date === dateStr);
    return {
      date: dateStr,
      dayNum: d.getDate(),
      month: d.getMonth() + 1,
      studied,
    };
  });

  const recentRecords = records.slice(-7);

  // Mom's Overall Summary Calculations
  const totalLearnersCount = learners.length;
  const learnersTodayCompletedCount = learners.filter((learner) => {
    const lRecords = getStudyRecords(learner.id);
    return lRecords.some((r) => r.date === todayStr);
  }).length;

  return (
    <div className="space-y-5">

      {/* Toast Notification */}
      {showEncSuccessToast && (
        <div className="fixed top-16 sm:top-20 right-4 sm:right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl text-xs font-bold border border-slate-700">
            <span className="text-base">💌</span>
            <span>{showEncSuccessToast}</span>
          </div>
        </div>
      )}

      {/* Top Navigation Bar: Return to Home & Learner Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {onGoToHome ? (
          <button
            onClick={onGoToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-red-600 hover:border-red-300 font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>← 본문 독해로 돌아가기</span>
          </button>
        ) : <div />}
        
        <div className="flex items-center gap-2">
          {activeProfile && onOpenProfileModal && (
            <button
              onClick={onOpenProfileModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs shadow-2xs transition-colors cursor-pointer ${
                isMomAdmin
                  ? 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100'
                  : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
              }`}
            >
              {isMomAdmin ? <Crown className="w-3.5 h-3.5 text-purple-600" /> : <User className="w-3.5 h-3.5 text-red-600" />}
              <span>{isMomAdmin ? '👑 관리자 모드 (열공마미)' : `학습자: ${activeProfile.name} (${activeProfile.grade})`}</span>
              <span className="text-[10px] underline ml-0.5 opacity-80">전환</span>
            </button>
          )}

          {!isMomAdmin && onOpenSuitModal && (
            <button
              onClick={onOpenSuitModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-600 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <span>🎨</span>
              <span>수트 변경</span>
            </button>
          )}

          {isMomAdmin && (
            <button
              onClick={() => {
                setAdminResetTargetId(selectedLearnerForDetail || 'all');
                setShowAdminResetModal(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-[11px] font-bold transition-colors cursor-pointer border border-slate-200 hover:border-rose-300 bg-white shadow-2xs"
              title="관리자 권한: 학습 기록 초기화"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
              <span>기록 초기화</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Mode Multi/Single Learner Reset Center Modal */}
      {isMomAdmin && showAdminResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-sm font-black">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    관리자 학습 기록 초기화
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    수험생의 학습 내역 및 데이터를 선별하여 초기화합니다
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowAdminResetModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                닫기
              </button>
            </div>

            {/* Target Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                1. 초기화 대상 학생 선택
              </label>
              <select
                value={adminResetTargetId}
                onChange={(e) => setAdminResetTargetId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold text-slate-800"
              >
                <option value="all">🌐 전체 학생 일괄 초기화 (모든 등록 학생)</option>
                {learners.map((l) => (
                  <option key={l.id} value={l.id}>
                    👤 {l.name} ({l.grade || '수험생'} · {l.targetLevel || '수능 준비'})
                  </option>
                ))}
              </select>
            </div>

            {/* What to Reset Checkboxes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                2. 초기화할 항목 선택
              </label>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={adminResetOptions.resetRecords}
                    onChange={(e) => setAdminResetOptions(prev => ({ ...prev, resetRecords: e.target.checked }))}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                  />
                  <span>📖 지문 독해 완료 내역 & 문제 풀이 성적 기록</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={adminResetOptions.resetWords}
                    onChange={(e) => setAdminResetOptions(prev => ({ ...prev, resetWords: e.target.checked }))}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                  />
                  <span>📚 저장된 단어장 & 영단어 암기 완료 상태</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={adminResetOptions.resetEncouragement}
                    onChange={(e) => setAdminResetOptions(prev => ({ ...prev, resetEncouragement: e.target.checked }))}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                  />
                  <span>💌 열공마미 칭찬 도장 및 응원 편지 내역</span>
                </label>
              </div>
            </div>

            {/* Warning Notice */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed font-medium flex items-start gap-2">
              <span className="text-sm">⚠️</span>
              <span>
                {adminResetTargetId === 'all' 
                  ? '모든 학생의 선택된 학습 기록이 삭제되며 즉시 0회/0점으로 리셋됩니다. 새 학기나 새로운 학습을 시작할 때 권장됩니다.' 
                  : '선택한 학생의 지정된 학습 데이터가 초기화됩니다.'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAdminResetModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleAdminResetExecute}
                disabled={!adminResetOptions.resetRecords && !adminResetOptions.resetWords && !adminResetOptions.resetEncouragement}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white shadow-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>선택 항목 초기화 실행</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 👑 VIEW A: MOM'S ADMIN MONITORING & MANAGEMENT CENTER */}
      {/* ========================================================================= */}
      {isMomAdmin && !selectedLearnerForDetail ? (
        <div className="space-y-5">
          
          {/* Mom Hero Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-8xl">
              👑
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/40 text-purple-300 flex items-center justify-center text-2xl shadow-inner shrink-0">
                  👑
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                      열공마미의 일일 수험생 관리 센터
                    </h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 font-bold border border-purple-400/40">
                      총괄 관리자
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    우리 아이들이 매일 열심히 공부하고 있는지 한눈에 모니터링하고 칭찬 도장을 찍어주세요. 💌
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setAdminResetTargetId('all');
                    setShowAdminResetModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-bold text-xs border border-rose-400/30 shadow-xs transition-colors cursor-pointer"
                  title="관리자 학습 기록 초기화"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                  <span>기록 초기화</span>
                </button>
                <button
                  onClick={() => {
                    setPrintReportTargetLearnerId(learners[0]?.id || null);
                    setIsPrintReportModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  title="학생별 1인 1매 개별 성적표 출력 및 코멘트 작성"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>개별 성적표 인쇄</span>
                </button>
                {onOpenProfileModal && (
                  <button
                    onClick={onOpenProfileModal}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors cursor-pointer"
                  >
                    <span>+ 학습자 추가/관리</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stat Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/80">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[11px] text-slate-400 font-medium block">등록된 수험생/학생</span>
                <span className="text-xl font-black text-white">{totalLearnersCount}명</span>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[11px] text-slate-400 font-medium block">오늘 완독 현황</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-emerald-400">{learnersTodayCompletedCount}명</span>
                  <span className="text-xs text-slate-400">/ {totalLearnersCount}명</span>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[11px] text-slate-400 font-medium block">오늘 전체 달성률</span>
                <span className="text-xl font-black text-amber-400">
                  {totalLearnersCount > 0 ? Math.round((learnersTodayCompletedCount / totalLearnersCount) * 100) : 0}%
                </span>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[11px] text-slate-400 font-medium block">칭찬 도장 전송</span>
                <span className="text-xl font-black text-pink-400">
                  {learners.filter((l) => l.momEncouragement).length}건 발송됨
                </span>
              </div>
            </div>
          </div>

          {/* Section: Learner Cards (Daily Status & Encouragement) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  학습자별 오늘 공부 현황 & 칭찬 관리
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                오늘 기준 ({todayStr})
              </span>
            </div>

            {learners.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <p className="text-sm font-bold text-slate-700">등록된 학습자가 없습니다.</p>
                <p className="text-xs text-slate-400">상단의 [+ 학습자 추가/관리] 버튼을 눌러 자녀나 학생을 등록해주세요.</p>
                {onOpenProfileModal && (
                  <button
                    onClick={onOpenProfileModal}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
                  >
                    학습자 등록하기
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {learners.map((learner) => {
                  const lRecords = getStudyRecords(learner.id);
                  const lStreak = calculateStreak(learner.id);
                  const lWords = getSavedWords(learner.id);
                  const lMemorized = lWords.filter((w) => w.status === 'memorized').length;
                  const todayRecords = lRecords.filter((r) => r.date === todayStr);
                  const isStudiedToday = todayRecords.length > 0;
                  const latestRecord = lRecords[lRecords.length - 1];
                  const avgScore = lRecords.length > 0
                    ? Math.round(lRecords.reduce((acc, r) => acc + (r.score || 0), 0) / lRecords.length)
                    : 0;

                  return (
                    <div
                      key={learner.id}
                      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all"
                    >
                      {/* Learner Card Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3.5">
                          <div className="p-2 bg-slate-50 rounded-2xl border border-slate-200 shrink-0">
                            <HappyMascot
                              expression={isStudiedToday ? 'proud' : 'studying'}
                              suitTheme={learner.avatarTheme || 'spider-red'}
                              size="md"
                              showSpeech={false}
                              interactive={false}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-black text-slate-900">{learner.name}</h4>
                              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                                {learner.grade || '수험생'}
                              </span>
                              <span className="text-[11px] font-bold text-slate-500">
                                {learner.targetLevel}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {isStudiedToday ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>오늘 15분 독해 완료! 🎉</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                                  <span>⏳ 오늘 아직 학습 전</span>
                                </span>
                              )}
                              <span className="text-xs font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                                🔥 {lStreak}일 연속
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => {
                              setPrintReportTargetLearnerId(learner.id);
                              setIsPrintReportModalOpen(true);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs border border-purple-200 transition-colors cursor-pointer shadow-2xs"
                            title="이 학생의 성적표 & 출석부 인쇄"
                          >
                            <Printer className="w-3.5 h-3.5 text-purple-700" />
                            <span>성적표 출력</span>
                          </button>
                          <button
                            onClick={() => setSelectedLearnerForDetail(learner.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
                          >
                            <span>📊 상세 열람</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              setAdminResetTargetId(learner.id);
                              setShowAdminResetModal(true);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200 transition-colors cursor-pointer shadow-2xs"
                            title={`${learner.name} 학생의 학습 기록 초기화`}
                          >
                            <RotateCcw className="w-3 h-3 text-amber-600" />
                            <span>기록 리셋</span>
                          </button>
                          {onSelectProfile && (
                            <button
                              onClick={() => onSelectProfile(learner.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                            >
                              이 학생으로 전환
                            </button>
                          )}
                          <button
                            onClick={() => setDeletingProfileId(deletingProfileId === learner.id ? null : learner.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer shadow-2xs"
                            title="학습자 프로필 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>학생 삭제</span>
                          </button>
                        </div>
                      </div>

                      {/* Inline Delete Confirmation */}
                      {deletingProfileId === learner.id && (
                        <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 space-y-2.5 animate-in fade-in">
                          <div className="flex items-start gap-2 text-xs font-bold text-rose-900 leading-snug">
                            <span className="text-base shrink-0">⚠️</span>
                            <span>'{learner.name}' 학생의 모든 독해 기록, 단어장, 프로필을 영구 삭제하시겠습니까? (삭제 후 다시 생성되지 않습니다)</span>
                          </div>
                          <div className="flex items-center gap-2 justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => setDeletingProfileId(null)}
                              className="px-3.5 py-1.5 bg-white text-slate-700 rounded-xl border border-slate-300 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              취소
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLearner(learner.id)}
                              className="px-4 py-1.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 text-xs font-black shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>영구 삭제</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Daily Activity Breakdown Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                        <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                          <span className="text-[10px] text-slate-500 font-medium block">총 완료 지문</span>
                          <span className="text-base font-black text-slate-800">{lRecords.length}편</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                          <span className="text-[10px] text-slate-500 font-medium block">평균 정답률</span>
                          <span className="text-base font-black text-slate-800">{avgScore}%</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                          <span className="text-[10px] text-slate-500 font-medium block">외운 단어 수</span>
                          <span className="text-base font-black text-red-600">{lMemorized}개</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                          <span className="text-[10px] text-slate-500 font-medium block">최근 학습일</span>
                          <span className="text-xs font-bold text-slate-700 truncate block mt-0.5">
                            {latestRecord ? latestRecord.date : '기록 없음'}
                          </span>
                        </div>
                      </div>

                      {/* Mom's Cheer Stamp & Message Display / Sender */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50/70 via-purple-50/50 to-red-50/50 border border-pink-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                            <span>💌</span>
                            <span>열공마미의 응원 도장 & 칭찬 편지</span>
                          </div>
                          {learner.momEncouragement && (
                            <span className="text-[10px] font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full">
                              최근 전송: {learner.momEncouragement.date}
                            </span>
                          )}
                        </div>

                        {/* If Mom has already sent an encouragement message */}
                        {learner.momEncouragement ? (
                          <div className="p-3 bg-white rounded-xl border border-pink-200 flex items-start gap-3 shadow-xs">
                            <div className="text-2xl p-1 bg-pink-50 rounded-xl border border-pink-200 shrink-0">
                              {MOM_STAMP_CONFIG[learner.momEncouragement.stamp]?.icon || '💖'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[11px] font-bold text-pink-700">
                                  {MOM_STAMP_CONFIG[learner.momEncouragement.stamp]?.label || '사랑의 응원 도장'}
                                </span>
                                <span className="text-[10px] text-slate-400">· 엄마의 한마디</span>
                              </div>
                              <p className="text-xs font-bold text-slate-800 leading-relaxed">
                                "{learner.momEncouragement.message}"
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 font-medium">
                            아직 이번 주 칭찬 도장을 찍어주지 않았습니다. 아래에서 응원 메시지를 보내보세요!
                          </p>
                        )}

                        {/* Quick Stamp Sender Form */}
                        <div className="pt-2 border-t border-pink-200/60">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-[11px] font-bold text-slate-700">도장 선택:</span>
                            {(Object.keys(MOM_STAMP_CONFIG) as Array<MomEncouragement['stamp']>).map((stampKey) => {
                              const conf = MOM_STAMP_CONFIG[stampKey];
                              const isSelected = targetLearnerId === learner.id && encStamp === stampKey;
                              return (
                                <button
                                  key={stampKey}
                                  type="button"
                                  onClick={() => {
                                    setTargetLearnerId(learner.id);
                                    setEncStamp(stampKey);
                                  }}
                                  className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-pink-600 text-white border-pink-600 shadow-xs scale-105'
                                      : 'bg-white text-slate-700 border-slate-200 hover:border-pink-300'
                                  }`}
                                >
                                  <span>{conf.icon}</span>
                                  <span className="text-[10px]">{conf.label.split(' ')[0]}</span>
                                </button>
                              );
                            })}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={targetLearnerId === learner.id ? encMessage : ''}
                              onFocus={() => setTargetLearnerId(learner.id)}
                              onChange={(e) => {
                                setTargetLearnerId(learner.id);
                                setEncMessage(e.target.value);
                              }}
                              placeholder={`${learner.name} 학생에게 칭찬 한마디를 적어주세요 (예: 오늘 독해 완독 멋져! 💖)`}
                              className="flex-1 px-3 py-2 text-xs bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setTargetLearnerId(learner.id);
                                const finalMsg = (targetLearnerId === learner.id && encMessage.trim()) 
                                  ? encMessage.trim() 
                                  : `${learner.name}아, 오늘도 15분 독해 완료 최고야! 수능 1등급 가자! 💖`;
                                const updated = sendMomEncouragement(learner.id, finalMsg, encStamp, '열공마미');
                                if (updated) {
                                  setAllProfiles(getUserProfiles());
                                  setShowEncSuccessToast(`'${learner.name}' 학생에게 칭찬 도장 & 편지를 보냈습니다! 💌`);
                                  setTimeout(() => setShowEncSuccessToast(null), 3000);
                                  setEncMessage('');
                                }
                              }}
                              className="px-3.5 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>도장 쾅!</span>
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW B: INDIVIDUAL LEARNER ANALYTICS (FOR STUDENT OR MOM DRILLDOWN) */
        /* ========================================================================= */
        <div className="space-y-5">
          
          {/* Back button if Mom is inspecting a specific learner */}
          {isMomAdmin && selectedLearnerForDetail && (
            <button
              onClick={() => setSelectedLearnerForDetail(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 font-bold text-xs hover:bg-purple-100 transition-colors cursor-pointer"
            >
              <span>← 열공마미 전체 학생 목록으로 돌아가기</span>
            </button>
          )}

          {/* Mom's Encouragement Banner for Student */}
          {activeProfile?.momEncouragement && !isMomAdmin && (
            <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-600 text-white rounded-3xl p-5 sm:p-6 shadow-lg relative overflow-hidden animate-in fade-in duration-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white text-pink-600 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-md">
                  {MOM_STAMP_CONFIG[activeProfile.momEncouragement.stamp]?.icon || '💖'}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                      💌 {activeProfile.momEncouragement.momName || '열공마미'}의 사랑의 칭찬 도장
                    </span>
                    <span className="text-[10px] text-pink-100">
                      {activeProfile.momEncouragement.date}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                    "{activeProfile.momEncouragement.message}"
                  </h3>
                  <p className="text-xs text-pink-100 font-medium">
                    엄마의 응원을 받아 오늘도 수능 영어 1등급을 향해 힘차게 출발해봐요! 🕷️✨
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 1. Header Hero Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="p-2 bg-slate-50 rounded-2xl border border-slate-200 shrink-0">
                  <HappyMascot
                    expression="proud"
                    suitTheme={activeProfile?.avatarTheme || 'spider-red'}
                    size="md"
                    showSpeech={false}
                    interactive={false}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      {activeProfile?.name ? `${activeProfile.name} 님의 수능 독해 리포트` : '학습 통계 & 독해 기록'}
                    </h2>
                    {activeProfile && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-bold border border-red-200">
                        {activeProfile.grade} · {activeProfile.targetLevel}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    매일 15분 루틴으로 단단히 쌓아가는 1등급 독해 데이터
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPrintReportTargetLearnerId(activeProfile?.id || null);
                    setIsPrintReportModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 hover:border-purple-300 shadow-2xs transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-purple-700" />
                  <span>A4 성적표 인쇄</span>
                </button>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 font-black text-xs">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span>{streakCount}일 연속 학습 중 🔥</span>
                </div>
              </div>
            </div>

            {/* 4 Summary Stat Tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-medium text-slate-500 block">
                  📖 완료한 지문
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-slate-900">{totalCompleted}</span>
                  <span className="text-xs text-slate-500">편</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-medium text-slate-500 block">
                  ⏱️ 누적 학습 시간
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-red-600">{totalMinutes}</span>
                  <span className="text-xs text-slate-500">분</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-medium text-slate-500 block">
                  🎯 문항 정답률
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-slate-900">
                    {totalCompleted > 0 ? `${averageScore}%` : '-'}
                  </span>
                  {totalCompleted > 0 && (
                    <span className="text-xs text-slate-500 font-bold">
                      ({averageScore >= 80 ? '1등급권' : '2등급권'})
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-medium text-slate-500 block">
                  📚 암기 완료 영단어
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-red-600">{memorizedWordCount}</span>
                  <span className="text-xs text-slate-500">개</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Streak Calendar Heatmap (28-day grid) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>🗓️</span>
                <h3 className="text-sm font-bold text-slate-900">4주간의 출석 현황</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md">최근 28일</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                <div key={i} className="text-center text-xs font-bold text-slate-400 pb-0.5">
                  {day}
                </div>
              ))}
              {past30Days.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all ${
                    item.studied
                      ? 'bg-red-600 text-white border-red-700 font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <span className="text-xs block font-medium">{item.dayNum}</span>
                  {item.studied && (
                    <span className="text-[10px] block font-bold text-red-100">완료</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Chart A: Score Trend */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">📈</span>
                  <h3 className="text-sm font-bold text-slate-900">최근 지문별 점수</h3>
                </div>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">최근 7회차</span>
              </div>

              {recentRecords.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <p className="font-medium">아직 풀이한 문제 기록이 없습니다.</p>
                  <p className="text-[11px] mt-0.5">지문 문제를 풀고 점수를 등록해보세요!</p>
                </div>
              ) : (
                <div className="h-40 flex items-end justify-between gap-2 pt-4 px-2">
                  {recentRecords.map((r, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[11px] font-bold text-slate-700">{r.score}점</span>
                      <div
                        className="w-full bg-red-600 rounded-t-md transition-all"
                        style={{ height: `${Math.max(r.score, 15)}%` }}
                      />
                      <span className="text-[10px] text-slate-400 font-mono truncate max-w-[45px]">
                        {r.date.slice(5)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chart B: Category Distribution */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">📚</span>
                  <h3 className="text-sm font-bold text-slate-900">영역별 지문 독해 밸런스</h3>
                </div>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">영역별 통계</span>
              </div>

              <div className="space-y-2.5 pt-1">
                {Object.keys(categoryCounts).map((cat) => {
                  const count = categoryCounts[cat];
                  const maxCount = Math.max(...Object.values(categoryCounts), 1);
                  const percentage = Math.round((count / maxCount) * 100);

                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700">{categoryLabels[cat] || cat}</span>
                        <span className="text-red-600 font-bold">{count}회</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-red-600 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 4. AI Coach Advice with Spider-Man Happy Mascot */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xs border border-slate-800 flex flex-col sm:flex-row items-center gap-5">
            <HappyMascot
              expression={totalCompleted >= 3 ? 'proud' : 'studying'}
              suitTheme={activeProfile?.avatarTheme || 'spider-red'}
              size="lg"
              speechText={totalCompleted >= 3 ? '1등급이 눈앞에 보여 해피! 🕸️✨' : '거미줄처럼 단단한 구문 독해 완성! 🕸️'}
              interactive={false}
              className="shrink-0"
            />
            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-red-400 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>스파이더맨 해피 코치의 독해 학습 가이드</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                {totalCompleted >= 3
                  ? `${activeProfile?.name || '학습자'} 님, 훌륭한 페이스로 매일 독해를 이어가고 있어요! 고난도 빈칸 추론에 더 자신감을 가져보세요.`
                  : `매일 하루 한 장씩 꾸준히 읽는 습관이 수능 영어 1등급의 가장 확실한 길입니다.`}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                인공지능, 뇌과학, 행동경제학과 같은 다학제적 융합 교양 지문은 수능 영어 31~34번 빈출 소재입니다. 지문 독해 후 인쇄 템플릿으로 출력해 오프라인 실전 시험지 형태로도 복습해보세요.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Admin / Student Printable Report Modal */}
      <PrintAdminReportModal
        isOpen={isPrintReportModalOpen}
        onClose={() => setIsPrintReportModalOpen(false)}
        allProfiles={allProfiles}
        initialLearnerId={printReportTargetLearnerId}
        activeProfile={activeProfile}
        onEncouragementUpdated={() => setAllProfiles(getUserProfiles())}
      />

    </div>
  );
};
