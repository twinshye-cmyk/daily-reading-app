import React, { useState } from 'react';
import { UserProfile, GradeType, SpiderSuitTheme } from '../types';
import { 
  X, 
  UserPlus, 
  Check, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Palette,
  Crown,
  User,
  Lock,
  KeyRound,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { HappyMascot, SPIDER_SUITS } from './HappyMascot';
import { AdminPinModal } from './AdminPinModal';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserProfile[];
  activeProfileId: string;
  activeProfile?: UserProfile | null;
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: (name: string, grade: GradeType, targetLevel: string, avatarTheme: SpiderSuitTheme) => void;
  onDeleteProfile: (profileId: string) => void;
  onUpdateSuit?: (profileId: string, suit: SpiderSuitTheme) => void;
}

const GRADES: GradeType[] = [
  '초등 고학년',
  '중1',
  '중2',
  '중3',
  '고1',
  '고2',
  '고3/수능',
  'N수/심화',
];

const TARGETS = [
  '수능 1등급 (90점 이상)',
  '수능 2등급 (80점 이상)',
  '수능 3등급 (70점 이상)',
  '내신 1등급 달성',
  '기초 독해력 다지기',
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  activeProfile,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
  onUpdateSuit,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingSuitProfileId, setEditingSuitProfileId] = useState<string | null>(null);
  const [deletingProfileId, setDeletingProfileId] = useState<string | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [pendingTargetProfileId, setPendingTargetProfileId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<GradeType>('고3/수능');
  const [targetLevel, setTargetLevel] = useState(TARGETS[0]);
  const [avatarTheme, setAvatarTheme] = useState<SpiderSuitTheme>('spider-red');
  const [error, setError] = useState<string | null>(null);

  const isMomAdmin = activeProfile?.name === '열공마미' || activeProfile?.isMomOrAdmin === true;
  const momProfile = profiles.find((p) => p.name === '열공마미' || p.isMomOrAdmin) || profiles[0];
  const learners = profiles.filter((p) => p.name !== '열공마미' && !p.isMomOrAdmin);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('학습자 이름을 입력해주세요.');
      return;
    }
    onCreateProfile(name.trim(), grade, targetLevel, avatarTheme);
    setName('');
    setIsCreating(false);
    setError(null);
  };

  const handleSuitChange = (profileId: string, newSuit: SpiderSuitTheme) => {
    if (onUpdateSuit) {
      onUpdateSuit(profileId, newSuit);
    }
    setEditingSuitProfileId(null);
  };

  const handleConfirmDelete = (profileId: string) => {
    if (!isMomAdmin) return;
    onDeleteProfile(profileId);
    setDeletingProfileId(null);
  };

  const requestAdminModeSwitch = () => {
    setPendingTargetProfileId(momProfile.id);
    setShowPinModal(true);
  };

  const requestStudentSwitch = (targetId: string) => {
    if (isMomAdmin) {
      // Admin can freely switch to any student
      onSelectProfile(targetId);
    } else {
      // Non-admin student must authenticate to switch to another student
      setPendingTargetProfileId(targetId);
      setShowPinModal(true);
    }
  };

  const handlePinSuccess = () => {
    if (pendingTargetProfileId) {
      onSelectProfile(pendingTargetProfileId);
      setPendingTargetProfileId(null);
    }
    setShowPinModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4 pt-8 sm:pt-4">
        <div className="bg-white rounded-3xl max-w-lg w-full my-auto shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in duration-150">
          
          {/* Header */}
          <div className={`px-5 py-4 border-b flex items-center justify-between ${
            isMomAdmin ? 'bg-purple-900 text-white border-purple-800' : 'bg-slate-50 text-slate-900 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm ${
                isMomAdmin ? 'bg-purple-700 text-amber-300' : 'bg-red-600 text-white'
              }`}>
                {isMomAdmin ? '👑' : '🕷️'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-black">
                    {isMomAdmin ? '열공마미 총괄 관리자 모드' : '내 학습자 프로필 & 수트 설정'}
                  </h2>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isMomAdmin ? 'bg-purple-700 text-purple-200' : 'bg-red-100 text-red-700'
                  }`}>
                    {isMomAdmin ? '관리자 권한 활성화' : '학습자 모드'}
                  </span>
                </div>
                <p className={`text-[11px] font-medium mt-0.5 ${isMomAdmin ? 'text-purple-200' : 'text-slate-500'}`}>
                  {isMomAdmin 
                    ? '모든 수험생의 학습 기록 조회, 프로필 등록/삭제, 성적표 인쇄 및 도장 관리' 
                    : `${activeProfile?.name || '학습자'} 님의 단독 학습 세션입니다. (타인 기록 조회/삭제 불가)`}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                isMomAdmin ? 'text-purple-300 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            
            {/* ========================================================================= */}
            {/* 👤 VIEW 1: LEARNER MODE (학습자 모드) - STRICTLY RESTRICTED & CLEAN */}
            {/* ========================================================================= */}
            {!isMomAdmin && !isCreating && (
              <div className="space-y-4">
                
                {/* Current Active Learner Card */}
                {activeProfile && (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white rounded-xl border border-slate-200 shrink-0 shadow-xs">
                          <HappyMascot
                            expression="proud"
                            suitTheme={activeProfile.avatarTheme || 'spider-red'}
                            size="md"
                            showSpeech={false}
                            interactive={false}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-black text-slate-900">{activeProfile.name}</h3>
                            <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-lg">
                              {activeProfile.grade || '수험생'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            목표: <span className="font-bold text-slate-800">{activeProfile.targetLevel}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setEditingSuitProfileId(editingSuitProfileId === activeProfile.id ? null : activeProfile.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                      >
                        <Palette className="w-3.5 h-3.5 text-red-600" />
                        <span>수트 컬러 변경</span>
                      </button>
                    </div>

                    {/* Inline Suit Palette Drawer for Current Learner */}
                    {editingSuitProfileId === activeProfile.id && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 animate-in fade-in">
                        <span className="text-[11px] font-black text-slate-800 block">스파이더 수트 컬러 선택</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          {SPIDER_SUITS.map((suit) => {
                            const isCurrent = activeProfile.avatarTheme === suit.id;
                            return (
                              <button
                                key={suit.id}
                                onClick={() => handleSuitChange(activeProfile.id, suit.id)}
                                className={`flex items-center gap-1.5 p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                                  isCurrent
                                    ? 'bg-red-50 border-red-500 ring-1 ring-red-400 font-black shadow-xs'
                                    : 'bg-white hover:bg-slate-50 border-slate-200 font-medium'
                                }`}
                              >
                                <span className="text-sm">{suit.icon}</span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[11px] truncate text-slate-800 leading-tight">{suit.name}</p>
                                  <p className="text-[9px] text-slate-400 truncate">{suit.badge}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Other Learners switcher if multiple exist */}
                {learners.length > 1 && (
                  <div className="space-y-2">
                    <span className="text-xs font-black text-slate-700">다른 학습자로 변경</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {learners
                        .filter((l) => l.id !== activeProfile?.id)
                        .map((learner) => (
                          <button
                            key={learner.id}
                            onClick={() => requestStudentSwitch(learner.id)}
                            className="flex items-center justify-between p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left transition-all cursor-pointer shadow-2xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm">👤</span>
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">{learner.name}</span>
                                <span className="text-[10px] text-slate-400">{learner.grade || '수험생'}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* Actions for Learner: Switch to Admin Mode OR Register New Learner */}
                <div className="pt-3 border-t border-slate-200 space-y-2.5">
                  {/* Clear and direct Switch to Admin Mode button */}
                  <button
                    onClick={requestAdminModeSwitch}
                    className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-900 hover:to-indigo-950 text-white rounded-2xl shadow-sm transition-all cursor-pointer group"
                    title="관리자(열공마미) 모드로 전환"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-700/80 border border-purple-400/40 flex items-center justify-center text-amber-300 font-bold shrink-0">
                        <Crown className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-black block text-amber-200">👑 관리자(열공마미) 모드로 전환</span>
                        <span className="text-[10px] text-purple-200">PIN 번호 인증 후 전체 수험생 관리 & 성적표 발급</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-300 text-xs font-bold bg-purple-950/50 px-2 py-1 rounded-lg border border-purple-400/30">
                      <Lock className="w-3.5 h-3.5" />
                      <span>인증</span>
                    </div>
                  </button>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-500 font-medium">새로운 학생이 있나요?</span>
                    <button
                      onClick={() => {
                        setIsCreating(true);
                        setError(null);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer border border-slate-200"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>+ 새 학습자 등록</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* 👑 VIEW 2: ADMIN MANAGEMENT CENTER (관리자 모드) - FULL CONTROLS */}
            {/* ========================================================================= */}
            {isMomAdmin && !isCreating && (
              <div className="space-y-4">
                
                {/* Admin Quick Action Banner */}
                <div className="flex items-center justify-between bg-purple-50 p-3.5 rounded-2xl border border-purple-200 text-xs">
                  <div>
                    <span className="font-black text-purple-950 block">관리자 전용 제어 센터</span>
                    <span className="text-[11px] text-purple-800">등록된 모든 학습자 ({learners.length}명) 관리 및 수정</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowChangePinModal(true)}
                      className="px-2.5 py-1 text-[11px] font-bold bg-white text-purple-900 border border-purple-300 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer shadow-2xs"
                      title="관리자 PIN 번호 변경"
                    >
                      PIN 변경
                    </button>
                    <button
                      onClick={() => {
                        setIsCreating(true);
                        setError(null);
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-[11px] font-bold shadow-xs cursor-pointer"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>학습자 추가</span>
                    </button>
                  </div>
                </div>

                {/* Learner List for Admin */}
                <div className="space-y-2.5">
                  <span className="text-xs font-black text-slate-800">등록된 수험생/학습자 목록</span>
                  
                  {learners.length === 0 ? (
                    <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-xs font-bold text-slate-600">등록된 학습자가 없습니다.</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">상단의 [+ 학습자 추가] 버튼을 눌러 자녀를 등록해주세요.</p>
                    </div>
                  ) : (
                    learners.map((learner) => {
                      const isEditingSuit = editingSuitProfileId === learner.id;
                      const isConfirmingDelete = deletingProfileId === learner.id;

                      return (
                        <div
                          key={learner.id}
                          className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-all shadow-xs"
                        >
                          <div className="p-3 sm:p-3.5 space-y-3">
                            <div className="flex items-start sm:items-center justify-between gap-2.5">
                              {/* Learner Info */}
                              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                                <div className="p-1 bg-slate-50 rounded-xl border border-slate-200 shrink-0">
                                  <HappyMascot
                                    expression="happy"
                                    suitTheme={learner.avatarTheme || 'spider-red'}
                                    size="sm"
                                    showSpeech={false}
                                    interactive={false}
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-sm font-black text-slate-900 truncate max-w-[110px] sm:max-w-none">{learner.name}</span>
                                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-700 font-bold rounded shrink-0">
                                      {learner.grade || '수험생'}
                                    </span>
                                    <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 shrink-0">
                                      {learner.targetLevel}
                                    </span>
                                  </div>
                                  {learner.momEncouragement && (
                                    <p className="text-[10px] text-pink-700 font-bold mt-0.5 truncate max-w-[180px] sm:max-w-xs">
                                      💌 "{learner.momEncouragement.message}"
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Desktop-Only Action Buttons */}
                              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => setEditingSuitProfileId(isEditingSuit ? null : learner.id)}
                                  className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                  title="스파이더 수트 변경"
                                >
                                  <Palette className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => onSelectProfile(learner.id)}
                                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                                  title="이 학생으로 독해 학습 시작"
                                >
                                  <span>학습 시작</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>

                                {/* Delete button: Only Admin */}
                                <button
                                  onClick={() => setDeletingProfileId(isConfirmingDelete ? null : learner.id)}
                                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="학습자 프로필 삭제"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Mobile Dedicated Action Buttons Bar (Always 100% visible, never clipped) */}
                            <div className="sm:hidden flex items-center gap-1.5 pt-2 border-t border-slate-100">
                              <button
                                onClick={() => setEditingSuitProfileId(isEditingSuit ? null : learner.id)}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                              >
                                <Palette className="w-3.5 h-3.5 text-slate-600" />
                                <span>수트</span>
                              </button>

                              <button
                                onClick={() => onSelectProfile(learner.id)}
                                className="flex-1.5 flex items-center justify-center gap-1 py-1.5 px-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer"
                              >
                                <span>학습 시작</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>

                              <button
                                onClick={() => setDeletingProfileId(isConfirmingDelete ? null : learner.id)}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-black transition-colors cursor-pointer"
                                title="학습자 프로필 삭제"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                <span>삭제</span>
                              </button>
                            </div>
                          </div>

                          {/* Inline Delete Confirmation */}
                          {isConfirmingDelete && (
                            <div className="p-3.5 bg-rose-50 border-t border-rose-200 space-y-2.5 animate-in fade-in">
                              <div className="flex items-start gap-2 text-xs font-bold text-rose-900 leading-snug">
                                <span className="text-base shrink-0">⚠️</span>
                                <span>'{learner.name}' 학생의 모든 독해 기록과 프로필을 영구 삭제하시겠습니까?</span>
                              </div>
                              <div className="flex items-center gap-2 justify-end pt-1">
                                <button
                                  type="button"
                                  onClick={() => setDeletingProfileId(null)}
                                  className="flex-1 sm:flex-none px-3.5 py-1.5 bg-white text-slate-700 rounded-xl border border-slate-300 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                  취소
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleConfirmDelete(learner.id)}
                                  className="flex-1 sm:flex-none px-4 py-1.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 text-xs font-black shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>영구 삭제</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Inline Suit Palette */}
                          {isEditingSuit && (
                            <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2 animate-in fade-in">
                              <span className="text-[11px] font-black text-slate-800 block">{learner.name} 학생의 수트 선택</span>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                {SPIDER_SUITS.map((suit) => {
                                  const isCurrent = learner.avatarTheme === suit.id;
                                  return (
                                    <button
                                      key={suit.id}
                                      onClick={() => handleSuitChange(learner.id, suit.id)}
                                      className={`flex items-center gap-1.5 p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                                        isCurrent
                                          ? 'bg-white border-red-500 ring-2 ring-red-400 font-black shadow-xs'
                                          : 'bg-white hover:bg-slate-100 border-slate-200 font-medium'
                                      }`}
                                    >
                                      <span className="text-sm">{suit.icon}</span>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-[11px] truncate text-slate-800 leading-tight">{suit.name}</p>
                                        <p className="text-[9px] text-slate-400 truncate">{suit.badge}</p>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Exit Admin Mode */}
                <div className="pt-2 border-t border-slate-200">
                  {learners[0] && (
                    <button
                      onClick={() => onSelectProfile(learners[0].id)}
                      className="w-full flex items-center justify-center gap-2 p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>관리자 모드 종료 (학습자 모드로 복귀)</span>
                    </button>
                  )}
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* FORM: CREATE NEW LEARNER */}
            {/* ========================================================================= */}
            {isCreating && (
              <form onSubmit={handleCreate} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <span>✨</span> 새 학습자(자녀/수험생) 등록
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                  >
                    취소
                  </button>
                </div>

                {error && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                    {error}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">학생 이름 / 닉네임</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예: 김규린, 민준, 서연"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">학년</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value as GradeType)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                    >
                      {GRADES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">목표 등급</label>
                    <select
                      value={targetLevel}
                      onChange={(e) => setTargetLevel(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                    >
                      {TARGETS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">스파이더 수트 아바타 선택</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {SPIDER_SUITS.map((suit) => {
                      const isSelected = avatarTheme === suit.id;
                      return (
                        <button
                          key={suit.id}
                          type="button"
                          onClick={() => setAvatarTheme(suit.id)}
                          className={`p-2 rounded-xl border text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-red-50 border-red-500 ring-2 ring-red-400 font-black shadow-xs'
                              : 'bg-white hover:bg-slate-100 border-slate-200 font-medium'
                          }`}
                        >
                          <span className="text-sm">{suit.icon}</span>
                          <span className="text-xs text-slate-800 truncate">{suit.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer"
                  >
                    가입 및 등록 완료
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>

      {/* Admin PIN Verification Modal */}
      <AdminPinModal
        isOpen={showPinModal}
        onClose={() => {
          setShowPinModal(false);
          setPendingTargetProfileId(null);
        }}
        onSuccess={handlePinSuccess}
        mode="verify"
        targetActionName="관리자 보안 인증"
      />

      {/* Admin PIN Change Modal */}
      <AdminPinModal
        isOpen={showChangePinModal}
        onClose={() => setShowChangePinModal(false)}
        onSuccess={() => setShowChangePinModal(false)}
        mode="change"
      />
    </>
  );
};
