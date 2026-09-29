import React, { useState, useEffect } from 'react';
import { SavedWord, Passage } from '../types';
import { 
  Search, 
  Volume2, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  HelpCircle,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import { getSavedWords, toggleWordStatus, removeSavedWord, saveWord } from '../utils/storage';
import confetti from 'canvas-confetti';
import { HappyMascot } from './HappyMascot';

interface VocabularyViewProps {
  currentPassage: Passage;
  onGoToHome?: () => void;
  onWordListChanged: () => void;
}

export const VocabularyView: React.FC<VocabularyViewProps> = ({
  currentPassage,
  onGoToHome,
  onWordListChanged,
}) => {
  const [words, setWords] = useState<SavedWord[]>([]);
  const [filter, setFilter] = useState<'all' | 'learning' | 'memorized' | 'current'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'flashcard' | 'quiz'>('list');

  // Flashcard state
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);

  // Manual Add Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newPos, setNewPos] = useState('n.');
  const [newExample, setNewExample] = useState('');

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = () => {
    const loaded = getSavedWords();
    setWords(loaded);
  };

  const handleToggleStatus = (id: string) => {
    const updated = toggleWordStatus(id);
    setWords(updated);
    onWordListChanged();
  };

  const handleDelete = (id: string) => {
    if (confirm('이 단어를 단어장에서 삭제하시겠습니까?')) {
      const updated = removeSavedWord(id);
      setWords(updated);
      onWordListChanged();
    }
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  const handleAddManualWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaning.trim()) return;

    saveWord({
      word: newWord.trim(),
      meaningKo: newMeaning.trim(),
      partOfSpeech: newPos,
      exampleEn: newExample.trim(),
      exampleKo: '',
      passageId: currentPassage.id,
      passageTitle: currentPassage.title,
    });

    setNewWord('');
    setNewMeaning('');
    setNewExample('');
    setShowAddModal(false);
    loadWords();
    onWordListChanged();
  };

  const filteredWords = words.filter((w) => {
    const matchesSearch =
      w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.meaningKo.includes(searchTerm);
    if (!matchesSearch) return false;

    if (filter === 'learning') return w.status === 'learning';
    if (filter === 'memorized') return w.status === 'memorized';
    if (filter === 'current') return w.passageId === currentPassage.id;
    return true;
  });

  const memorizedCount = words.filter((w) => w.status === 'memorized').length;
  const memorizedRate = words.length > 0 ? Math.round((memorizedCount / words.length) * 100) : 0;

  const startQuiz = () => {
    if (words.length < 4) {
      alert('퀴즈를 진행하려면 최소 4개 이상의 단어가 필요합니다.');
      return;
    }
    setViewMode('quiz');
    setQuizIdx(0);
    setQuizScore(0);
    setQuizFinished(false);
    setQuizSelectedOption(null);
    generateQuizQuestion(0);
  };

  const generateQuizQuestion = (index: number) => {
    if (index >= words.length || index >= 10) {
      setQuizFinished(true);
      confetti({ particleCount: 80, spread: 70 });
      return;
    }

    const currentWord = words[index];
    const otherMeanings = words
      .filter((w) => w.word !== currentWord.word)
      .map((w) => w.meaningKo)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [currentWord.meaningKo, ...otherMeanings].sort(() => 0.5 - Math.random());
    setQuizOptions(options);
    setQuizSelectedOption(null);
  };

  const handleSelectQuizOption = (option: string) => {
    if (quizSelectedOption !== null) return;
    setQuizSelectedOption(option);

    const currentWord = words[quizIdx];
    if (option === currentWord.meaningKo) {
      setQuizScore((prev) => prev + 1);
      if (currentWord.status === 'learning') {
        toggleWordStatus(currentWord.id);
        loadWords();
      }
    }

    setTimeout(() => {
      setQuizIdx((prev) => {
        const next = prev + 1;
        generateQuizQuestion(next);
        return next;
      });
    }, 1000);
  };

  return (
    <div className="space-y-5">
      
      {/* Return to Home Button */}
      {onGoToHome && (
        <div className="flex items-center justify-between">
          <button
            onClick={onGoToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>← 홈(본문 독해)으로 돌아가기</span>
          </button>
        </div>
      )}

      {/* 1. Vocabulary Mastery Summary Banner - Cool Tone */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center text-xl">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">수능 영단어 보관함</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  어휘 마스터
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                총 <span className="font-bold text-slate-700">{words.length}개</span> 보관 중 · <span className="font-bold text-blue-600">{memorizedCount}개</span> 암기 완료 ({memorizedRate}%)
              </p>
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex text-xs gap-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📋 단어 목록
              </button>
              <button
                onClick={() => {
                  setViewMode('flashcard');
                  setCardIdx(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'flashcard' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🃏 플래시 카드
              </button>
              <button
                onClick={startQuiz}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'quiz' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎮 암기 테스트
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>직접 추가</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-xs font-medium text-slate-500">
            <span>단어 암기 달성률</span>
            <span className="text-blue-600 font-bold">{memorizedRate}% 완료</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${memorizedRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. MODE: LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="단어나 우리말 뜻으로 검색..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-medium"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1">
              {[
                { id: 'all', label: `전체 (${words.length})` },
                { id: 'current', label: `현재 지문 (${words.filter((w) => w.passageId === currentPassage.id).length})` },
                { id: 'learning', label: `학습 중 (${words.length - memorizedCount})` },
                { id: 'memorized', label: `암기 완료 (${memorizedCount})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                    filter === f.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Import Current Passage Vocab Banner */}
          <div className="p-3 bg-red-50/80 border border-red-200 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">💡</span>
              <div>
                <span className="font-bold text-slate-900">
                  현재 지문 [{currentPassage.titleKo}] 필수 단어 ({currentPassage.vocabulary.length}개)
                </span>
                <p className="text-[11px] text-slate-500">
                  아직 단어장에 없는 지문 필수 단어들을 한 번에 보관함에 추가합니다.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                currentPassage.vocabulary.forEach((v) => {
                  saveWord({
                    word: v.word,
                    phonetic: v.phonetic,
                    meaningKo: v.meaningKo,
                    partOfSpeech: v.partOfSpeech,
                    exampleEn: v.exampleEn,
                    exampleKo: v.exampleKo,
                    passageId: currentPassage.id,
                    passageTitle: currentPassage.titleKo || currentPassage.title,
                  });
                });
                loadWords();
                onWordListChanged();
                confetti({ particleCount: 50, spread: 60 });
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              + 현재 지문 단어 전체 추가
            </button>
          </div>

          {/* Word Table / Cards */}
          {filteredWords.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs space-y-3">
              <HappyMascot expression="thinking" size="md" className="justify-center" />
              <div>
                <p className="font-bold text-slate-600">해당 조건에 맞는 단어가 없습니다.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">지문에서 단어를 탭하거나 직접 단어를 추가해보세요! 🌟</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredWords.map((w) => (
                <div
                  key={w.id}
                  className="py-3 first:pt-0 flex items-start justify-between gap-4 group hover:bg-slate-50/70 p-2.5 rounded-xl transition-colors"
                >
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleSpeak(w.word)}
                        className="text-slate-500 hover:text-blue-600 bg-slate-100 p-1 rounded-md transition-colors cursor-pointer"
                        title="원어민 발음 듣기"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <h4 className="text-base font-bold text-slate-900 font-serif tracking-wide">
                        {w.word}
                      </h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                        {w.partOfSpeech}
                      </span>
                      {w.phonetic && (
                        <span className="text-xs text-slate-400 font-mono">{w.phonetic}</span>
                      )}
                      <span className="text-[11px] text-slate-400">· {w.passageTitle}</span>
                    </div>

                    <p className="text-sm font-bold text-blue-700 font-sans">
                      {w.meaningKo}
                    </p>

                    {w.exampleEn && (
                      <div className="text-xs text-slate-500 space-y-0.5 pt-0.5">
                        <p className="font-serif italic text-slate-700">"{w.exampleEn}"</p>
                        {w.exampleKo && <p className="text-slate-400 font-medium">{w.exampleKo}</p>}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleStatus(w.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        w.status === 'memorized'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{w.status === 'memorized' ? '암기 완료' : '학습 중'}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(w.id)}
                      className="p-1 text-slate-300 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                      title="단어 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. MODE: FLASHCARD VIEW - Cool Tone */}
      {viewMode === 'flashcard' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-xl mx-auto space-y-5">
          {words.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">단어장에 단어가 없습니다.</p>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-bold">
                  카드 {cardIdx + 1} / {words.length}
                </span>
                <span className="text-slate-400">카드를 탭하면 뒤집혀요</span>
              </div>

              {/* Card Body - Cool Slate */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="min-h-[240px] p-8 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center text-center cursor-pointer shadow-md border border-slate-800 transition-all hover:bg-slate-850"
              >
                {!isFlipped ? (
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-md">
                      {words[cardIdx].partOfSpeech}
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-bold font-serif tracking-wide text-white">
                      {words[cardIdx].word}
                    </h3>
                    {words[cardIdx].phonetic && (
                      <p className="text-sm font-mono text-slate-400">{words[cardIdx].phonetic}</p>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(words[cardIdx].word);
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> 발음 듣기
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-md">우리말 뜻</span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-sky-400">
                      {words[cardIdx].meaningKo}
                    </h3>
                    {words[cardIdx].exampleEn && (
                      <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-1">
                        <p className="font-serif italic text-slate-200 text-sm">
                          "{words[cardIdx].exampleEn}"
                        </p>
                        {words[cardIdx].exampleKo && (
                          <p className="text-slate-400">{words[cardIdx].exampleKo}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions & Pagination */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIdx((prev) => (prev > 0 ? prev - 1 : words.length - 1));
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  ◀ 이전
                </button>

                <button
                  onClick={() => handleToggleStatus(words[cardIdx].id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                    words[cardIdx].status === 'memorized'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {words[cardIdx].status === 'memorized' ? '암기 완료됨' : '외웠어요'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIdx((prev) => (prev < words.length - 1 ? prev + 1 : 0));
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  다음 ▶
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 4. MODE: QUIZ VIEW - Cool Tone */}
      {viewMode === 'quiz' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-xl mx-auto space-y-5">
          {!quizFinished ? (
            <>
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium border-b border-slate-100 pb-3">
                <span className="flex items-center gap-1 text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  문제 {quizIdx + 1} / {Math.min(words.length, 10)}
                </span>
                <span className="font-bold text-slate-700">점수: {quizScore}점</span>
              </div>

              {/* Target Word */}
              <div className="text-center py-3 space-y-1.5">
                <span className="text-xs font-medium text-slate-400">
                  다음 영어 단어의 올바른 뜻은 무엇일까요?
                </span>
                <h3 className="text-3xl font-bold text-slate-900 font-serif tracking-wide">
                  {words[quizIdx]?.word}
                </h3>
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {words[quizIdx]?.phonetic} · {words[quizIdx]?.partOfSpeech}
                </span>
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-1 gap-2">
                {quizOptions.map((opt, i) => {
                  const isSelected = quizSelectedOption === opt;
                  const isCorrect = opt === words[quizIdx]?.meaningKo;

                  let optClass = 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800';
                  if (quizSelectedOption !== null) {
                    if (isCorrect) {
                      optClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-400';
                    } else if (isSelected && !isCorrect) {
                      optClass = 'bg-rose-50 border-rose-400 text-rose-950 font-medium';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={quizSelectedOption !== null}
                      onClick={() => handleSelectQuizOption(opt)}
                      className={`p-3.5 rounded-xl border text-sm text-left transition-all cursor-pointer font-medium ${optClass}`}
                    >
                      <span className="font-bold text-xs mr-2 text-blue-600">{i + 1}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Quiz Result Screen */
            <div className="text-center py-6 space-y-4">
              <HappyMascot
                expression={quizScore >= Math.min(words.length, 10) * 0.7 ? 'proud' : 'studying'}
                size="lg"
                speechText={quizScore >= Math.min(words.length, 10) * 0.7 ? '대단해! 어휘 마스터 인정! 🌟✨' : '조금만 더 복습하면 완벽해! 🌟'}
                className="justify-center"
              />
              <h3 className="text-lg font-bold text-slate-900">어휘 퀴즈 완료! 💮</h3>
              <p className="text-sm text-slate-600 font-medium">
                총 {Math.min(words.length, 10)}문제 중{' '}
                <span className="text-blue-600 font-bold text-lg">{quizScore}개</span> 정답을
                맞혔습니다! 👏
              </p>

              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={startQuiz}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  다시 풀기
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="px-4 py-2 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  단어 목록으로
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Add Word Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">✍️</span>
              <h3 className="text-base font-bold text-slate-900">새 단어 추가하기</h3>
            </div>

            <form onSubmit={handleAddManualWord} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">영어 단어 *</label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="예: resilience"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">우리말 뜻 *</label>
                <input
                  type="text"
                  required
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="예: 회복탄력성, 복원력"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">품사</label>
                <select
                  value={newPos}
                  onChange={(e) => setNewPos(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="n.">명사 (n.)</option>
                  <option value="v.">동사 (v.)</option>
                  <option value="adj.">형용사 (adj.)</option>
                  <option value="adv.">부사 (adv.)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">예문 (선택)</label>
                <input
                  type="text"
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="예: Emotional resilience helps overcome stress."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
