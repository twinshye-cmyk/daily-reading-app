import React, { useState, useEffect } from 'react';
import { Passage, Question } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  HelpCircle, 
  Lightbulb, 
  Sparkles, 
  RotateCcw, 
  Send, 
  Loader2, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveStudyRecord } from '../utils/storage';
import { HappyMascot } from './HappyMascot';

interface PracticeViewProps {
  passage: Passage;
  onGoToHome?: () => void;
  onGoToVocab: () => void;
  onStudyCompleted: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  passage,
  onGoToHome,
  onGoToVocab,
  onStudyCompleted,
}) => {
  const question = passage.questions[0] || null;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // AI Tutor chat state
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorChatMessages, setTutorChatMessages] = useState<Array<{ sender: 'user' | 'tutor'; text: string }>>([]);
  const [isTutorLoading, setIsTutorLoading] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setTutorChatMessages([]);
  }, [passage.id]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !isSubmitted) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isSubmitted]);

  if (!question) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-700">이 지문에는 등록된 문제가 없습니다.</p>
      </div>
    );
  }

  const isCorrect = selectedOption === question.correctAnswer;

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    setIsTimerRunning(false);

    if (isCorrect) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    saveStudyRecord({
      date: new Date().toISOString().split('T')[0],
      passageId: passage.id,
      passageTitle: passage.titleKo,
      category: passage.category,
      level: passage.level,
      score: isCorrect ? 100 : 0,
      correctAnswers: isCorrect ? 1 : 0,
      totalQuestions: 1,
      timeSpentSeconds: timerSeconds,
      memorizedWords: passage.vocabulary.length,
    });

    onStudyCompleted();
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuery.trim() || isTutorLoading) return;

    const query = tutorQuery.trim();
    setTutorQuery('');
    setTutorChatMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setIsTutorLoading(true);

    try {
      const res = await fetch('/api/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          passageText: passage.paragraphs.map((p) => p.textEn).join('\n\n'),
          studentQuery: query,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || '답변을 불러오지 못했습니다.');
      }

      setTutorChatMessages((prev) => [...prev, { sender: 'tutor', text: data.reply }]);
    } catch (err: any) {
      setTutorChatMessages((prev) => [
        ...prev,
        { sender: 'tutor', text: '오류가 발생했습니다. 잠시 후 다시 질문해주세요.' },
      ]);
    } finally {
      setIsTutorLoading(false);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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

      {/* 1. Header with Question Type & Timer - Cool Tone */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              🎯 수능 {question.type} 문항
            </span>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              🏷️ {passage.level}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">{passage.titleKo}</h2>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono font-medium">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>⏱️ 풀이 시간: {formatTimer(timerSeconds)}</span>
          </div>

          {isSubmitted && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>다시 풀기</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Question Stem & 5 Choices */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
        
        {/* Question Prompt */}
        <div className="space-y-1 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
            <span>❓ 문제</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif leading-snug">
            {question.questionEn}
          </h3>
          <p className="text-xs text-slate-500 font-medium">{question.questionKo}</p>
        </div>

        {/* 5-Choice Multiple Choice */}
        <div className="space-y-2.5">
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt.num;
            const isThisCorrect = opt.num === question.correctAnswer;

            let optionStyle = 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80 text-slate-800';

            if (isSubmitted) {
              if (isThisCorrect) {
                optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-400';
              } else if (isSelected && !isThisCorrect) {
                optionStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-medium';
              } else {
                optionStyle = 'bg-slate-50/40 border-slate-200 text-slate-400 opacity-60';
              }
            } else if (isSelected) {
              optionStyle = 'bg-blue-50 border-blue-500 text-blue-950 font-bold ring-1 ring-blue-400';
            }

            return (
              <label
                key={opt.num}
                onClick={() => {
                  if (!isSubmitted) setSelectedOption(opt.num);
                }}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-sm transition-all cursor-pointer ${optionStyle}`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isSubmitted
                      ? isThisCorrect
                        ? 'bg-emerald-600 text-white'
                        : isSelected
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                      : isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {isSubmitted && isThisCorrect ? '✓' : isSubmitted && isSelected ? '✕' : opt.num}
                </div>

                <span className="flex-1 leading-relaxed font-medium text-xs sm:text-sm">{opt.text}</span>
              </label>
            );
          })}
        </div>

        {/* Submit Action */}
        {!isSubmitted && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
            >
              <span>정답 제출 및 해설 확인</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* 3. Detailed Explanation & Trap Analysis Card */}
      {isSubmitted && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          {/* Result Banner with Tangerine Mascot */}
          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs ${
              isCorrect
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-slate-100 border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <HappyMascot
                expression={isCorrect ? 'cheer' : 'thinking'}
                size="md"
                showSpeech={false}
                interactive={false}
              />
              <div>
                <h4 className="text-base font-bold">
                  {isCorrect ? '정답입니다! 해피가 칭찬해요! 🕷️✨' : '아쉽지만 괜찮아요! 해설을 확인해봐요! 🕷️'}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  정답: <span className="text-blue-600 font-bold">{question.correctAnswer}번</span> · 풀이 시간: {formatTimer(timerSeconds)}
                </p>
              </div>
            </div>

            <button
              onClick={onGoToVocab}
              className="w-full sm:w-auto px-4 py-2.5 bg-white text-blue-600 font-bold rounded-xl text-xs shadow-2xs border border-slate-200 hover:bg-blue-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>단어장 학습하러 가기</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Explanation Breakdown */}
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <span>🎓</span>
              <span>수능 출제 의도 및 정답 해설</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              <p>{question.explanation}</p>
            </div>

            {/* Trap Tip */}
            {question.tip && (
              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 text-xs text-slate-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-blue-900">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span>수능 1등급 함정 탈출 팁</span>
                </div>
                <p className="leading-relaxed font-medium text-slate-700">{question.tip}</p>
              </div>
            )}

            {/* AI Tutor Chat Section - Cool Slate Tone */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🕷️</span>
                <span className="text-xs font-bold text-slate-900">
                  해피 AI 1:1 수능 튜터
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold">
                  24시 실시간 답변
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                특정 선지가 왜 오답인지, 어떤 문장이 핵심 단서였는지 해피에게 질문해보세요!
              </p>

              {/* Chat history */}
              {tutorChatMessages.length > 0 && (
                <div className="space-y-2.5 max-h-60 overflow-y-auto p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  {tutorChatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] font-bold text-slate-400 mb-0.5">
                        {msg.sender === 'user' ? '👧 나의 질문' : '🕷️ 해피 튜터'}
                      </span>
                      <div
                        className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-medium shadow-2xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTutorLoading && (
                    <div className="flex items-center gap-2 text-blue-600 text-xs font-bold py-1">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>해피 튜터가 해설을 정리하고 있어요... 🕷️</span>
                    </div>
                  )}
                </div>
              )}

              {/* Chat Input */}
              <form onSubmit={handleAskTutor} className="flex gap-2">
                <input
                  type="text"
                  value={tutorQuery}
                  onChange={(e) => setTutorQuery(e.target.value)}
                  placeholder="예: 3번 선지가 매력적인 오답인 이유가 뭔가요?"
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                  disabled={isTutorLoading}
                />
                <button
                  type="submit"
                  disabled={isTutorLoading || !tutorQuery.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>질문</span>
                </button>
              </form>
            </div>

            {/* Next Step 3: Vocabulary Study Banner */}
            <div className="p-5 rounded-2xl bg-linear-to-r from-red-600 to-rose-700 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md text-white inline-block">
                    STEP 3 📚
                  </span>
                  <span className="text-xs text-red-100 font-bold">지문 필수 단어 완벽 마스터</span>
                </div>
                <h4 className="text-base font-black">
                  문제 풀이를 마쳤다면 지문의 핵심 어휘를 복습해보세요!
                </h4>
                <p className="text-xs text-red-100 font-medium">
                  플래시카드 암기, 30초 단어 퀴즈 및 발음 연속 듣기를 제공합니다.
                </p>
              </div>

              <button
                onClick={onGoToVocab}
                className="px-5 py-2.5 bg-white hover:bg-red-50 text-red-600 font-black rounded-xl text-xs transition-all shadow-xs shrink-0 flex items-center gap-1.5 hover:scale-102 cursor-pointer"
              >
                <span>단어장 / 어휘 학습 탭으로 이동</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
