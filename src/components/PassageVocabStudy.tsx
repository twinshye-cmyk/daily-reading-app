import React, { useState } from 'react';
import { Passage, VocabularyItem } from '../types';
import { 
  Volume2, 
  Check, 
  Plus, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Play, 
  Square, 
  HelpCircle, 
  BookmarkCheck, 
  ChevronRight, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { saveWord, getSavedWords } from '../utils/storage';
import confetti from 'canvas-confetti';

interface PassageVocabStudyProps {
  passage: Passage;
  onWordSavedNotification: (word: string) => void;
  onGoToVocabTab?: () => void;
}

export const PassageVocabStudy: React.FC<PassageVocabStudyProps> = ({
  passage,
  onWordSavedNotification,
  onGoToVocabTab,
}) => {
  const [hideMeanings, setHideMeanings] = useState(false);
  const [revealedWordIndices, setRevealedWordIndices] = useState<Record<number, boolean>>({});
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [activePlayIdx, setActivePlayIdx] = useState<number | null>(null);
  
  // Interactive Flashcard modal inside section
  const [studyMode, setStudyMode] = useState<'grid' | 'flashcard' | 'quick_quiz'>('grid');
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Quick Quiz State
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [isQuizAnswerSubmitted, setIsQuizAnswerSubmitted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Track saved status locally
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>(() => {
    const existing = getSavedWords();
    const map: Record<string, boolean> = {};
    existing.forEach((w) => {
      map[w.word.toLowerCase()] = true;
    });
    return map;
  });

  const vocabList = passage.vocabulary || [];

  const handleSpeak = (text: string, onEnd?: () => void) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.9;
    if (onEnd) {
      u.onend = onEnd;
      u.onerror = onEnd;
    }
    window.speechSynthesis.speak(u);
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
      passageTitle: passage.titleKo || passage.title,
    });

    setSavedMap((prev) => ({ ...prev, [vocab.word.toLowerCase()]: true }));
    onWordSavedNotification(vocab.word);
  };

  const handleSaveAllWords = () => {
    vocabList.forEach((vocab) => {
      saveWord({
        word: vocab.word,
        phonetic: vocab.phonetic,
        meaningKo: vocab.meaningKo,
        partOfSpeech: vocab.partOfSpeech,
        exampleEn: vocab.exampleEn,
        exampleKo: vocab.exampleKo,
        passageId: passage.id,
        passageTitle: passage.titleKo || passage.title,
      });
    });

    const newMap: Record<string, boolean> = { ...savedMap };
    vocabList.forEach((v) => {
      newMap[v.word.toLowerCase()] = true;
    });
    setSavedMap(newMap);
    onWordSavedNotification(`총 ${vocabList.length}개 단어`);
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
    });
  };

  // Continuous TTS Auto-Player
  const handleToggleAutoPlay = () => {
    if (isAutoPlaying) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsAutoPlaying(false);
      setActivePlayIdx(null);
      return;
    }

    if (vocabList.length === 0) return;
    setIsAutoPlaying(true);
    playVocabAtIndex(0);
  };

  const playVocabAtIndex = (idx: number) => {
    if (idx >= vocabList.length) {
      setIsAutoPlaying(false);
      setActivePlayIdx(null);
      return;
    }
    setActivePlayIdx(idx);
    const item = vocabList[idx];
    handleSpeak(item.word, () => {
      setTimeout(() => {
        playVocabAtIndex(idx + 1);
      }, 600);
    });
  };

  const toggleRevealMeaning = (idx: number) => {
    setRevealedWordIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Helper for generating quiz choices
  const currentQuizWord = vocabList[quizIdx];
  const generateQuizOptions = (correctMeaning: string) => {
    const wrongPool = vocabList
      .filter((v) => v.meaningKo !== correctMeaning)
      .map((v) => v.meaningKo);
    
    // Add default fallbacks if pool is small
    const defaults = ['강화하다, 촉진하다', '명백한, 분명한', '상호작용, 소통', '인지적인, 사고의'];
    const combinedWrong = Array.from(new Set([...wrongPool, ...defaults])).filter(
      (m) => m !== correctMeaning
    );
    
    const shuffledWrong = combinedWrong.sort(() => 0.5 - Math.random()).slice(0, 3);
    return [correctMeaning, ...shuffledWrong].sort(() => 0.5 - Math.random());
  };

  const [quizOptions, setQuizOptions] = useState<string[]>(() => 
    vocabList.length > 0 ? generateQuizOptions(vocabList[0]?.meaningKo || '') : []
  );

  const handleStartQuiz = () => {
    setStudyMode('quick_quiz');
    setQuizIdx(0);
    setQuizScore(0);
    setQuizFinished(false);
    setSelectedQuizOption(null);
    setIsQuizAnswerSubmitted(false);
    if (vocabList.length > 0) {
      setQuizOptions(generateQuizOptions(vocabList[0].meaningKo));
    }
  };

  const handleAnswerQuiz = (option: string) => {
    if (isQuizAnswerSubmitted) return;
    setSelectedQuizOption(option);
    setIsQuizAnswerSubmitted(true);

    const isCorrect = option === currentQuizWord.meaningKo;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizIdx + 1 < vocabList.length) {
      const nextIdx = quizIdx + 1;
      setQuizIdx(nextIdx);
      setSelectedQuizOption(null);
      setIsQuizAnswerSubmitted(false);
      setQuizOptions(generateQuizOptions(vocabList[nextIdx].meaningKo));
    } else {
      setQuizFinished(true);
      confetti({
        particleCount: 60,
        spread: 60,
      });
    }
  };

  if (vocabList.length === 0) {
    return null;
  }

  return (
    <div id="passage-vocabulary-study-card" className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-5">
      {/* Header with Title & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center text-lg font-bold shadow-xs">
            📚
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                지문 핵심 수능 어휘 완벽 정복
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                {vocabList.length}개 필수 단어
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              이 지문을 완벽하게 이해하기 위해 반드시 외워야 할 핵심 어휘와 수능 빈출 예문입니다.
            </p>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switchers */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setStudyMode('grid')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                studyMode === 'grid'
                  ? 'bg-white text-red-600 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📖 목록형
            </button>
            <button
              onClick={() => {
                setStudyMode('flashcard');
                setFlashcardIdx(0);
                setIsCardFlipped(false);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                studyMode === 'flashcard'
                  ? 'bg-white text-red-600 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎴 플래시카드
            </button>
            <button
              onClick={handleStartQuiz}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                studyMode === 'quick_quiz'
                  ? 'bg-white text-red-600 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎯 30초 퀴즈
            </button>
          </div>

          {/* Meaning Hide/Show Toggle */}
          {studyMode === 'grid' && (
            <button
              onClick={() => setHideMeanings(!hideMeanings)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                hideMeanings
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="한글 뜻을 가려서 스스로 암기 테스트를 진행합니다."
            >
              {hideMeanings ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>뜻 가림 모드 ON</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>뜻 가리기 (셀프 암기)</span>
                </>
              )}
            </button>
          )}

          {/* Continuous Audio Player */}
          <button
            onClick={handleToggleAutoPlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              isAutoPlaying
                ? 'bg-red-600 text-white border-red-700 animate-pulse'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {isAutoPlaying ? (
              <>
                <Square className="w-3.5 h-3.5" />
                <span>재생 정지</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                <span>전체 단어 연속 듣기</span>
              </>
            )}
          </button>

          {/* Save All to Vocab */}
          <button
            onClick={handleSaveAllWords}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer"
            title="이 지문의 모든 단어를 나의 단어장에 한번에 저장합니다."
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>전체 단어장 저장</span>
          </button>
        </div>
      </div>

      {/* 1. GRID / LIST STUDY MODE */}
      {studyMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {vocabList.map((item, idx) => {
            const isSaved = savedMap[item.word.toLowerCase()];
            const isCurrentlyPlaying = isAutoPlaying && activePlayIdx === idx;
            const isRevealed = revealedWordIndices[idx];
            const shouldHideMeaning = hideMeanings && !isRevealed;

            return (
              <div
                key={item.word + idx}
                className={`rounded-2xl p-4 transition-all border flex flex-col justify-between ${
                  isCurrentlyPlaying
                    ? 'bg-red-50/80 border-red-400 shadow-md ring-2 ring-red-400 ring-offset-1'
                    : 'bg-slate-50/80 hover:bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Top Word & Phonetic Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleSpeak(item.word)}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        title="원어민 발음 듣기"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      
                      <span className="font-serif font-black text-slate-900 text-base sm:text-lg tracking-wide">
                        {item.word}
                      </span>

                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700">
                        {item.partOfSpeech}
                      </span>

                      {item.phonetic && (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {item.phonetic}
                        </span>
                      )}
                    </div>

                    {/* Bookmark Word Button */}
                    <button
                      onClick={() => handleSaveWord(item)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        isSaved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 shadow-xs'
                      }`}
                      title={isSaved ? '이미 단어장에 보관됨' : '나의 단어장에 추가'}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>저장됨</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>단어장</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Meaning Area */}
                  <div className="mt-2.5">
                    {shouldHideMeaning ? (
                      <div
                        onClick={() => toggleRevealMeaning(idx)}
                        className="p-2 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-900 text-xs font-bold text-center cursor-pointer hover:bg-amber-200 transition-colors select-none"
                      >
                        🔒 뜻 가림 상태입니다 (클릭하여 확인)
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-black text-blue-900">
                          {item.meaningKo}
                        </p>
                        {hideMeanings && (
                          <button
                            onClick={() => toggleRevealMeaning(idx)}
                            className="text-[11px] text-slate-400 hover:text-slate-600 font-bold"
                          >
                            다시 가리기
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Example Sentence Box */}
                {item.exampleEn && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/70 text-xs space-y-1">
                    <p className="font-serif italic text-slate-700 leading-relaxed">
                      "{item.exampleEn}"
                    </p>
                    {item.exampleKo && (
                      <p className="text-slate-500 text-[11px]">
                        {item.exampleKo}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 2. FLASHCARD INTERACTIVE STUDY MODE */}
      {studyMode === 'flashcard' && (
        <div className="max-w-md mx-auto py-3 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>단어 {flashcardIdx + 1} / {vocabList.length}</span>
            <span>카드를 클릭하면 앞/뒷면이 뒤집힙니다</span>
          </div>

          <div
            onClick={() => setIsCardFlipped(!isCardFlipped)}
            className="min-h-[220px] rounded-3xl bg-linear-to-br from-slate-900 to-slate-800 text-white p-7 flex flex-col items-center justify-center text-center cursor-pointer shadow-lg border border-slate-700 transition-all hover:scale-101 relative select-none"
          >
            <span className="absolute top-4 right-4 text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {isCardFlipped ? '📖 뜻 & 예문' : '🔤 영단어'}
            </span>

            {!isCardFlipped ? (
              <div className="space-y-3">
                <h4 className="text-3xl font-black font-serif text-white tracking-wide">
                  {vocabList[flashcardIdx]?.word}
                </h4>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    {vocabList[flashcardIdx]?.partOfSpeech}
                  </span>
                  {vocabList[flashcardIdx]?.phonetic && (
                    <span className="text-xs text-slate-400 font-mono">
                      {vocabList[flashcardIdx]?.phonetic}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-4">👉 탭하여 뜻 확인하기</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-2xl font-black text-sky-400">
                  {vocabList[flashcardIdx]?.meaningKo}
                </p>
                {vocabList[flashcardIdx]?.exampleEn && (
                  <div className="p-3 bg-slate-800/80 rounded-xl text-xs text-slate-300 text-left border border-slate-700 mt-2">
                    <p className="font-serif italic text-white">"{vocabList[flashcardIdx]?.exampleEn}"</p>
                    <p className="text-slate-400 mt-1">{vocabList[flashcardIdx]?.exampleKo}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Flashcard Controller */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => {
                if (flashcardIdx > 0) {
                  setFlashcardIdx(flashcardIdx - 1);
                  setIsCardFlipped(false);
                }
              }}
              disabled={flashcardIdx === 0}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              ◀ 이전 단어
            </button>
            <button
              onClick={() => handleSpeak(vocabList[flashcardIdx]?.word || '')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="발음 듣기"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSaveWord(vocabList[flashcardIdx])}
              className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors cursor-pointer"
              title="단어장 보관"
            >
              {savedMap[vocabList[flashcardIdx]?.word?.toLowerCase()] ? '저장됨' : '+ 단어장'}
            </button>
            <button
              onClick={() => {
                if (flashcardIdx < vocabList.length - 1) {
                  setFlashcardIdx(flashcardIdx + 1);
                  setIsCardFlipped(false);
                }
              }}
              disabled={flashcardIdx === vocabList.length - 1}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-xs font-black text-white transition-colors cursor-pointer"
            >
              다음 단어 ▶
            </button>
          </div>
        </div>
      )}

      {/* 3. QUICK QUIZ MODE */}
      {studyMode === 'quick_quiz' && (
        <div className="max-w-md mx-auto py-2 space-y-4">
          {!quizFinished ? (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>어휘 퀴즈 {quizIdx + 1} / {vocabList.length}</span>
                <span className="text-red-600 font-black">현재 점수: {quizScore}점</span>
              </div>

              <div className="text-center py-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h4 className="text-2xl font-black font-serif text-slate-900">
                    {currentQuizWord?.word}
                  </h4>
                  <button
                    onClick={() => handleSpeak(currentQuizWord?.word || '')}
                    className="p-1 rounded-md text-slate-500 hover:text-red-600"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {currentQuizWord?.partOfSpeech}
                </span>
              </div>

              <p className="text-xs font-bold text-slate-700 text-center">
                위 단어의 올바른 한국어 뜻을 선택하세요:
              </p>

              <div className="grid grid-cols-1 gap-2">
                {quizOptions.map((opt, i) => {
                  const isSelected = selectedQuizOption === opt;
                  const isCorrectAnswer = opt === currentQuizWord?.meaningKo;
                  
                  let btnClass = "bg-white hover:bg-slate-100 text-slate-800 border-slate-200";
                  if (isQuizAnswerSubmitted) {
                    if (isCorrectAnswer) {
                      btnClass = "bg-emerald-600 text-white font-black border-emerald-700 shadow-xs";
                    } else if (isSelected) {
                      btnClass = "bg-rose-600 text-white font-bold border-rose-700";
                    } else {
                      btnClass = "bg-slate-100 text-slate-400 border-slate-200 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={opt + i}
                      onClick={() => handleAnswerQuiz(opt)}
                      disabled={isQuizAnswerSubmitted}
                      className={`p-3 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
                    >
                      <span>{i + 1}. {opt}</span>
                      {isQuizAnswerSubmitted && isCorrectAnswer && (
                        <span>⭕ 정답</span>
                      )}
                      {isQuizAnswerSubmitted && isSelected && !isCorrectAnswer && (
                        <span>❌ 오답</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {isQuizAnswerSubmitted && (
                <button
                  onClick={handleNextQuizQuestion}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1 mt-3"
                >
                  <span>{quizIdx + 1 < vocabList.length ? '다음 단어 문제' : '퀴즈 결과 보기'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl mx-auto">
                🏆
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900">단어 퀴즈 완료!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  총 {vocabList.length}문제 중 <b className="text-red-600 font-black">{quizScore}</b>개를 맞혔습니다!
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleStartQuiz}
                  className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  다시 풀기
                </button>
                <button
                  onClick={() => setStudyMode('grid')}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl transition-colors cursor-pointer"
                >
                  목록으로 돌아가기
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer link to global vocabulary tab */}
      {onGoToVocabTab && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            💡 단어장에서 오답 복습 및 나만의 단어 추가 관리를 할 수 있어요.
          </span>
          <button
            onClick={onGoToVocabTab}
            className="font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>단어장 전체 관리로 이동</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
