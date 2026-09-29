import React, { useState, useEffect } from 'react';
import { UserProfile, StudyRecord, MomEncouragement } from '../types';
import { 
  Printer, 
  X, 
  Download, 
  Copy, 
  Check, 
  Crown, 
  Flame, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Sparkles,
  User,
  MessageSquare,
  BookmarkCheck,
  Send,
  ShieldCheck
} from 'lucide-react';
import { getStudyRecords, getSavedWords, calculateStreak, sendMomEncouragement, getUserProfiles } from '../utils/storage';

interface PrintAdminReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  allProfiles?: UserProfile[];
  initialLearnerId?: string | null;
  activeProfile?: UserProfile | null;
  onEncouragementUpdated?: () => void;
}

const MOM_STAMP_MAP: Record<string, { label: string; icon: string }> = {
  heart: { label: '사랑의 응원', icon: '💖' },
  king: { label: '수능 1등급 보증', icon: '👑' },
  fire: { label: '열공 불꽃', icon: '🔥' },
  star: { label: '슈퍼스타 성실', icon: '⭐' },
  trophy: { label: '수능 대박 트로피', icon: '🏆' },
  spider: { label: '스파이더 영웅', icon: '🕸️' },
};

const CATEGORY_NAMES: Record<string, string> = {
  science: '과학·생명',
  tech: 'AI·기술',
  economy: '경제·경영',
  psychology: '심리·행동',
  art: '예술·건축',
  humanities: '인문·철학',
};

const COMMENT_PRESETS = [
  '매일 15분 독해 루틴이 완벽히 정착되었으며, 문장 구조 분석력이 매우 뛰어납니다. 수능 1등급 달성이 기대됩니다.',
  '고난도 빈칸 추론과 순서 배열 문항에 대한 집중 훈련을 통해 문제 풀이 정확도가 크게 향상되었습니다.',
  '어휘 암기율이 우수하며 핵심 주제 파악 속도가 빠릅니다. 지금의 꾸준한 학습 리듬을 끝까지 유지합시다!',
  '최근 연속 출석(Streak)을 성실히 이어가며 높은 학습 집중력을 보여주고 있습니다. 아주 훌륭합니다!'
];

