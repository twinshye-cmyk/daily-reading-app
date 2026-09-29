import React, { useState, useEffect } from 'react';
import { SentenceAnalysisResult } from '../types';
import { 
  X, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  Lightbulb
} from 'lucide-react';

interface SentenceAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  sentence: string;
  context?: string;
}

export const SentenceAnalysisModal: React.FC<SentenceAnalysisModalProps> = ({
  isOpen,
  onClose,
  sentence,
  context,
}) => {
  const [analysis, setAnalysis] = useState<SentenceAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && sentence) {
      fetchAnalysis();
    } else {
      setAnalysis(null);
      setError(null);
    }
  }, [isOpen, sentence]);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence, context }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || '구문 분석에 실패했습니다.');
      }
      setAnalysis(data.analysis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '문장 구조 분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-2.5 sm:p-4 pt-8 sm:pt-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] sm:max-h-[90vh] my-auto shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in duration-150">
        
        {/* Header */}
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center text-base sm:text-lg shrink-0">
              🔍
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">AI 심층 구문 분석</h3>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold border border-blue-200 shrink-0">
                  Syntax Breakdown
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">수능 영어 1등급을 위한 문장 성분 및 어법 분석</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <span>닫기</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Target Sentence Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-blue-700 block mb-1">
              분석 대상 문장
            </span>
            <p className="text-sm font-medium text-slate-900 leading-relaxed font-serif">
              "{sentence}"
            </p>
          </div>

          {loading && (
            <div className="py-10 text-center space-y-2">
              <Loader2 className="w-7 h-7 text-blue-600 animate-spin mx-auto" />
              <p className="text-xs font-medium text-slate-600">
                문장 성분과 수능 어법 포인트를 분석하고 있습니다...
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={fetchAnalysis}
                className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg text-xs hover:bg-rose-700 cursor-pointer"
              >
                다시 시도
              </button>
            </div>
          )}

          {analysis && !loading && (
            <div className="space-y-4">
              {/* 1. Natural Translation */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-1">우리말 자연스러운 번역</span>
                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                  {analysis.koreanTranslation}
                </p>
              </div>

              {/* 2. Grammatical Structure */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  문장 성분 분해
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-bold text-blue-700 block mb-0.5">[주어부 (Subject)]</span>
                    <span className="text-slate-800 font-medium">{analysis.subject}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-bold text-blue-700 block mb-0.5">[서술어/목적어부 (Verb & Object)]</span>
                    <span className="text-slate-800 font-medium">{analysis.predicate}</span>
                  </div>
                </div>

                {analysis.modifiers && analysis.modifiers.length > 0 && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block mb-0.5">[수식어구 (Modifiers / Clauses)]</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600 font-medium">
                      {analysis.modifiers.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 3. Chunk-by-chunk translation */}
              {analysis.chunks && analysis.chunks.length > 0 && (
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <span className="text-xs font-bold text-slate-900 block mb-2.5">
                    ✂️ 끊어읽기 직독직해
                  </span>
                  <div className="space-y-1.5">
                    {analysis.chunks.map((chk, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 gap-1 font-medium">
                        <span className="font-bold text-slate-900 font-mono">{chk.en}</span>
                        <span className="text-slate-600 font-medium">➔ {chk.ko}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Core Grammar & Study Tip */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs space-y-1.5">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span>수능 핵심 어법 포인트</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {analysis.grammarPoint}
                </p>
                <div className="pt-2 border-t border-blue-200 text-slate-700 font-medium">
                  <span className="font-bold text-blue-900">독해 팁:</span> {analysis.studyTip}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
