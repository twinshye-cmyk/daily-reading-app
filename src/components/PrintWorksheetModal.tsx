import React, { useState, useEffect, useRef } from 'react';
import { Passage, PrintSettings, UserProfile } from '../types';
import { 
  Printer, 
  X, 
  Download, 
  Copy, 
  Check,
  FileText,
  User,
  Calendar,
  Sparkles,
  FileType,
  BookOpen,
  HelpCircle,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { generateWorksheetHtml } from '../utils/printWorksheet';

interface PrintWorksheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  passage: Passage;
  activeProfile?: UserProfile;
}

export const PrintWorksheetModal: React.FC<PrintWorksheetModalProps> = ({
  isOpen,
  onClose,
  passage,
  activeProfile,
}) => {
  const getInitialStudentName = () => {
    if (activeProfile?.name && activeProfile.name !== '열공마미') {
      return activeProfile.name;
    }
    return '수험생';
  };

  const [settings, setSettings] = useState<PrintSettings>({
    includeHeader: true,
    studentName: getInitialStudentName(),
    studyDate: new Date().toISOString().split('T')[0],
    includeBackground: true,
    includePassage: true,
    includeQuestions: true,
    includeVocabList: true,
    includeVocabQuiz: true,
    includeAnswerKey: true,
    includeFullTranslation: true,
    includeWritingTask: true,
    fontSize: 'base',
    layoutType: 'all-in-one', // Default to 2-part separated layout
  });

  const [copiedHwp, setCopiedHwp] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Sync active profile name whenever modal opens or profile changes
  useEffect(() => {
    if (isOpen && activeProfile?.name) {
      const studentName = activeProfile.name === '열공마미' ? '수험생' : activeProfile.name;
      setSettings((prev) => ({
        ...prev,
        studentName: studentName,
      }));
    }
  }, [isOpen, activeProfile?.id, activeProfile?.name]);

  if (!isOpen || !passage) return null;

  const q = passage.questions && passage.questions.length > 0 ? passage.questions[0] : null;

  // Extract all grammar notes from paragraphs
  const grammarPoints: Array<{ sentenceEn: string; tip: string }> = [];
  passage.paragraphs.forEach((p) => {
    p.sentenceBreakdown?.forEach((s) => {
      if (s.grammarTip) {
        grammarPoints.push({
          sentenceEn: s.sentenceEn,
          tip: s.grammarTip,
        });
      }
    });
  });

  // 1. Direct Print Handler (Uses robust iframe or new window)
  const handlePrint = () => {
    try {
      const htmlContent = generateWorksheetHtml(passage, {
        studentName: settings.studentName,
        studyDate: settings.studyDate,
        includeBackground: settings.includeBackground,
        includePassage: settings.includePassage,
        includeQuestions: settings.includeQuestions,
        includeWritingTask: settings.includeWritingTask,
        includeVocabList: settings.includeVocabList,
        layoutType: settings.layoutType,
      });
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);

      let printWindow: Window | null = null;
      try {
        printWindow = window.open(blobUrl, '_blank');
      } catch (err) {
        console.warn('window.open blocked:', err);
      }

      if (!printWindow) {
        let printFrame = document.getElementById('a4-worksheet-print-iframe') as HTMLIFrameElement;
        if (!printFrame) {
          printFrame = document.createElement('iframe');
          printFrame.id = 'a4-worksheet-print-iframe';
          printFrame.style.position = 'fixed';
          printFrame.style.right = '0';
          printFrame.style.bottom = '0';
          printFrame.style.width = '0';
          printFrame.style.height = '0';
          printFrame.style.border = '0';
          document.body.appendChild(printFrame);
        }

        const doc = printFrame.contentWindow?.document || printFrame.contentDocument;
        if (doc) {
          doc.open();
          doc.write(htmlContent);
          doc.close();
          setTimeout(() => {
            printFrame.contentWindow?.focus();
            printFrame.contentWindow?.print();
          }, 250);
        } else {
          window.print();
        }
      }
    } catch (e) {
      console.error('Print trigger fallback:', e);
      window.print();
    }
  };

  // 2. Download Standalone HTML File
  const handleDownloadHtml = () => {
    const htmlContent = generateWorksheetHtml(passage, {
      studentName: settings.studentName,
      studyDate: settings.studyDate,
      includeBackground: settings.includeBackground,
      includePassage: settings.includePassage,
      includeQuestions: settings.includeQuestions,
      includeWritingTask: settings.includeWritingTask,
      includeVocabList: settings.includeVocabList,
      layoutType: settings.layoutType,
    });
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `하루한장_수능영어_${settings.studentName}_${passage.titleKo}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess('HTML 저장 완료');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // 3. Export Clean Text for HWP (한글) / Word
  const handleCopyHwp = () => {
    let text = `=======================================================\n`;
    text += `[일일 수능 영어 독해 워크시트] - ${passage.titleKo}\n`;
    text += `영문 제목: ${passage.title}\n`;
    text += `학습자: ${settings.studentName} | 학습일: ${settings.studyDate} | 수준: ${passage.level} | 채점: [      / 3점]\n`;
    text += `=======================================================\n\n`;

    if (settings.includeBackground) {
      text += `[1. 배경지식 1분 브리핑]\n${passage.backgroundKnowledge}\n\n`;
    }

    if (settings.includePassage) {
      text += `[2. 영어 본문 지문]\n`;
      if (passage.paragraphs.length === 1) {
        text += `${passage.paragraphs[0].textEn}\n\n`;
      } else {
        passage.paragraphs.forEach((p) => {
          text += `${p.textEn}\n\n`;
        });
      }
    }

    if (settings.includeQuestions && q) {
      text += `[3. 수능 실전 문항 · ${q.type}] [3점]\n`;
      text += `Q. ${q.questionEn}\n`;
      q.options.forEach((opt) => {
        text += `${'①②③④⑤'.charAt(opt.num - 1)} ${opt.text}\n`;
      });
      text += `\n`;
    }

    if (settings.includeWritingTask) {
      text += `[4. 1문장 서술형 요약 과제]\n`;
      text += `Prompt: ${passage.writingOrSummaryTask.prompt}\n`;
      text += `답안 작성: ____________________________________________________\n\n`;
    }

    text += `\n=======================================================\n`;
    text += `[정답 및 심층 해설지 (어휘 · 구문 · 문법 · 해설)]\n`;
    text += `=======================================================\n\n`;

    if (q) {
      text += `[1. 문항 정답 및 해설]\n`;
      text += `정답: ${q.correctAnswer}번\n`;
      text += `해설: ${q.explanation}\n`;
      if (q.tip) text += `수능 팁: ${q.tip}\n`;
      text += `요약 모범 답안: ${passage.writingOrSummaryTask.modelAnswer}\n\n`;
    }

    text += `[2. 지문 전문 우리말 해석]\n`;
    passage.paragraphs.forEach((p) => {
      if (passage.paragraphs.length > 1) {
        text += `[단락 ${p.paragraphNumber}] ${p.textKo}\n\n`;
      } else {
        text += `${p.textKo}\n\n`;
      }
    });

    text += `[3. 구문 분석 및 직독직해]\n`;
    passage.paragraphs.forEach((p) => {
      p.sentenceBreakdown?.forEach((s, idx) => {
        text += `문장 ${idx + 1}: ${s.sentenceEn}\n`;
        if (s.chunks) {
          text += `직독직해: ` + s.chunks.map(c => `[${c.chunkEn} - ${c.chunkKo}]`).join(' / ') + `\n`;
        }
        if (s.grammarTip) {
          text += `구문 팁: ${s.grammarTip}\n`;
        }
        text += `\n`;
      });
    });

    text += `[4. 핵심 어휘 정리]\n`;
    passage.vocabulary.forEach((v, idx) => {
      text += `${idx + 1}. ${v.word} (${v.partOfSpeech}) : ${v.meaningKo}\n   예문: ${v.exampleEn}\n   해석: ${v.exampleKo}\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
      setCopiedHwp(true);
      setTimeout(() => setCopiedHwp(false), 3000);
    });
  };

  const handleDownloadHwpText = () => {
    let text = `=======================================================\n`;
    text += `[일일 수능 영어 독해 워크시트] - ${passage.titleKo}\n`;
    text += `영문 제목: ${passage.title}\n`;
    text += `학습자: ${settings.studentName} | 학습일: ${settings.studyDate} | 수준: ${passage.level} | 채점: [      / 3점]\n`;
    text += `=======================================================\n\n`;

    if (settings.includeBackground) {
      text += `[1. 배경지식 1분 브리핑]\n${passage.backgroundKnowledge}\n\n`;
    }

    if (settings.includePassage) {
      text += `[2. 영어 본문 지문]\n`;
      if (passage.paragraphs.length === 1) {
        text += `${passage.paragraphs[0].textEn}\n\n`;
      } else {
        passage.paragraphs.forEach((p) => {
          text += `${p.textEn}\n\n`;
        });
      }
    }

    if (settings.includeQuestions && q) {
      text += `[3. 수능 실전 문항 · ${q.type}] [3점]\n`;
      text += `Q. ${q.questionEn}\n`;
      q.options.forEach((opt) => {
        text += `${'①②③④⑤'.charAt(opt.num - 1)} ${opt.text}\n`;
      });
      text += `\n`;
    }

    if (settings.includeWritingTask) {
      text += `[4. 1문장 서술형 요약 과제]\n`;
      text += `Prompt: ${passage.writingOrSummaryTask.prompt}\n`;
      text += `답안 작성: ____________________________________________________\n\n`;
    }

    text += `\n=======================================================\n`;
    text += `[정답 및 심층 해설지 (어휘 · 구문 · 문법 · 해설)]\n`;
    text += `=======================================================\n\n`;

    if (q) {
      text += `[1. 문항 정답 및 해설]\n`;
      text += `정답: ${q.correctAnswer}번\n`;
      text += `해설: ${q.explanation}\n`;
      if (q.tip) text += `수능 팁: ${q.tip}\n`;
      text += `요약 모범 답안: ${passage.writingOrSummaryTask.modelAnswer}\n\n`;
    }

    text += `[2. 지문 전문 우리말 해석]\n`;
    passage.paragraphs.forEach((p) => {
      if (passage.paragraphs.length > 1) {
        text += `[단락 ${p.paragraphNumber}] ${p.textKo}\n\n`;
      } else {
        text += `${p.textKo}\n\n`;
      }
    });

    text += `[3. 구문 분석 및 직독직해]\n`;
    passage.paragraphs.forEach((p) => {
      p.sentenceBreakdown?.forEach((s, idx) => {
        text += `문장 ${idx + 1}: ${s.sentenceEn}\n`;
        if (s.chunks) {
          text += `직독직해: ` + s.chunks.map(c => `[${c.chunkEn} - ${c.chunkKo}]`).join(' / ') + `\n`;
        }
        if (s.grammarTip) {
          text += `구문 팁: ${s.grammarTip}\n`;
        }
        text += `\n`;
      });
    });

    text += `[4. 핵심 어휘 정리]\n`;
    passage.vocabulary.forEach((v, idx) => {
      text += `${idx + 1}. ${v.word} (${v.partOfSpeech}) : ${v.meaningKo}\n   예문: ${v.exampleEn}\n   해석: ${v.exampleKo}\n`;
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `하루한장_수능영어_${settings.studentName}_${passage.titleKo}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess('TXT 다운로드 완료');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-5xl h-[94vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Top Header (Interactive controls) */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-black text-slate-900">수능 영어 일일 독해 인쇄 학습지</h2>
                <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-md font-black border border-red-200">
                  앞면(지문+문제 1장 완결) · 뒷면(단어/구문/문법/해설)
                </span>
                {downloadSuccess && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold animate-pulse">
                    ✓ {downloadSuccess}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {activeProfile?.name ? (
                  <span className="text-blue-700 font-bold">'{settings.studentName}'</span>
                ) : '학습자'} 이름이 자동 입력되며, 1페이지에 지문과 문제가 딱 맞게 수납됩니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Copy Button */}
            <button
              onClick={handleCopyHwp}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
              title="한글(HWP) 및 워드 붙여넣기용 텍스트 복사"
            >
              {copiedHwp ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">복사 완료</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">텍스트 복사</span>
                  <span className="sm:hidden">복사</span>
                </>
              )}
            </button>

            {/* HTML Download Button */}
            <button
              onClick={handleDownloadHtml}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer shadow-2xs"
              title="오프라인 인쇄 및 보관용 A4 완성형 HTML 파일 다운로드"
            >
              <FileType className="w-3.5 h-3.5 text-blue-600" />
              <span>HTML 저장</span>
            </button>

            {/* TXT Download Button */}
            <button
              onClick={handleDownloadHwpText}
              className="hidden sm:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
              title="텍스트 파일 (.txt) 다운로드"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>TXT 다운로드</span>
            </button>

            {/* Primary Print / PDF Button */}
            <button
              id="btn-trigger-print"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 text-xs font-black text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer"
              title="클릭 즉시 인쇄 대화상자 또는 새 창을 엽니다."
            >
              <Printer className="w-4 h-4" />
              <span>⚡ 즉시 인쇄 / PDF 저장</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Template Customizer Toolbar (Hidden when printing) */}
        <div className="p-3.5 border-b border-slate-200/80 bg-white print:hidden grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs shrink-0">
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>인쇄 서식 양식 선택</span>
            </label>
            <select
              value={settings.layoutType}
              onChange={(e) => setSettings({ ...settings, layoutType: e.target.value as any })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all-in-one">📚 [기본 추천] 앞면 지문+문제(1장) + 뒷면 단어·구문·문법·정답해설</option>
              <option value="worksheet">📄 앞면 1장 학생용 실전 문제지 (지문+문제만)</option>
              <option value="answers-only">💡 뒷면 정답 및 어휘·구문·문법 심층 해설지</option>
              <option value="vocab-only">📝 A4 1장 어휘 테스트지 (단어 쓰기 시험용)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-purple-600" />
              <span>학생 성명 (학습자 이름)</span>
            </label>
            <input
              type="text"
              value={settings.studentName}
              onChange={(e) => setSettings({ ...settings, studentName: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 김민준"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>학습 일자</span>
            </label>
            <input
              type="date"
              value={settings.studyDate}
              onChange={(e) => setSettings({ ...settings, studyDate: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {/* PRINTABLE A4 PREVIEW CONTAINER */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100 print:bg-white print:p-0 print:overflow-visible font-sans text-slate-900">
          
          <div className="max-w-[800px] mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none space-y-8">
            
            {/* ========================================================================= */}
            {/* [PAGE 1] FRONT PAGE: STUDENT WORKSHEET (지문 + 문제 1장 완결) */}
            {/* ========================================================================= */}
            {(settings.layoutType === 'all-in-one' || settings.layoutType === 'worksheet') && (
              <section className={`print-page-exact flex flex-col justify-between space-y-2.5 print:space-y-1.5 print:max-h-[270mm] print:overflow-hidden ${
                settings.layoutType === 'all-in-one' ? 'print:break-after-page' : ''
              }`}>
                
                {/* 1. Compact Header */}
                <div className="border-b-2 border-slate-900 pb-2 print:pb-1">
                  <div className="flex items-center justify-between border-b border-slate-300 pb-1 mb-1.5 text-[11px] print:text-[8.5pt]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black tracking-widest text-slate-900 uppercase">
                        [ 일일 수능 영어 독해 워크시트 ]
                      </span>
                      <span className="bg-red-50 text-red-700 px-1.5 py-0.2 rounded font-black border border-red-200 text-[10px] print:text-[7.5pt]">
                        Spider CSAT Daily
                      </span>
                    </div>
                    <span className="font-bold text-slate-700">
                      수준: {passage.level} · 영역: {passage.category.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <div className="flex-1">
                      <h1 className="text-base sm:text-lg print:text-[12.5pt] font-black text-slate-900 tracking-tight leading-snug">
                        {passage.title}
                      </h1>
                      <p className="text-xs print:text-[8.8pt] font-bold text-blue-900 mt-0.5">
                        부제: {passage.titleKo} <span className="text-slate-500 font-normal">({passage.source})</span>
                      </p>
                    </div>

                    {/* Student Info Box */}
                    <div className="border border-slate-900 rounded-md p-1.5 text-[11px] print:text-[8.2pt] space-y-0.5 min-w-[165px] bg-slate-50 shrink-0">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-600">학습일자:</span>
                        <span className="font-medium text-slate-900">{settings.studyDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-600">학생성명:</span>
                        <span className="font-black text-slate-950 text-xs print:text-[9.5pt]">{settings.studentName}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-300 pt-0.5">
                        <span className="font-bold text-slate-600">채점/성적:</span>
                        <span className="font-black text-rose-600">[ &nbsp; &nbsp; &nbsp; &nbsp; / 3점 ]</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Background Knowledge Box */}
                {settings.includeBackground && (
                  <div className="border border-slate-300 bg-slate-50/80 p-2 print:p-1.5 rounded-md text-[11px] print:text-[8.5pt] space-y-0.5">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <span>💡</span> [ 배경지식 1분 브리핑 ]
                    </span>
                    <p className="text-slate-700 leading-snug font-medium line-clamp-3 print:line-clamp-none">
                      {passage.backgroundKnowledge}
                    </p>
                  </div>
                )}

                {/* 3. English Reading Passage - CSAT Standard Format */}
                <div className="space-y-2 print:space-y-1.5 text-[13px] print:text-[9.8pt] text-slate-900 leading-[1.48] print:leading-[1.42] font-serif text-justify border-y border-slate-900 py-2.5 print:py-1.5">
                  {passage.paragraphs.map((para) => (
                    <p key={para.paragraphNumber} className="indent-3">
                      {para.textEn}
                    </p>
                  ))}
                </div>

                {/* 4. Question Section - 2-Column Options */}
                {settings.includeQuestions && q && (
                  <div className="space-y-1.5 print:space-y-0.5 pt-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] print:text-[8.5pt] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        [ 실전 수능 문항 · {q.type} ]
                      </span>
                      <span className="text-[11px] print:text-[8.5pt] text-blue-950 font-black">[3점]</span>
                    </div>

                    <p className="text-xs print:text-[9.5pt] font-black text-slate-900 leading-snug">
                      Q. {q.questionEn}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-x-4 gap-y-0.5 pl-1 text-[11.5px] print:text-[8.5pt] font-medium text-slate-800">
                      {q.options.map((opt) => (
                        <div key={opt.num} className="flex items-start gap-1.5">
                          <span className="font-black text-slate-900 shrink-0">
                            {'①②③④⑤'.charAt(opt.num - 1)}
                          </span>
                          <span className="leading-tight">{opt.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Writing / Summary Blank Box */}
                {settings.includeWritingTask && (
                  <div className="border border-slate-300 rounded-md p-2 print:p-1.5 space-y-0.5 bg-slate-50 text-[11px] print:text-[8.5pt]">
                    <div className="flex justify-between items-center font-bold text-slate-800">
                      <span>[ 1문장 서술형 요약 과제 ]</span>
                      <span className="text-[10px] print:text-[7.5pt] text-slate-500 font-normal">
                        힌트: {passage.writingOrSummaryTask.guide}
                      </span>
                    </div>
                    <p className="text-slate-700 font-serif leading-tight">
                      Prompt: {passage.writingOrSummaryTask.prompt}
                    </p>
                    <div className="h-5 print:h-3.5 border-b border-dashed border-slate-400 mt-1"></div>
                  </div>
                )}

                {/* 6. Footnote Vocab Hint */}
                <div className="pt-1.5 border-t border-slate-200 text-[10.5px] print:text-[8pt] text-slate-600 flex flex-wrap gap-x-3 gap-y-0.5 font-medium leading-tight">
                  <span className="font-bold text-slate-800">* 필수 어휘:</span>
                  {passage.vocabulary.map((v, i) => (
                    <span key={i}>
                      <b className="text-slate-900">{v.word}</b>({v.partOfSpeech}) {v.meaningKo}
                    </span>
                  ))}
                </div>

              </section>
            )}

            {/* ========================================================================= */}
            {/* [PAGE 2+] BACK PAGES: 단어, 구문해설, 문법해설, 정답과 해설 */}
            {/* ========================================================================= */}
            {(settings.layoutType === 'all-in-one' || settings.layoutType === 'answers-only') && (
              <section className={`print-page-exact space-y-5 pt-6 print:pt-4 ${
                settings.layoutType === 'all-in-one' ? 'border-t-2 border-slate-900 print:border-t-0 mt-6 print:mt-0 print:break-before-page' : ''
              }`}>
                
                {/* Back Page Header */}
                <div className="border-b-2 border-slate-900 pb-2 flex justify-between items-end">
                  <div>
                    <span className="text-xs print:text-[8.5pt] font-black tracking-widest uppercase text-blue-900">
                      [ 정답 및 심층 해설 · 분석 학습지 ]
                    </span>
                    <h2 className="text-base print:text-[12pt] font-black text-slate-900 mt-0.5">
                      {passage.titleKo} (원제: {passage.title})
                    </h2>
                  </div>
                  <span className="text-xs print:text-[8.5pt] font-bold text-slate-600">
                    학생 성명: <b className="text-slate-950">{settings.studentName}</b> · 학습일자: {settings.studyDate}
                  </span>
                </div>

                {/* 1. 수능 실전 문항 정답 및 해설 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-sm print:text-[10pt] font-black text-slate-900 border-b border-slate-200 pb-1">
                    <span>🎓</span>
                    <span>1. 수능 실전 문항 정답 및 출제 의도 / 해설</span>
                  </div>

                  {q && (
                    <div className="border border-slate-300 rounded-lg p-3 bg-slate-50 space-y-2 text-xs print:text-[8.8pt]">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-slate-900 text-white font-black rounded text-xs print:text-[8.5pt]">
                          정답: {'①②③④⑤'.charAt(q.correctAnswer - 1)} ({q.correctAnswer}번)
                        </span>
                        <span className="text-slate-500 font-bold text-[11px] print:text-[8pt]">
                          [ 배점: 3점 · 유형: {q.type} ]
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 block">[ 정답 도출 논리 및 지문 근거 ]</span>
                        <p className="text-slate-700 leading-relaxed font-medium">
                          {q.explanation}
                        </p>
                      </div>

                      {q.tip && (
                        <div className="pt-2 border-t border-slate-200 text-blue-900 font-medium text-[11px] print:text-[8.2pt]">
                          💡 <span className="font-bold">수능 1등급 함정 탈출 팁:</span> {q.tip}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 서술형 요약 모범 답안 */}
                  <div className="border border-slate-300 rounded-lg p-2.5 text-xs print:text-[8.5pt] space-y-1 bg-slate-50">
                    <span className="font-bold text-slate-900 block">[ 서술형 1문장 요약 모범 답안 ]</span>
                    <p className="text-slate-800 font-serif italic">
                      "{passage.writingOrSummaryTask.modelAnswer}"
                    </p>
                  </div>
                </div>

                {/* 2. 지문 전문 우리말 해석 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-sm print:text-[10pt] font-black text-slate-900 border-b border-slate-200 pb-1">
                    <span>📖</span>
                    <span>2. 지문 전문 우리말 직독직해 번역</span>
                  </div>
                  <div className="space-y-2 text-xs print:text-[8.5pt] leading-relaxed">
                    {passage.paragraphs.map((p) => (
                      <div key={p.paragraphNumber} className="space-y-0.5">
                        {passage.paragraphs.length > 1 && (
                          <span className="font-bold text-blue-900 mr-1.5">[단락 {p.paragraphNumber}]</span>
                        )}
                        <span className="text-slate-800 font-medium">{p.textKo}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. 구문 해설 및 직독직해 (Syntax & Chunk Breakdown Table) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-sm print:text-[10pt] font-black text-slate-900 border-b border-slate-200 pb-1">
                    <span>🔍</span>
                    <span>3. 지문 핵심 구문 분석 및 직독직해 (Syntax & Chunk Breakdown)</span>
                  </div>

                  <div className="border border-slate-300 rounded-lg overflow-hidden text-xs print:text-[8.2pt]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                          <th className="p-2 w-10 text-center">No.</th>
                          <th className="p-2 w-[48%]">영어 원문 & 의미 단위 (Chunk)</th>
                          <th className="p-2 w-[48%]">직독직해 의미 & 구문 해설</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {passage.paragraphs.flatMap((p) => p.sentenceBreakdown || []).map((s, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2 text-center font-bold text-slate-400 align-top">{idx + 1}</td>
                            <td className="p-2 align-top space-y-1">
                              <div className="font-serif font-bold text-slate-900">
                                "{s.sentenceEn}"
                              </div>
                              {s.chunks && (
                                <div className="text-[11px] print:text-[7.8pt] text-slate-500 font-sans">
                                  {s.chunks.map((c, ci) => (
                                    <span key={ci} className="bg-slate-100 px-1 py-0.5 rounded mr-1 inline-block mb-0.5">
                                      [{c.chunkEn}]
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td className="p-2 align-top space-y-1">
                              <div className="text-slate-800 font-medium">
                                {s.chunks ? s.chunks.map(c => c.chunkKo).join(' / ') : ''}
                              </div>
                              {s.grammarTip && (
                                <div className="p-1 bg-blue-50 text-blue-900 rounded text-[10.5px] print:text-[7.5pt] border border-blue-200">
                                  📌 <b>구문 팁:</b> {s.grammarTip}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 4. 핵심 어법 및 문법 포인트 해설 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-sm print:text-[10pt] font-black text-slate-900 border-b border-slate-200 pb-1">
                    <span>💡</span>
                    <span>4. 핵심 어법 및 문법 포인트 해설 (Grammar Highlights)</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-xs print:text-[8.2pt]">
                    {grammarPoints.length > 0 ? (
                      grammarPoints.map((g, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-0.5">
                          <span className="font-bold text-slate-900 block font-serif">
                            [문법 포인트 {idx + 1}] "{g.sentenceEn}"
                          </span>
                          <span className="text-blue-900 font-bold block">
                            ➔ {g.tip}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                        지문의 주요 문장 구조와 절의 연결을 직독직해 청크와 연계하여 복습하세요.
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. 핵심 어휘 심화 학습 및 테스트 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-sm print:text-[10pt] font-black text-slate-900 border-b border-slate-200 pb-1">
                    <span>📚</span>
                    <span>5. 수능 필수 어휘 심화 학습 및 테스트 (Vocabulary Drill)</span>
                  </div>

                  <div className="border border-slate-300 rounded-lg overflow-hidden text-xs print:text-[8.2pt]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                          <th className="p-2 w-8 text-center">No.</th>
                          <th className="p-2 w-28">표제어 (단어)</th>
                          <th className="p-2 w-12 text-center">품사</th>
                          <th className="p-2 w-32">우리말 뜻</th>
                          <th className="p-2">수능 실전 예문 & 해석</th>
                          <th className="p-2 w-16 text-center">암기확인</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {passage.vocabulary.map((v, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2 text-center font-bold text-slate-400">{idx + 1}</td>
                            <td className="p-2">
                              <span className="font-serif font-bold text-slate-900">{v.word}</span>
                              {v.phonetic && <span className="text-[10px] text-slate-400 block">{v.phonetic}</span>}
                            </td>
                            <td className="p-2 text-center font-mono text-slate-500 text-[11px]">{v.partOfSpeech}</td>
                            <td className="p-2 font-bold text-slate-900">{v.meaningKo}</td>
                            <td className="p-2 text-[11px] print:text-[7.8pt] space-y-0.5">
                              <div className="font-serif text-slate-900">"{v.exampleEn}"</div>
                              <div className="text-slate-500">{v.exampleKo}</div>
                            </td>
                            <td className="p-2 text-center">
                              <div className="w-4 h-4 border border-slate-300 rounded mx-auto"></div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </section>
            )}

            {/* ========================================================================= */}
            {/* [PAGE: VOCAB ONLY] IF LAYOUT IS VOCAB-ONLY */}
            {/* ========================================================================= */}
            {settings.layoutType === 'vocab-only' && (
              <section className="print-page-exact space-y-4">
                <div className="border-b-2 border-slate-900 pb-2 flex justify-between items-end">
                  <div>
                    <span className="text-xs font-bold tracking-widest uppercase text-slate-900">
                      [ 일일 수능 어휘 테스트지 ]
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-0.5">
                      {passage.title} - 핵심 필수 어휘 점검
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    성명: <b className="text-slate-950">{settings.studentName}</b> | 점수: [ &nbsp; &nbsp; / 100 ]
                  </span>
                </div>

                <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                        <th className="p-2 w-10 text-center">No.</th>
                        <th className="p-2 w-36">영어 단어</th>
                        <th className="p-2 w-14 text-center">품사</th>
                        <th className="p-2 w-48">우리말 뜻 쓰기 (테스트)</th>
                        <th className="p-2">예문 확인</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {passage.vocabulary.map((v, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="p-2.5 font-serif font-bold text-sm text-slate-900">{v.word}</td>
                          <td className="p-2.5 text-center text-slate-500 font-mono">{v.partOfSpeech}</td>
                          <td className="p-2.5"><div className="h-5 border-b border-dashed border-slate-300"></div></td>
                          <td className="p-2.5 text-[11px] text-slate-500 italic font-serif">"{v.exampleEn}"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-5 py-3 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2 print:hidden shrink-0">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>앞면(지문+문제)은 1장에 딱 맞게, 뒷면(단어/구문/문법/해설)은 여유롭게 인쇄 및 PDF 저장됩니다.</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadHtml}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 cursor-pointer flex items-center gap-1"
            >
              <FileType className="w-3.5 h-3.5 text-blue-600" />
              <span>HTML 다운로드</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              닫기
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-black text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs cursor-pointer active:scale-95 transition-transform"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>A4 인쇄 / PDF 저장</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
