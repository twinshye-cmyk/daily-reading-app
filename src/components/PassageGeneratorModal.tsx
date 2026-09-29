import React, { useState } from 'react';
import { Passage, CategoryType, GradeType, DifficultyType } from '../types';
import { 
  Sparkles, 
  X, 
  Lightbulb, 
  AlertCircle, 
  Loader2,
  GraduationCap,
  Sliders,
  Check
} from 'lucide-react';

interface PassageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPassageGenerated: (passage: Passage) => void;
}

const PRESET_TOPICS = [
  '양자역학과 암호화 통신의 미래 (Quantum Cryptography)',
  '행동경제학의 넛지(Nudge)와 현대 의사결정',
  '생성형 AI와 저작권 및 인간 창의성의 경계',
  '미세플라스틱과 해양 먹이사슬 생체 농축',
  '언어 결정론: 사용하는 언어가 사고방식을 바꾸는가?',
  '우주 망원경 제임스 웹이 밝혀낸 초기 우주의 비밀',
  '뇌 가소성과 다국어 학습의 시냅스 변화',
  '음악 치료가 신경퇴행성 질환 환자의 기억 복원에 미치는 영향',
];

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

const DIFFICULTIES: DifficultyType[] = [
  '기초 (Easy)',
  '기본 (Standard)',
  '실전 (Hard)',
  '킬러/1등급 (Killer)',
];

const QUESTION_TYPES = [
  '빈칸추론',
  '주제·제목 파악',
  '문맥상 낱말의 쓰임',
  '글의 순서 배열',
  '문장 삽입',
  '어법성 판단',
  '함축의미 추론',
];

export const PassageGeneratorModal: React.FC<PassageGeneratorModalProps> = ({
  isOpen,
  onClose,
  onPassageGenerated,
}) => {
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState<GradeType>('고3/수능');
  const [difficulty, setDifficulty] = useState<DifficultyType>('실전 (Hard)');
  const [category, setCategory] = useState<CategoryType>('science');
  const [questionType, setQuestionType] = useState('빈칸추론');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('학습하고 싶은 주제나 교양 키워드를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    const levelStr = `${grade} ${difficulty}`;

    try {
      const res = await fetch('/api/generate-passage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          grade,
          difficulty,
          level: levelStr,
          category,
          questionType,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || '지문 생성에 실패했습니다.');
      }

      onPassageGenerated(data.passage);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'AI 지문 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-2.5 sm:p-4 pt-8 sm:pt-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[88vh] sm:max-h-[90vh] my-auto shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in duration-150">
        
        {/* Header */}
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-red-600 text-white rounded-xl flex items-center justify-center text-base sm:text-lg shrink-0">
              🪄
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">AI 맞춤 영어 독해 지문 제작</h2>
                <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded-md font-bold border border-red-200 shrink-0">
                  Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                학습자의 학년과 난이도에 꼭 맞춘 수능형 독해 지문과 문제가 생성됩니다
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <span>닫기</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Topic Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              지문 주제 또는 학술 교양 키워드 <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                if (error) setError(null);
              }}
              placeholder="예: 뇌과학과 기억력, 양자 컴퓨터, 행동경제학 넛지, 기후변화..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white font-medium placeholder:text-slate-400"
              disabled={loading}
            />

            {/* Topic recommendation chips */}
            <div className="mt-2">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                추천 학술 교양 주제:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_TOPICS.slice(0, 4).map((pt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTopic(pt)}
                    className="text-[11px] font-medium px-2 py-0.8 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 border border-slate-200 cursor-pointer transition-colors"
                  >
                    {pt.length > 20 ? pt.substring(0, 20) + '...' : pt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grade Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-red-600" />
              <span>대상 학년 선택</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {GRADES.map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`px-2 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    grade === g
                      ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-red-600" />
              <span>지문 및 어휘 난이도</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {DIFFICULTIES.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-2 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    difficulty === d
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Category & Question Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                학술 분야
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                disabled={loading}
              >
                <option value="science">🔬 과학 · 생명과학</option>
                <option value="tech">💻 AI · 미래 기술</option>
                <option value="economy">📈 경제 · 비즈니스</option>
                <option value="psychology">🧠 심리학 · 뇌인지</option>
                <option value="humanities">📚 인문 · 역사 · 철학</option>
                <option value="art">🎨 예술 · 건축 · 미학</option>
                <option value="social">🌐 사회 · 환경 이슈</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                수능 출제 문항 유형
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                disabled={loading}
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-bold hidden sm:block">
            ✨ {grade} · {difficulty} 맞춤 지문 패키지
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>AI 맞춤 제작 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>지문 패키지 생성</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
