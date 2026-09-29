import React, { useState, useEffect } from 'react';
import { Passage, ReadingDisplayMode, VocabularyItem, SavedWord, UserProfile } from '../types';
import { 
  Volume2, 
  Play, 
  Pause, 
  Sparkles, 
  Check, 
  Plus, 
  ChevronRight,
  Eye,
  EyeOff,
  Lightbulb,
  BookOpen,
  Crown,
  BarChart3
} from 'lucide-react';
import { saveWord } from '../utils/storage';
import { getRecommendedPassagesForLearner } from '../data/passages';
import { PassageVocabStudy } from './PassageVocabStudy';

interface ReadingViewProps {
  passage: Passage;
  onGoToPractice: () => void;
  onGoToVocab?: () => void;
  onAnalyzeSentence: (sentence: string) => void;
  onWordSavedNotification: (word: string) => void;
  activeProfile?: UserProfile;
  allPassages?: Passage[];
  onSelectPassage?: (passage: Passage) => void;
  onOpenPassageSelector?: () => void;
  onGoToAnalytics?: () => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({
  passage,
  onGoToPractice,
  onGoToVocab,
  onAnalyzeSentence,
  onWordSavedNotification,
  activeProfile,
  allPassages,
  onSelectPassage,
  onOpenPassageSelector,
  onGoToAnalytics,
}) => {
  const [displayMode, setDisplayMode] = useState<ReadingDisplayMode>('standard');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [ttsSpeed, setTtsSpeed] = useState<number>(0.95);
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
  const [showBackground, setShowBackground] = useState(true);
  const [userSummaryText, setUserSummaryText] = useState('');
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [savedWordMap, setSavedWordMap] = useState<Record<string, boolean>>({});

  const isMomAdmin = activeProfile?.name === '열공마미' || activeProfile?.isMomOrAdmin;
  const recommendations = getRecommendedPassagesForLearner(activeProfile, allPassages || [passage]);

  const allSentences = passage.paragraphs.flatMap((p) =>
    p.sentenceBreakdown.map((s) => s.sentenceEn)
  );

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setSelectedWord(null);
    setUserSummaryText('');
    setShowModelAnswer(false);
  }, [passage.id]);

  const handlePlayTTS = () => {
    if (!('speechSynthesis' in window)) {
      alert('이 브라우저는 음성 합성(TTS)을 지원하지 않습니다.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const entireText = allSentences.join(' ');
    const utterance = new SpeechSynthesisUtterance(entireText);
    utterance.lang = 'en-US';
    utterance.rate = ttsSpeed;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakSingleWord = (word: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleSaveWord = (vocab: VocabularyItem) => {
    saveWord({
      word: vocab.word,
      phonetic: vocab.phonetic,
      meaningKo: vocab.meaningKo,
      partOfSpeech: vocab.partOfSpeech,
      exampleEn: vocab.exampleEn,
      exampleKo: vocab.exampleKo,
      passageId: passage.id,
      passageTitle: passage.title,
    });
    setSavedWordMap((prev) => ({ ...prev, [vocab.word.toLowerCase()]: true }));
    onWordSavedNotification(vocab.word);
  };

  const renderInteractiveText = (text: string) => {
    const words = passage.vocabulary;
    if (!words || words.length === 0) return text;

    const sortedWords = [...words].sort((a, b) => b.word.length - a.word.length);
    const regexPattern = new RegExp(
      `\\b(${sortedWords.map((w) => w.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
      'gi'
    );

    const parts = text.split(regexPattern);

    return parts.map((part, i) => {
      const matchedVocab = words.find((w) => w.word.toLowerCase() === part.toLowerCase());
      if (matchedVocab) {
        return (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedWord(matchedVocab);
            }}
            className="inline-block px-1.5 py-0.5 mx-0.5 rounded-md font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border-b border-blue-400 cursor-pointer transition-all hover:scale-105"
            title={`클릭하여 '${matchedVocab.word}' 뜻과 예문 보기`}
          >
            {part}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="space-y-5">
      
      {/* 0. Personalized Recommendation for Student OR Admin Report Direct Link for Mom */}
      {isMomAdmin ? (
        <div className="bg-gradient-to-r from-purple-50 via-white to-pink-50 rounded-2xl p-4 sm:p-5 border border-purple-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center text-lg font-bold shadow-xs shrink-0">
              <Crown className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xs sm:text-sm font-black text-purple-950">
                  열공마미 총괄 학습 관리자 모드
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600 text-white font-bold">
                  관리자 대시보드
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                등록된 학습자들의 오늘 15분 독해 완독 여부, 출석률, 단어장 기록 및 칭찬 도장을 확인하세요.
              </p>
            </div>
          </div>

          {onGoToAnalytics && (
            <button
              type="button"
              onClick={onGoToAnalytics}
              className="w-full sm:w-auto px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>학습자 학습기록 리포트 바로가기 →</span>
            </button>
          )}
        </div>
      ) : recommendations.recommendedPassages.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 via-white to-slate-50 rounded-2xl p-4 sm:p-5 border border-red-200/80 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center text-base font-bold shadow-xs shrink-0">
                🕸️
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900">
                    {activeProfile?.name ? `${activeProfile.name} 님 맞춤 추천 지문` : '학습자 맞춤 추천 지문'}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white font-bold">
                    {recommendations.badgeLabel}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {recommendations.reason}
                </p>
              </div>
            </div>
            {onOpenPassageSelector && (
              <button
                onClick={onOpenPassageSelector}
                className="text-xs font-bold text-red-600 hover:text-red-700 bg-white hover:bg-red-50 px-2.5 py-1 rounded-xl border border-red-200 transition-colors cursor-pointer"
              >
                전체 지문 목록 보기 →
              </button>
            )}
          </div>

          {/* 3 Recommended Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {recommendations.recommendedPassages.map((rp) => {
              const isCurrent = rp.id === passage.id;
              return (
                <div
                  key={rp.id}
                  onClick={() => onSelectPassage && onSelectPassage(rp)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-white border-red-500 ring-2 ring-red-400 shadow-xs'
                      : 'bg-white hover:bg-red-50/40 border-slate-200 hover:border-red-300 shadow-2xs hover:scale-[1.01]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200">
                        {rp.level}
                      </span>
                      {isCurrent ? (
                        <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" /> 현재 학습 중
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          ⏱️ {rp.readTimeMinutes}분
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 font-serif">
                      {rp.title}
                    </h4>
                    <p className="text-xs font-bold text-slate-600 line-clamp-1 mt-0.5">
                      {rp.titleKo}
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">{rp.wordCount}단어</span>
                    <button
                      type="button"
                      className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-colors ${
                        isCurrent
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 hover:bg-red-600 hover:text-white text-slate-700'
                      }`}
                    >
                      {isCurrent ? '학습중' : '지문 선택'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 1. Passage Hero & Control Bar - Spider-Man Styled */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />
        
        {/* Badges & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
              <span>🎯</span> {passage.level}
            </span>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
              🏷️ {passage.source}
            </span>
            <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-50 text-slate-600 border border-slate-200 flex items-center gap-1">
              <span>⏱️</span> {passage.wordCount}단어 · {passage.readTimeMinutes}분 완독
            </span>
          </div>

          {/* Audio TTS Player */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={handlePlayTTS}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-red-700 text-white animate-pulse'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>일시정지</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>원어민 듣기</span>
                </>
              )}
            </button>

            {/* Speed Selector */}
            <select
              value={ttsSpeed}
              onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
              className="text-xs font-bold px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none cursor-pointer"
              title="음성 속도 조절"
            >
              <option value={0.8}>0.8x</option>
              <option value={0.95}>1.0x (표준)</option>
              <option value={1.15}>1.2x</option>
            </select>
          </div>
        </div>

        {/* Title Header */}
        <div>
          <div className="flex items-center gap-2 mb-1 text-red-600 font-bold text-xs">
            <span>🕸️ 오늘의 영어 독해 테마</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug font-serif">
            {passage.title}
          </h1>
          <p className="text-sm font-bold text-slate-600 mt-1 font-sans">
            {passage.titleKo}
          </p>
        </div>

        {/* Background Knowledge Briefing Banner */}
        {passage.backgroundKnowledge && (
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Lightbulb className="w-4 h-4 text-red-600" />
                <span>1분 교양 배경지식 노트</span>
              </div>
              <button
                onClick={() => setShowBackground(!showBackground)}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
              >
                {showBackground ? '접기 ▲' : '펼쳐보기 ▼'}
              </button>
            </div>
            {showBackground && (
              <p className="text-xs text-slate-700 leading-relaxed font-medium pt-1">
                {passage.backgroundKnowledge}
              </p>
            )}
          </div>
        )}

        {/* Display Mode Switcher Tabs */}
        <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setDisplayMode('standard')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                displayMode === 'standard'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📖 기본 독해
            </button>
            <button
              onClick={() => setDisplayMode('chunking')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                displayMode === 'chunking'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✂️ 끊어읽기 (직독직해)
            </button>
            <button
              onClick={() => setDisplayMode('bilingual')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                displayMode === 'bilingual'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇰🇷 한영 대역
            </button>
            <button
              onClick={() => setDisplayMode('syntax')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                displayMode === 'syntax'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔍 구문 & 어법
            </button>
          </div>

          <span className="text-xs text-slate-500 font-medium hidden sm:inline-flex items-center gap-1">
            <span>💡</span> 하이라이트 단어를 클릭하면 뜻과 예문이 나와요
          </span>
        </div>

      </div>

      {/* 2. Main Passage Content Card - Clean White Slate */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 relative">
        
        {/* MODE: Standard Paragraphs */}
        {displayMode === 'standard' && (
          <div className="space-y-6">
            {passage.paragraphs.map((para) => (
              <div key={para.paragraphNumber} className="relative group">
                <div className="flex gap-3 items-start">
                  {passage.paragraphs.length > 1 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 select-none shrink-0 mt-1">
                      P{para.paragraphNumber}
                    </span>
                  )}
                  <div className="space-y-2 flex-1">
                    <p className={`text-base sm:text-lg text-slate-800 leading-relaxed font-serif tracking-wide ${passage.paragraphs.length === 1 ? 'indent-4' : 'indent-4'}`}>
                      {para.sentenceBreakdown.map((sb, idx) => (
                        <span
                          key={idx}
                          className="hover:bg-slate-100 rounded-md px-1 py-0.5 transition-colors cursor-pointer inline"
                          onClick={() => onAnalyzeSentence(sb.sentenceEn)}
                          title="클릭하여 AI 구문 심층 분석 보기 🔍"
                        >
                          {renderInteractiveText(sb.sentenceEn)}{' '}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODE: Chunking (직독직해 끊어읽기) */}
        {displayMode === 'chunking' && (
          <div className="space-y-6 divide-y divide-slate-100">
            {passage.paragraphs.map((para) => (
              <div key={para.paragraphNumber} className="pt-4 first:pt-0 space-y-4">
                {passage.paragraphs.length > 1 && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                    단락 {para.paragraphNumber} ✂️
                  </span>
                )}

                <div className="space-y-3">
                  {para.sentenceBreakdown.map((sb, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">
                          Sentence #{sIdx + 1}
                        </span>
                        <button
                          onClick={() => onAnalyzeSentence(sb.sentenceEn)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          AI 구문분석
                        </button>
                      </div>

                      {/* Chunks flow */}
                      <div className="flex flex-wrap gap-2 text-sm leading-relaxed">
                        {sb.chunks.map((chk, cIdx) => (
                          <div
                            key={cIdx}
                            className="inline-flex flex-col bg-white px-3 py-1.5 rounded-lg border border-slate-200"
                          >
                            <span className="font-bold text-slate-900 font-serif">
                              {chk.chunkEn}
                            </span>
                            <span className="text-xs text-slate-600 font-medium mt-0.5">
                              {chk.chunkKo}
                            </span>
                          </div>
                        ))}
                      </div>

                      {sb.grammarTip && (
                        <div className="pt-2 text-xs text-slate-700 font-medium flex items-center gap-1.5 border-t border-slate-200">
                          <span className="text-sm">💡</span>
                          <span>수능 어법 팁: {sb.grammarTip}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODE: Bilingual (한영 대역) */}
        {displayMode === 'bilingual' && (
          <div className="space-y-6 divide-y divide-slate-100">
            {passage.paragraphs.map((para) => (
              <div key={para.paragraphNumber} className="pt-4 first:pt-0 space-y-4">
                {passage.paragraphs.length > 1 && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    단락 {para.paragraphNumber} 🇰🇷
                  </span>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* English Column */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-bold text-slate-600 block mb-2">📖 영문 원문</span>
                    <p className="text-base text-slate-900 leading-relaxed font-serif">
                      {para.textEn}
                    </p>
                  </div>

                  {/* Korean Translation Column */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-bold text-slate-600 block mb-2">🇰🇷 우리말 해석</span>
                    <p className="text-sm text-slate-800 leading-relaxed font-medium">
                      {para.textKo}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODE: Syntax & Grammar */}
        {displayMode === 'syntax' && (
          <div className="space-y-4">
            {passage.paragraphs.flatMap((p) => p.sentenceBreakdown).map((sb, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    문장 #{idx + 1}
                  </span>
                  <button
                    onClick={() => onAnalyzeSentence(sb.sentenceEn)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI 심층 분해</span>
                  </button>
                </div>

                <p className="text-base font-medium text-slate-900 font-serif leading-relaxed">
                  {renderInteractiveText(sb.sentenceEn)}
                </p>

                {/* Chunks */}
                <div className="p-3 rounded-lg bg-slate-50 text-xs text-slate-700 space-y-1 border border-slate-200">
                  <span className="font-bold text-slate-800 block text-[11px]">
                    직독직해 끊어읽기
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {sb.chunks.map((c) => `${c.chunkEn} (${c.chunkKo})`).join(' / ')}
                  </p>
                </div>

                {sb.grammarTip && (
                  <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-xs text-slate-800 font-medium flex items-start gap-2">
                    <span className="text-sm">💡</span>
                    <div>
                      <span className="font-bold text-blue-900 block">수능 어법 포인트:</span>
                      <span>{sb.grammarTip}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* 3. Selected Word Popover Card - Clean Cool Tone */}
      {selectedWord && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-700 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg">📚</span>
                  <h3 className="text-xl sm:text-2xl font-black font-serif text-white tracking-wide">
                    {selectedWord.word}
                  </h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {selectedWord.partOfSpeech}
                  </span>
                  {selectedWord.phonetic && (
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedWord.phonetic}
                    </span>
                  )}
                  <button
                    onClick={() => handleSpeakSingleWord(selectedWord.word)}
                    className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                    title="발음 듣기"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-base font-bold text-sky-400 mt-1 font-sans">
                  {selectedWord.meaningKo}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSaveWord(selectedWord)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  savedWordMap[selectedWord.word.toLowerCase()]
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {savedWordMap[selectedWord.word.toLowerCase()] ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>저장됨</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>단어장 보관</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setSelectedWord(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-300 bg-slate-800/80 rounded-xl p-3 space-y-1 border border-slate-700">
            <p className="font-serif italic text-slate-200 text-sm">"{selectedWord.exampleEn}"</p>
            <p className="text-slate-400 font-sans">{selectedWord.exampleKo}</p>
          </div>
        </div>
      )}

      {/* 4. Complete Interactive Passage Vocabulary Study Section */}
      <PassageVocabStudy
        passage={passage}
        onWordSavedNotification={onWordSavedNotification}
        onGoToVocabTab={onGoToVocab}
      />

      {/* 5. Mini Writing / Summary Practice Exercise */}
      {passage.writingOrSummaryTask && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-base">
              ✏️
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">오늘의 1문장 핵심 요약 노트</h3>
              <p className="text-xs text-slate-500 font-medium">지문의 핵심 주제를 내 손으로 1문장으로 정리해보세요</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <p className="font-bold text-slate-800">
              📌 [미션] {passage.writingOrSummaryTask.prompt}
            </p>
            <p className="text-slate-500 text-[11px]">
              💡 작성 힌트: {passage.writingOrSummaryTask.guide}
            </p>
          </div>

          <div className="space-y-2">
            <textarea
              value={userSummaryText}
              onChange={(e) => setUserSummaryText(e.target.value)}
              placeholder="여기에 영문이나 한글로 핵심 요약 문장을 적어보세요..."
              rows={2}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all resize-none font-medium"
            />

            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
              >
                {showModelAnswer ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>모범 답안 닫기</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>모범 답안 보기</span>
                  </>
                )}
              </button>
              {userSummaryText.trim().length > 0 && (
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <span>💮</span> 작성 완료
                </span>
              )}
            </div>

            {showModelAnswer && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium space-y-1 animate-in fade-in duration-150">
                <span className="font-bold text-slate-900 block">✨ [모범 작성 예시]</span>
                <p className="font-serif italic text-slate-700 text-sm">
                  {passage.writingOrSummaryTask.modelAnswer}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Big CTA to CSAT Practice Question - Cool Slate Tone */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded-md text-blue-400 inline-block border border-slate-700">
              STEP 2 🎯
            </span>
            <span className="text-xs text-slate-300">수능 실전 문항 풀이</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold">
            지문 독해를 완료했나요? 이제 수능 문제를 풀어보세요!
          </h3>
          <p className="text-xs text-slate-400">
            5지선다형 실전 문항 풀이, 즉시 자동 채점 및 1:1 AI 코치 해설 제공 ✨
          </p>
        </div>

        <button
          onClick={onGoToPractice}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs shrink-0 flex items-center gap-1.5 hover:scale-102 cursor-pointer"
        >
          <span>수능 문제 풀기</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