export const PrintAdminReportModal: React.FC<PrintAdminReportModalProps> = ({
  isOpen,
  onClose,
  allProfiles: propProfiles,
  initialLearnerId = null,
  activeProfile = null,
  onEncouragementUpdated,
}) => {
  const allProfiles = propProfiles && Array.isArray(propProfiles) && propProfiles.length > 0 
    ? propProfiles 
    : getUserProfiles();
  const isMomAdmin = activeProfile?.name === '열공마미' || activeProfile?.isMomOrAdmin === true;
  const learners = (allProfiles || []).filter((p) => p && p.name !== '열공마미' && !p.isMomOrAdmin);
  
  // If not admin, the target learner is strictly the activeProfile
  const defaultSelectedId = isMomAdmin
    ? (initialLearnerId && initialLearnerId !== 'all' && learners.some(l => l.id === initialLearnerId)
        ? initialLearnerId
        : (learners[0]?.id || 'all_individual'))
    : (activeProfile?.id || learners[0]?.id || '');

  const [selectedLearnerId, setSelectedLearnerId] = useState<string>(defaultSelectedId);
  const [reportTitle, setReportTitle] = useState('수능 영어 1등급 주간 정밀 성적표');
  const [adminName, setAdminName] = useState('열공마미 (총괄 관리자)');
  const [copied, setCopied] = useState(false);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  // Per-student custom comments and stamps
  const [commentsMap, setCommentsMap] = useState<Record<string, string>>({});
  const [stampsMap, setStampsMap] = useState<Record<string, MomEncouragement['stamp']>>({});

  useEffect(() => {
    if (learners.length > 0) {
      const newComments: Record<string, string> = {};
      const newStamps: Record<string, MomEncouragement['stamp']> = {};
      
      learners.forEach((l) => {
        if (l.momEncouragement?.message) {
          newComments[l.id] = l.momEncouragement.message;
          newStamps[l.id] = l.momEncouragement.stamp || 'king';
        } else {
          newComments[l.id] = `${l.name} 학생은 매일 15분 독해 루틴을 성실히 실천하고 있으며, 문장 구조 분석과 어휘 학습에서 꾸준한 성장을 보이고 있습니다.`;
          newStamps[l.id] = 'king';
        }
      });
      setCommentsMap((prev) => ({ ...newComments, ...prev }));
      setStampsMap((prev) => ({ ...newStamps, ...prev }));
    }
  }, [allProfiles]);

  useEffect(() => {
    if (initialLearnerId && initialLearnerId !== 'all' && learners.some(l => l.id === initialLearnerId)) {
      setSelectedLearnerId(initialLearnerId);
    } else if (learners.length > 0 && selectedLearnerId === 'all') {
      setSelectedLearnerId(learners[0].id);
    }
  }, [initialLearnerId, isOpen]);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to compute individual student statistics
  const getStudentData = (learner: UserProfile) => {
    const records = getStudyRecords(learner.id);
    const words = getSavedWords(learner.id);
    const streak = calculateStreak(learner.id);
    const memorizedCount = words.filter((w) => w.status === 'memorized').length;
    const isTodayCompleted = records.some((r) => r.date === todayStr);
    const avgScore = records.length > 0 
      ? Math.round(records.reduce((acc, r) => acc + (r.score || 0), 0) / records.length) 
      : 0;

    const catCounts: Record<string, number> = {
      science: 0, tech: 0, economy: 0, psychology: 0, art: 0, humanities: 0
    };
    records.forEach((r) => {
      if (catCounts[r.category] !== undefined) catCounts[r.category]++;
      else catCounts.science++;
    });

    const recentRecords = [...records].reverse().slice(0, 4);

    return {
      learner,
      records,
      words,
      streak,
      memorizedCount,
      isTodayCompleted,
      avgScore,
      catCounts,
      recentRecords,
    };
  };

  // Determine which students to render
  const targetLearners = !isMomAdmin
    ? (activeProfile ? [activeProfile] : (learners[0] ? [learners[0]] : []))
    : (selectedLearnerId === 'all_individual'
        ? learners
        : learners.filter((l) => l.id === selectedLearnerId));

  const activeLearner = !isMomAdmin
    ? (activeProfile || learners[0])
    : (learners.find((l) => l.id === selectedLearnerId) || learners[0]);

  // 28 Days attendance matrix
  const today = new Date();
  const past28Days = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date(today.getTime() - (27 - i) * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    return {
      date: dateStr,
      dayNum: d.getDate(),
      month: d.getMonth() + 1,
    };
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSaveEncouragementToApp = (learnerId: string) => {
    const comment = commentsMap[learnerId] || '';
    const stamp = stampsMap[learnerId] || 'king';
    sendMomEncouragement(learnerId, comment, stamp, adminName.replace(/\s*\(.*?\)\s*/g, '').trim() || '열공마미');
    
    // Trigger real-time sync
    window.dispatchEvent(new Event('app_storage_synced'));
    if (onEncouragementUpdated) onEncouragementUpdated();

    setSavedToast('💌 관리자 코멘트와 칭찬 도장이 학생 화면에 저장되었습니다!');
    setTimeout(() => setSavedToast(null), 3000);
  };

  const generateReportPlainText = () => {
    const div = '===============================================================\n';
    const subDiv = '---------------------------------------------------------------\n';
    let text = `[${reportTitle}]\n`;
    text += `발행일: ${todayStr} | 총괄 관리자: ${adminName}\n`;
    text += div;

    targetLearners.forEach((l, idx) => {
      const data = getStudentData(l);
      const comment = commentsMap[l.id] || '';
      const stamp = stampsMap[l.id] || 'king';

      text += `■ [학생 개인 성적표] ${l.name} (${l.grade || '수험생'} | ${l.targetLevel})\n`;
      text += `  1. 오늘 완독 달성: ${data.isTodayCompleted ? '완료 (O)' : '미완료 (X)'}\n`;
      text += `  2. 연속 출석(Streak): ${data.streak}일 연속\n`;
      text += `  3. 총 완료 지문: ${data.records.length}편\n`;
      text += `  4. 문제 풀이 평균 점수: ${data.avgScore}점 / 100점\n`;
      text += `  5. 마스터 암기 영단어: ${data.memorizedCount}개\n`;
      text += `  6. 영역별 독해 편수: 과학·기술(${data.catCounts.science + data.catCounts.tech}편), 인문·예술(${data.catCounts.humanities + data.catCounts.art}편), 사회·경제(${data.catCounts.economy + data.catCounts.psychology}편)\n`;
      text += `  7. 👑 열공마미 관리자 종합 코멘트: "${comment}"\n`;
      text += `  8. 💌 칭찬 도장: [${MOM_STAMP_MAP[stamp]?.label || '1등급 보증'}] ${MOM_STAMP_MAP[stamp]?.icon || '👑'}\n`;
      if (idx < targetLearners.length - 1) text += `\n${subDiv}\n`;
    });

    text += div;
    text += `■ 스파이더맨 해피 코치 조언: 매일 15분 독해 루틴으로 촘촘한 구문 독해 완성!\n`;
    text += `■ 공식 확인 서명: 관리자 [${adminName}] (인) | 학생/보호자: ____________ (인)\n`;
    return text;
  };

  const handleCopyText = () => {
    const text = generateReportPlainText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = () => {
    const text = generateReportPlainText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const targetName = selectedLearnerId === 'all_individual' ? '전체개별' : (activeLearner?.name || '학생');
    a.download = `열공마미_${targetName}_개별성적표_${todayStr}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="print-modal-container fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-2 sm:p-4 pt-4 sm:pt-4 print:p-0 print:static print:bg-white">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] my-auto shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in duration-150 print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 bg-slate-50 print:hidden">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${isMomAdmin ? 'bg-purple-700 text-white' : 'bg-red-600 text-white'} rounded-2xl flex items-center justify-center text-xl shadow-xs shrink-0`}>
              {isMomAdmin ? <Crown className="w-5 h-5 text-amber-300" /> : '🕷️'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-slate-900">
                  {isMomAdmin ? '학생별 개별 성적표 출력 & 코멘트 작성' : `${activeProfile?.name || '학습자'} 님의 독해 성적표 출력`}
                </h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  isMomAdmin ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-red-100 text-red-700 border-red-200'
                }`}>
                  A4 1인 1매 정밀 성적표
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {isMomAdmin 
                  ? '각 학생의 성취도와 영역별 밸런스를 확인하고, 관리자 맞춤 코멘트와 칭찬 도장을 작성해 출력합니다.'
                  : '매일 15분 독해 루틴의 성취도와 영역별 밸런스를 담은 공식 성적표입니다.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
              title="카카오톡 및 문자 전송용 텍스트 복사"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>카톡/텍스트 복사</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadText}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>파일 저장</span>
            </button>

            <button
              onClick={handlePrint}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-black text-white rounded-xl shadow-xs transition-all cursor-pointer ${
                isMomAdmin ? 'bg-purple-700 hover:bg-purple-800' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>개별 성적표 인쇄 / PDF 저장</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Student Switcher & Admin Comment Editor Toolbar (Admin Only, Hidden on print) */}
        {isMomAdmin ? (
          <div className="p-4 border-b border-slate-200 bg-purple-50/40 print:hidden space-y-3">
            
            {/* Row 1: Student Selector Tabs & Report Settings */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-black text-purple-900 mr-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>출력 학생 선택:</span>
                </span>

                {learners.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setSelectedLearnerId(l.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedLearnerId === l.id
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-100/60'
                    }`}
                  >
                    <span>{l.name}</span>
                    <span className="text-[10px] opacity-80">({l.grade || '수험생'})</span>
                  </button>
                ))}

                {learners.length > 1 && (
                  <button
                    onClick={() => setSelectedLearnerId('all_individual')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedLearnerId === 'all_individual'
                        ? 'bg-indigo-900 text-white shadow-xs'
                        : 'bg-white text-indigo-900 border border-indigo-200 hover:bg-indigo-50'
                    }`}
                    title="모든 학생의 개별 성적표를 각각 1장씩 순서대로 일괄 인쇄합니다."
                  >
                    <span>📋 모든 학생 각각 1장씩 일괄 인쇄 ({learners.length}명)</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="관리자 명의"
                  className="p-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 w-44"
                  title="성적표에 인쇄될 총괄 관리자 직함 및 성명"
                />
              </div>
            </div>

            {/* Row 2: Active Student Comment & Stamp Editor (if single student selected or first student in batch) */}
            {activeLearner && (
              <div className="bg-white rounded-2xl p-3.5 border border-purple-200/80 shadow-2xs space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black">
                      ✏️
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      <span className="text-purple-900 font-black">'{activeLearner.name}'</span> 학생 맞춤 지도 코멘트 & 칭찬 도장
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Stamp Selector */}
                    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                      {Object.entries(MOM_STAMP_MAP).map(([key, stampInfo]) => (
                        <button
                          key={key}
                          onClick={() => setStampsMap((prev) => ({ ...prev, [activeLearner.id]: key as any }))}
                          className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            (stampsMap[activeLearner.id] || 'king') === key
                              ? 'bg-purple-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                          title={stampInfo.label}
                        >
                          <span>{stampInfo.icon}</span>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handleSaveEncouragementToApp(activeLearner.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                      title="이 코멘트와 도장을 학생의 홈 화면 칭찬 편지로도 실시간 전송합니다."
                    >
                      <Send className="w-3 h-3" />
                      <span>홈 화면 칭찬 편지로도 저장</span>
                    </button>
                  </div>
                </div>

                {/* Comment Textarea */}
                <div className="space-y-1.5">
                  <textarea
                    rows={2}
                    value={commentsMap[activeLearner.id] || ''}
                    onChange={(e) => setCommentsMap((prev) => ({ ...prev, [activeLearner.id]: e.target.value }))}
                    placeholder="학생의 학습 태도, 독해 영역별 장점 및 보완점, 응원의 메시지를 작성해주세요..."
                    className="w-full p-2.5 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                  />

                  {/* Preset Comment Quick Buttons */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px]">
                    <span className="text-[10px] font-bold text-slate-400 shrink-0">빠른 코멘트 추천:</span>
                    {COMMENT_PRESETS.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => setCommentsMap((prev) => ({ ...prev, [activeLearner.id]: preset }))}
                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-900 border border-slate-200 text-[10px] font-medium whitespace-nowrap cursor-pointer transition-colors"
                      >
                        {pIdx === 0 && '🌟 완벽한 독해 루틴'}
                        {pIdx === 1 && '🎯 빈칸/순서 고난도 정복'}
                        {pIdx === 2 && '💡 어휘 암기 & 주제 파악'}
                        {pIdx === 3 && '🔥 연속 출석 & 성실성'}
                      </button>
                    ))}
                  </div>
                </div>

                {savedToast && (
                  <div className="text-[11px] font-bold text-pink-700 bg-pink-50 p-2 rounded-xl border border-pink-200 animate-in fade-in">
                    {savedToast}
                  </div>
                )}
              </div>
            )}

          </div>
        ) : (
          /* Student View: Simple Security & Info Banner */
          <div className="p-3.5 border-b border-slate-200 bg-slate-50 print:hidden flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-slate-800">
                {activeProfile?.name} 님의 전용 학습 성적표입니다. (개인 정보 및 학습 이력 보호)
              </span>
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:inline">표준 A4 규격 인쇄 및 PDF 저장 가능</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PRINTABLE DOCUMENT BODY (Clean A4 Paper Canvas) */}
        {/* Each student renders as a complete, standalone 1-Page Report Card */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/60 print:bg-white print:p-0 print:overflow-visible space-y-8 print:space-y-0">
          
          {targetLearners.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-sm font-bold text-slate-700">등록된 학습자가 없습니다.</p>
              <p className="text-xs text-slate-500 mt-1">학습자를 먼저 등록해주세요.</p>
            </div>
          ) : (
            targetLearners.map((learner) => {
              const data = getStudentData(learner);
              const comment = commentsMap[learner.id] || '매일 15분 독해 루틴을 성실히 실천하고 있으며, 문장 구조 분석과 어휘 학습에서 꾸준한 성장을 보이고 있습니다.';
              const stampKey = stampsMap[learner.id] || 'king';
              const stampObj = MOM_STAMP_MAP[stampKey] || MOM_STAMP_MAP.king;

              return (
                <div 
                  key={learner.id}
                  className="individual-report-page max-w-3xl mx-auto bg-white p-7 sm:p-10 rounded-2xl shadow-md border border-slate-200 space-y-5 text-slate-900 print:shadow-none print:border-none print:p-0 print:max-w-none print:m-0"
                >
                  {/* 1. Official Header */}
                  <div className="border-b-2 border-slate-900 pb-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                      <span className="flex items-center gap-1.5 text-purple-900 font-black text-xs">
                        <span>👑</span>
                        <span>열공마미 수능 영어 1등급 학습 진단 센터</span>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        발행일: {todayStr} | 관리번호: CSAT-REPORT-{learner.id.slice(-4).toUpperCase()}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <div>
                        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
                          {learner.name} 학생 수능 영어 1등급 정밀 성적표
                        </h1>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                          "매일 15분 거미줄 독해 루틴으로 완성하는 수능 실전 구문 분석 리포트"
                        </p>
                      </div>

                      {/* Student Info Box */}
                      <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200 text-xs font-bold shrink-0 space-y-0.5 min-w-[200px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500">학생 성명:</span>
                          <span className="text-purple-950 font-black">{learner.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">학년/목표:</span>
                          <span className="text-slate-800">{learner.grade || '수험생'} · {learner.targetLevel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">연속 출석:</span>
                          <span className="text-orange-600 font-black">🔥 {data.streak}일 연속</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">총괄 관리자:</span>
                          <span className="text-slate-800 font-black">{adminName}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Top Summary KPI Cards */}
                  <div className="grid grid-cols-4 gap-2.5 text-center">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold block">누적 완독 지문</span>
                      <span className="text-lg font-black text-purple-900">{data.records.length}편</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold block">문제 정답률</span>
                      <span className="text-lg font-black text-slate-900">{data.avgScore}점</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold block">마스터 어휘 수</span>
                      <span className="text-lg font-black text-red-600">{data.memorizedCount}개</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold block">오늘 완독 상태</span>
                      <span className="text-sm font-black text-emerald-700 block mt-1">
                        {data.isTodayCompleted ? '완료 🟢' : '학습 전 ⏳'}
                      </span>
                    </div>
                  </div>

                  {/* 3. Middle Section: Attendance Matrix & Category Balance */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    
                    {/* 4-Week Attendance Calendar Grid */}
                    <div className="border border-slate-200 rounded-xl p-3.5 space-y-2 bg-white">
                      <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-100 pb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-purple-700" />
                          <span>최근 4주 출석 현황 (최근 28일)</span>
                        </span>
                        <span className="text-[11px] text-purple-800 font-black">총 {data.records.length}회 완료</span>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
                          <span key={i} className="font-bold text-slate-400 text-[10px]">{d}</span>
                        ))}
                        {past28Days.map((item, idx) => {
                          const studied = data.records.some((r) => r.date === item.date);
                          return (
                            <div
                              key={idx}
                              className={`p-1 rounded-md border text-center text-[10px] ${
                                studied 
                                  ? 'bg-purple-700 text-white font-bold border-purple-800' 
                                  : 'bg-slate-50 border-slate-200 text-slate-400'
                              }`}
                            >
                              <span>{item.dayNum}</span>
                              {studied && <span className="block text-[7px] font-black text-amber-200 leading-none mt-0.5">완료</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Category Balance Breakdown */}
                    <div className="border border-slate-200 rounded-xl p-3.5 space-y-2 bg-white">
                      <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-100 pb-1.5">
                        <span className="flex items-center gap-1.5">
                          <BookmarkCheck className="w-3.5 h-3.5 text-purple-700" />
                          <span>수능 6대 영역별 독해 밸런스</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">분야별 완독 편수</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        {Object.keys(data.catCounts).map((cat) => (
                          <div key={cat} className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                            <span className="text-slate-600 font-medium">{CATEGORY_NAMES[cat] || cat}</span>
                            <span className="font-black text-purple-900">{data.catCounts[cat]}편</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 4. Recent Study History Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <div className="bg-slate-100 px-3.5 py-2 font-black text-slate-800 flex items-center justify-between border-b border-slate-200">
                      <span>📝 최근 수능 독해 지문 실전 학습 이력</span>
                      <span className="text-[11px] font-normal text-slate-500">최근 학습 4회분</span>
                    </div>
                    {data.recentRecords.length === 0 ? (
                      <div className="p-4 text-center text-slate-400 text-xs font-medium">
                        아직 완료된 독해 지문 기록이 없습니다. 오늘 15분 독해를 시작해보세요!
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead className="bg-slate-50 font-bold text-slate-600 border-b border-slate-200">
                          <tr>
                            <th className="p-2">학습일자</th>
                            <th className="p-2">영역</th>
                            <th className="p-2">지문 제목</th>
                            <th className="p-2 text-center">문제 점수</th>
                            <th className="p-2 text-center">학습 시간</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {data.recentRecords.map((r, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50/80">
                              <td className="p-2 font-bold text-slate-700">{r.date}</td>
                              <td className="p-2 text-purple-900 font-bold">{CATEGORY_NAMES[r.category] || r.category}</td>
                              <td className="p-2 text-slate-900 font-bold truncate max-w-[220px]">{r.passageTitle}</td>
                              <td className="p-2 text-center font-black text-slate-900">{r.score || 100}점</td>
                              <td className="p-2 text-center text-slate-500">{r.timeSpentSeconds ? `${Math.round(r.timeSpentSeconds / 60)}분` : '15분'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* 5. 👑 ADMIN CUSTOM EVALUATION & COMMENT SECTION (Dedicated to this student) */}
                  <div className="p-4 rounded-xl border-2 border-purple-300 bg-purple-50/50 space-y-2">
                    <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">👑</span>
                        <h4 className="text-xs font-black text-purple-950">
                          열공마미 총괄 관리자 종합 평가 & 학습 지도 코멘트
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-black text-pink-700 bg-pink-100 px-2.5 py-1 rounded-full border border-pink-200">
                        <span>{stampObj.icon}</span>
                        <span>{stampObj.label}</span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-purple-950 leading-relaxed whitespace-pre-line">
                      {comment}
                    </p>
                  </div>

                  {/* 6. Spider-Man Happy Coach Guidance */}
                  <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-red-400 font-bold text-[11px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>스파이더맨 해피 코치의 독해 솔루션 가이드</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      수능 1등급을 위한 핵심은 끊어읽기(Chunking)와 핵심 키워드 간의 논리적 연결성 파악입니다. 매일 15분의 꾸준함이 시험장에서 가장 강력한 거미줄이 됩니다. 🕸️✨
                    </p>
                  </div>

                  {/* 7. Official Signature & Confirmation Stamp Box */}
                  <div className="pt-3 border-t-2 border-slate-900 flex items-center justify-between text-xs text-slate-700 font-bold">
                    <div>
                      <span>총괄 학습 관리자: </span>
                      <span className="font-black text-slate-950 underline decoration-purple-500 decoration-2">{adminName} (인)</span>
                    </div>
                    <div>
                      <span>수험생 / 학부모 확인: ___________________ (인)</span>
                    </div>
                  </div>

                </div>
              );
            })
          )}

        </div>

      </div>
    </div>
  );
};
