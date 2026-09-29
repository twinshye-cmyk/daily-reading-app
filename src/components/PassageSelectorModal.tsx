import React, { useState } from 'react';
import { Passage, CategoryType, UserProfile } from '../types';
import { 
  X, 
  Search, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  FileText,
  Filter,
  GraduationCap,
  Award
} from 'lucide-react';
import { getRecommendedPassagesForLearner } from '../data/passages';

interface PassageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  passages: Passage[];
  currentPassageId: string;
  onSelectPassage: (passage: Passage) => void;
  onOpenGenerator: () => void;
  activeProfile?: UserProfile;
}

export const PassageSelectorModal: React.FC<PassageSelectorModalProps> = ({
  isOpen,
  onClose,
  passages,
  currentPassageId,
  onSelectPassage,
  onOpenGenerator,
  activeProfile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  if (!isOpen) return null;

  const recommendations = getRecommendedPassagesForLearner(activeProfile, passages);

  const categories = [
    { id: 'all', label: '전체 분야' },
    { id: 'science', label: '과학·생명' },
    { id: 'tech', label: '인공지능·기술' },
    { id: 'economy', label: '경제·경영' },
    { id: 'psychology', label: '심리학·행동' },
    { id: 'art', label: '예술·건축' },
    { id: 'humanities', label: '인문·철학' },
  ];

  const gradeOptions = [
    { id: 'all', label: '전체 학년' },
    { id: '초등', label: '초등 고학년' },
    { id: '중', label: '중학교 (1~3학년)' },
    { id: '고1', label: '고1' },
    { id: '고2', label: '고2' },
    { id: '고3', label: '고3 / 수능' },
  ];

  const difficultyOptions = [
    { id: 'all', label: '전체 난이도' },
    { id: '기초', label: '기초 (Easy)' },
    { id: '실력', label: '기본/실력 (Standard)' },
    { id: '실전', label: '실전 (Hard)' },
    { id: '킬러', label: '킬러/1등급 (Killer)' },
  ];

  const filteredPassages = passages.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.titleKo.includes(searchTerm) ||
      p.backgroundKnowledge.includes(searchTerm);
    
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    
    const matchesGrade = 
      selectedGrade === 'all' || 
      p.level.includes(selectedGrade) ||
      (selectedGrade === '초등' && (p.level.includes('초등') || p.level.includes('기초'))) ||
      (selectedGrade === '중' && (p.level.includes('중') || p.level.includes('기초'))) ||
      (selectedGrade === '고3' && (p.level.includes('고3') || p.level.includes('수능')));
    
    const matchesDifficulty =
      selectedDifficulty === 'all' ||
      p.level.includes(selectedDifficulty) ||
      (selectedDifficulty === '기초' && (p.level.includes('기초') || p.level.includes('초등'))) ||
      (selectedDifficulty === '실력' && (p.level.includes('실력') || p.level.includes('기본'))) ||
      (selectedDifficulty === '실전' && p.level.includes('실전')) ||
      (selectedDifficulty === '킬러' && (p.level.includes('킬러') || p.level.includes('고난도')));

    return matchesSearch && matchesCategory && matchesGrade && matchesDifficulty;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-2.5 sm:p-4 pt-8 sm:pt-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[88vh] sm:max-h-[90vh] my-auto shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in duration-150">
        
        {/* Header */}
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-red-600 text-white rounded-xl flex items-center justify-center text-base sm:text-lg shrink-0 shadow-xs">
              🕸️
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">지문 목록 & 맞춤 선택</h2>
                <span className="text-[10px] bg-red-600/30 text-red-200 px-2 py-0.5 rounded-md font-bold border border-red-500/40 shrink-0">
                  {passages.length}편 수록
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium hidden sm:block">
                {activeProfile ? `${activeProfile.name} 님의 수준과 학년에 최적화된 독해 지문` : '학년과 난이도, 분야별로 원하는 독해 지문을 선택하세요'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-2.5 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <span>닫기</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Learner Personalized Spotlight Recommendation Box */}
        {recommendations.recommendedPassages.length > 0 && (
          <div className="bg-red-50/70 border-b border-red-200/80 p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🎯</span>
                <span className="text-xs font-black text-red-950">
                  {activeProfile?.name ? `${activeProfile.name} 님 맞춤 추천` : '추천 지문'}
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-red-600 text-white rounded-full font-bold">
                  {recommendations.badgeLabel}
                </span>
              </div>
              <span className="text-[11px] text-red-700 font-medium hidden sm:inline">
                {recommendations.reason}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {recommendations.recommendedPassages.map((rp) => {
                const isCurrent = rp.id === currentPassageId;
                return (
                  <div
                    key={rp.id}
                    onClick={() => {
                      onSelectPassage(rp);
                      onClose();
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-white border-red-500 ring-2 ring-red-300 shadow-xs'
                        : 'bg-white hover:bg-red-100/50 border-red-200 hover:border-red-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-50 text-red-700 border border-red-200">
                          {rp.level}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] font-bold text-red-600 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> 학습중
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 font-serif">
                        {rp.title}
                      </h4>
                      <p className="text-[11px] font-bold text-slate-600 line-clamp-1">
                        {rp.titleKo}
                      </p>
                    </div>
                    <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                      <span>⏱️ {rp.readTimeMinutes}분</span>
                      <span className="text-red-600 font-bold">선택 →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-white space-y-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="영어 제목, 한글 주제, 배경지식 키워드로 검색..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white font-medium"
            />
          </div>

          {/* Grade & Difficulty Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* Grade Filter */}
            <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 px-1 shrink-0 flex items-center gap-0.5">
                <GraduationCap className="w-3 h-3 text-red-600" /> 학년:
              </span>
              <div className="flex items-center gap-1 overflow-x-auto">
                {gradeOptions.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGrade(g.id)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedGrade === g.id
                        ? 'bg-red-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 px-1 shrink-0 flex items-center gap-0.5">
                <Filter className="w-3 h-3 text-red-600" /> 난이도:
              </span>
              <div className="flex items-center gap-1 overflow-x-auto">
                {difficultyOptions.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDifficulty(d.id)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedDifficulty === d.id
                        ? 'bg-red-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Categories Tab */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 max-w-full text-xs">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* List of Passages */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 divide-y divide-slate-100 space-y-2.5">
          {filteredPassages.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm font-bold text-slate-700">일치하는 지문이 없습니다.</p>
              <p className="text-xs text-slate-400 mt-1">다른 학년/난이도 필터를 선택하거나 AI 맞춤 지문을 생성해보세요.</p>
              <button
                onClick={() => {
                  onClose();
                  onOpenGenerator();
                }}
                className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-all shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI 지문 생성하기</span>
              </button>
            </div>
          ) : (
            filteredPassages.map((p) => {
              const isCurrent = p.id === currentPassageId;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectPassage(p);
                    onClose();
                  }}
                  className={`pt-3 first:pt-0 p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-red-50/60 border-red-300 ring-1 ring-red-200'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200">
                          {p.level}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {p.source}
                        </span>
                        {p.isCustomAi && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 flex items-center gap-1 border border-sky-200">
                            <Sparkles className="w-3 h-3" />
                            AI 맞춤
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm font-serif group-hover:text-red-600 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-600">{p.titleKo}</p>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                        {p.backgroundKnowledge}
                      </p>

                      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 font-medium">
                        <span>📄 {p.wordCount}단어</span>
                        <span>⏱️ 약 {p.readTimeMinutes}분</span>
                        <span>📚 어휘 {p.vocabulary.length}개</span>
                      </div>
                    </div>

                    {isCurrent && (
                      <div className="shrink-0 flex items-center gap-1 text-xs text-red-600 font-bold bg-white px-2 py-1 rounded-lg border border-red-200 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>학습중</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenGenerator();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>원하는 주제로 AI 맞춤 지문 만들기</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};

