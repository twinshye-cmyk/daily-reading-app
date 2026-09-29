import { Passage, PrintSettings, UserProfile } from '../types';

export function generateWorksheetHtml(
  passage: Passage,
  settings: {
    studentName: string;
    studyDate: string;
    includeBackground?: boolean;
    includePassage?: boolean;
    includeQuestions?: boolean;
    includeWritingTask?: boolean;
    includeVocabList?: boolean;
    layoutType?: 'all-in-one' | 'worksheet' | 'answers-only' | 'vocab-only';
  }
): string {
  const q = passage.questions && passage.questions.length > 0 ? passage.questions[0] : null;
  const layout = settings.layoutType || 'all-in-one';

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

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>하루한장_수능영어_${settings.studentName}_${passage.titleKo}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 8mm 8mm 8mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕", "Noto Sans KR", sans-serif;
      margin: 0;
      padding: 10px;
      color: #0f172a;
      background: #ffffff;
      font-size: 9.5pt;
      line-height: 1.4;
    }
    .page-container {
      max-width: 190mm;
      margin: 0 auto;
    }
    
    /* Page 1: Student Front Sheet (Strictly 1 Page) */
    .page-front {
      max-width: 190mm;
      margin: 0 auto;
      page-break-after: always;
      break-after: page;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Page 2+: Detailed Back Sheet (Vocab, Syntax, Grammar, Answer Key) */
    .page-back {
      max-width: 190mm;
      margin: 0 auto;
      page-break-before: always;
      break-before: page;
      page-break-inside: auto;
      break-inside: auto;
      padding-top: 5px;
    }

    .header-box {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .top-meta {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 3px;
      margin-bottom: 4px;
      font-size: 8.2pt;
      font-weight: bold;
      color: #334155;
    }
    .badge {
      background: #fef2f2;
      color: #b91c1c;
      padding: 1px 5px;
      border-radius: 3px;
      border: 1px solid #fecaca;
      font-size: 7.5pt;
      font-weight: 900;
    }
    .title-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 10px;
    }
    .main-title {
      font-size: 12.5pt;
      font-weight: 900;
      margin: 0;
      color: #0f172a;
      letter-spacing: -0.4px;
      line-height: 1.2;
    }
    .sub-title {
      font-size: 8.8pt;
      font-weight: bold;
      color: #1e3a8a;
      margin-top: 2px;
    }
    .student-box {
      border: 1.2px solid #0f172a;
      border-radius: 5px;
      padding: 3px 8px;
      font-size: 8.2pt;
      min-width: 165px;
      background: #f8fafc;
      flex-shrink: 0;
    }
    .student-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1px;
    }
    .bg-box {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      padding: 4px 7px;
      border-radius: 4px;
      font-size: 8.2pt;
      margin-bottom: 6px;
      line-height: 1.35;
    }
    .passage-box {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 10pt;
      line-height: 1.42;
      text-align: justify;
      border-top: 1.2px solid #0f172a;
      border-bottom: 1.2px solid #0f172a;
      padding: 5px 0;
      margin-bottom: 6px;
      color: #0f172a;
    }
    .passage-box p {
      margin: 0 0 6px 0;
      text-indent: 14px;
    }
    .passage-box p:last-child {
      margin-bottom: 0;
    }
    .question-box {
      margin-bottom: 5px;
    }
    .q-badge {
      display: inline-block;
      font-size: 7.8pt;
      font-weight: bold;
      color: #1e3a8a;
      background: #eff6ff;
      padding: 1px 5px;
      border-radius: 3px;
      border: 1px solid #bfdbfe;
      margin-bottom: 2px;
    }
    .q-title {
      font-size: 9.2pt;
      font-weight: 900;
      margin: 2px 0 3px 0;
      line-height: 1.3;
    }
    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2px 10px;
      font-size: 8.5pt;
      margin-left: 2px;
      font-weight: 500;
    }
    .option-item {
      display: flex;
      gap: 4px;
      align-items: flex-start;
      line-height: 1.25;
    }
    .opt-num {
      font-weight: 900;
      color: #0f172a;
    }
    .writing-box {
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 4px 7px;
      font-size: 8.2pt;
      background: #f8fafc;
      margin-top: 5px;
    }
    .writing-line {
      border-bottom: 1px dashed #94a3b8;
      height: 15px;
      margin-top: 3px;
    }
    .vocab-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 3px;
      margin-top: 5px;
      font-size: 7.8pt;
      color: #475569;
      display: flex;
      flex-wrap: wrap;
      gap: 2px 6px;
      line-height: 1.3;
    }

    /* Back Page Section Styles */
    .section-title {
      font-size: 10.5pt;
      font-weight: 900;
      color: #0f172a;
      border-bottom: 1.5px solid #0f172a;
      padding-bottom: 3px;
      margin: 12px 0 6px 0;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .ans-box {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 6px 9px;
      background: #f8fafc;
      font-size: 8.8pt;
      margin-bottom: 8px;
    }
    .ans-badge {
      display: inline-block;
      background: #0f172a;
      color: #ffffff;
      font-weight: 900;
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 8.5pt;
      margin-right: 6px;
    }
    .chunk-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.2pt;
      margin-bottom: 8px;
    }
    .chunk-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: bold;
      border: 1px solid #cbd5e1;
      padding: 3px 6px;
      text-align: left;
    }
    .chunk-table td {
      border: 1px solid #e2e8f0;
      padding: 3px 6px;
      vertical-align: top;
      line-height: 1.35;
    }
    .vocab-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.2pt;
      margin-bottom: 8px;
    }
    .vocab-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: bold;
      border: 1px solid #cbd5e1;
      padding: 4px 6px;
      text-align: left;
    }
    .vocab-table td {
      border: 1px solid #e2e8f0;
      padding: 4px 6px;
      vertical-align: middle;
      line-height: 1.3;
    }

    .print-bar {
      position: sticky;
      top: 0;
      background: #1e293b;
      color: white;
      padding: 10px 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .btn-print {
      background: #2563eb;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: bold;
      font-size: 13px;
      cursor: pointer;
    }
    .btn-print:hover {
      background: #1d4ed8;
    }

    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
      .page-front {
        page-break-after: always !important;
        break-after: page !important;
        max-height: 272mm;
        overflow: hidden;
      }
      .page-back {
        page-break-before: always !important;
        break-before: page !important;
        page-break-inside: auto !important;
        break-inside: auto !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <div>
      <b style="font-size: 14px;">🖨️ 수능 영어 독해 학습지 인쇄 미리보기</b>
      <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">
        1페이지: 영어지문 + 수능문제 1장 완결 / 2페이지 이후: 단어, 구문해설, 문법해설, 정답과 해설
      </div>
    </div>
    <button class="btn-print" onclick="window.print();">
      지금 인쇄하기 (PDF 저장)
    </button>
  </div>

  <div class="page-container">

    <!-- ========================================================================= -->
    <!-- [PAGE 1] FRONT PAGE: STUDENT WORKSHEET (지문 + 문제 1장 완결) -->
    <!-- ========================================================================= -->
    ${(layout === 'all-in-one' || layout === 'worksheet') ? `
    <div class="page-front">
      <!-- 1. Compact Header -->
      <div class="header-box">
        <div class="top-meta">
          <div>
            <span>[ 일일 수능 영어 독해 워크시트 ]</span>
            <span class="badge">Spider CSAT Daily</span>
          </div>
          <div>
            <span>수준: ${passage.level} · 영역: ${passage.category.toUpperCase()}</span>
          </div>
        </div>
        <div class="title-row">
          <div>
            <h1 class="main-title">${passage.title}</h1>
            <div class="sub-title">부제: ${passage.titleKo} (${passage.source})</div>
          </div>
          <div class="student-box">
            <div class="student-row">
              <span style="color:#64748b; font-weight:bold;">학습일자:</span>
              <span style="font-weight:bold;">${settings.studyDate}</span>
            </div>
            <div class="student-row">
              <span style="color:#64748b; font-weight:bold;">학생성명:</span>
              <span style="font-weight:900; color:#0284c7; font-size:9.2pt;">${settings.studentName}</span>
            </div>
            <div class="student-row" style="border-top:1px solid #cbd5e1; padding-top:2px; margin-top:1px;">
              <span style="color:#64748b; font-weight:bold;">채점/성적:</span>
              <span style="font-weight:900; color:#dc2626;">[ &nbsp; &nbsp; &nbsp; &nbsp; / 3점 ]</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Background Knowledge -->
      ${settings.includeBackground !== false ? `
      <div class="bg-box">
        <b style="color:#0f172a;">💡 [ 배경지식 1분 브리핑 ]</b>
        <span style="color:#334155;">${passage.backgroundKnowledge}</span>
      </div>
      ` : ''}

      <!-- 3. English Reading Passage (CSAT Standard Format) -->
      ${settings.includePassage !== false ? `
      <div class="passage-box">
        ${passage.paragraphs.map((p) => `<p>${p.textEn}</p>`).join('')}
      </div>
      ` : ''}

      <!-- 4. Question Section (2-Column options) -->
      ${settings.includeQuestions !== false && q ? `
      <div class="question-box">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="q-badge">[ 실전 수능 문항 · ${q.type} ]</span>
          <span style="font-size:8pt; font-weight:900; color:#1e3a8a;">[3점]</span>
        </div>
        <div class="q-title">Q. ${q.questionEn}</div>
        <div class="options-grid">
          ${q.options.map((opt) => `
            <div class="option-item">
              <span class="opt-num">${'①②③④⑤'.charAt(opt.num - 1)}</span>
              <span>${opt.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <!-- 5. Writing / Summary Task -->
      ${settings.includeWritingTask !== false ? `
      <div class="writing-box">
        <div style="display:flex; justify-content:space-between; font-weight:bold;">
          <span>[ 1문장 서술형 요약 과제 ]</span>
          <span style="font-size:7.5pt; color:#64748b; font-weight:normal;">힌트: ${passage.writingOrSummaryTask.guide}</span>
        </div>
        <div style="font-family:Georgia,serif; font-style:italic; margin-top:2px; font-size:8pt; color:#334155;">
          Prompt: ${passage.writingOrSummaryTask.prompt}
        </div>
        <div class="writing-line"></div>
      </div>
      ` : ''}

      <!-- 6. Essential Footnote Vocab -->
      ${settings.includeVocabList !== false ? `
      <div class="vocab-footer">
        <b style="color:#0f172a;">* 필수 어휘:</b>
        ${passage.vocabulary.map((v) => `<span><b>${v.word}</b>(${v.partOfSpeech}) ${v.meaningKo}</span>`).join(' &nbsp;·&nbsp; ')}
      </div>
      ` : ''}
    </div>
    ` : ''}


    <!-- ========================================================================= -->
    <!-- [PAGE 2+] BACK PAGES: 단어, 구문해설, 문법해설, 정답과 해설 -->
    <!-- ========================================================================= -->
    ${(layout === 'all-in-one' || layout === 'answers-only') ? `
    <div class="page-back">
      <!-- Back Page Header -->
      <div class="header-box">
        <div class="top-meta">
          <div>
            <span>[ 정답 및 심층 해설 · 분석 학습지 ]</span>
            <span class="badge" style="background:#eff6ff; color:#1d4ed8; border-color:#bfdbfe;">Teacher & Self-Study Edition</span>
          </div>
          <div>
            <span>학생성명: <b>${settings.studentName}</b> · 학습일자: ${settings.studyDate}</span>
          </div>
        </div>
        <h2 class="main-title" style="font-size:12pt; color:#1e3a8a;">
          ${passage.titleKo} (원제: ${passage.title})
        </h2>
      </div>

      <!-- 1. 정답 및 수능 실전 해설 -->
      <div class="section-title">
        <span>🎓</span> 1. 수능 실전 문항 정답 및 출제 의도 / 해설
      </div>
      ${q ? `
      <div class="ans-box">
        <div style="margin-bottom:6px;">
          <span class="ans-badge">정답: ${'①②③④⑤'.charAt(q.correctAnswer - 1)} (${q.correctAnswer}번)</span>
          <span style="font-size:8.2pt; color:#64748b; font-weight:bold;">[ 배점: 3점 · 유형: ${q.type} ]</span>
        </div>
        <div style="margin-bottom:5px; line-height:1.45;">
          <b style="color:#0f172a; display:block; margin-bottom:2px;">[ 정답 근거 및 논리 전개 ]</b>
          <span style="color:#334155;">${q.explanation}</span>
        </div>
        ${q.tip ? `
        <div style="border-top:1px dashed #cbd5e1; padding-top:4px; margin-top:4px; font-size:8.2pt; color:#1e40af;">
          💡 <b>수능 1등급 함정 탈출 팁:</b> ${q.tip}
        </div>
        ` : ''}
      </div>
      ` : ''}

      <!-- 서술형 요약 모범 답안 -->
      <div class="ans-box" style="background:#f1f5f9;">
        <b style="color:#0f172a; display:block; margin-bottom:2px;">[ 서술형 1문장 요약 모범 답안 (Model Answer) ]</b>
        <div style="font-family:Georgia,serif; font-style:italic; color:#0f172a; font-size:8.8pt;">
          "${passage.writingOrSummaryTask.modelAnswer}"
        </div>
      </div>

      <!-- 2. 지문 전문 우리말 해석 -->
      <div class="section-title">
        <span>📖</span> 2. 지문 전문 우리말 직독직해 번역
      </div>
      <div style="margin-bottom:10px; font-size:8.5pt; line-height:1.45;">
        ${passage.paragraphs.map((p) => `
          <div style="margin-bottom:6px;">
            ${passage.paragraphs.length > 1 ? `<b style="color:#1e3a8a;">[단락 ${p.paragraphNumber}]</b> ` : ''}
            <span style="color:#334155;">${p.textKo}</span>
          </div>
        `).join('')}
      </div>

      <!-- 3. 구문 해설 및 직독직해 (Chunk Breakdown) -->
      <div class="section-title">
        <span>🔍</span> 3. 지문 핵심 구문 분석 및 직독직해 (Syntax & Chunk Breakdown)
      </div>
      <table class="chunk-table">
        <thead>
          <tr>
            <th style="width:30px; text-align:center;">No.</th>
            <th style="width:48%;">영어 원문 & 의미 단위 (Chunk)</th>
            <th style="width:48%;">직독직해 우리말 의미 & 구문 해설</th>
          </tr>
        </thead>
        <tbody>
          ${passage.paragraphs.flatMap((p) => p.sentenceBreakdown || []).map((s, idx) => `
            <tr>
              <td style="text-align:center; font-weight:bold; color:#64748b;">${idx + 1}</td>
              <td>
                <div style="font-family:Georgia,serif; font-weight:bold; color:#0f172a; margin-bottom:3px;">
                  "${s.sentenceEn}"
                </div>
                <div style="color:#475569; font-size:7.8pt;">
                  ${s.chunks ? s.chunks.map(c => `<span style="background:#f1f5f9; padding:1px 3px; border-radius:2px; margin-right:3px;">[${c.chunkEn}]</span>`).join(' / ') : ''}
                </div>
              </td>
              <td>
                <div style="color:#334155; margin-bottom:3px;">
                  ${s.chunks ? s.chunks.map(c => `<span>${c.chunkKo}</span>`).join(' / ') : ''}
                </div>
                ${s.grammarTip ? `
                <div style="background:#eff6ff; color:#1e40af; padding:2px 4px; border-radius:3px; font-size:7.5pt; border:1px solid #bfdbfe;">
                  📌 <b>구문 팁:</b> ${s.grammarTip}
                </div>
                ` : ''}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- 4. 핵심 문법 및 어법 포인트 해설 -->
      <div class="section-title">
        <span>💡</span> 4. 핵심 어법 및 문법 포인트 해설 (Grammar Highlights)
      </div>
      <div style="margin-bottom:10px;">
        ${grammarPoints.length > 0 ? grammarPoints.map((g, idx) => `
          <div style="border:1px solid #cbd5e1; border-radius:5px; padding:5px 8px; margin-bottom:5px; background:#f8fafc; font-size:8.2pt;">
            <div style="font-family:Georgia,serif; font-weight:bold; color:#0f172a; margin-bottom:2px;">
              [문법 포인트 ${idx + 1}] "${g.sentenceEn}"
            </div>
            <div style="color:#1e3a8a; font-weight:bold;">
              ➔ ${g.tip}
            </div>
          </div>
        `).join('') : `
          <div style="border:1px solid #cbd5e1; border-radius:5px; padding:5px 8px; font-size:8.2pt; color:#64748b;">
            지문의 주요 절 구조(관계사, 분사구문, 접속사 절)를 직독직해 청크와 연계하여 학습하세요.
          </div>
        `}
      </div>

      <!-- 5. 핵심 어휘 심화 학습 및 테스트 -->
      <div class="section-title">
        <span>📚</span> 5. 수능 필수 어휘 심화 학습 및 테스트 (Vocabulary Drill)
      </div>
      <table class="vocab-table">
        <thead>
          <tr>
            <th style="width:25px; text-align:center;">No.</th>
            <th style="width:18%;">표제어 (단어)</th>
            <th style="width:8%; text-align:center;">품사</th>
            <th style="width:22%;">우리말 뜻</th>
            <th style="width:38%;">수능 실전 예문 & 해석</th>
            <th style="width:14%; text-align:center;">암기 확인</th>
          </tr>
        </thead>
        <tbody>
          ${passage.vocabulary.map((v, idx) => `
            <tr>
              <td style="text-align:center; font-weight:bold; color:#64748b;">${idx + 1}</td>
              <td>
                <b style="font-family:Georgia,serif; font-size:9pt; color:#0f172a;">${v.word}</b>
                ${v.phonetic ? `<div style="font-size:7.2pt; color:#64748b;">${v.phonetic}</div>` : ''}
              </td>
              <td style="text-align:center; font-family:monospace; color:#475569;">${v.partOfSpeech}</td>
              <td style="font-weight:bold; color:#0f172a;">${v.meaningKo}</td>
              <td style="font-size:7.8pt;">
                <div style="font-family:Georgia,serif; color:#0f172a;">"${v.exampleEn}"</div>
                <div style="color:#64748b; margin-top:1px;">${v.exampleKo}</div>
              </td>
              <td style="text-align:center;">
                <div style="display:inline-block; width:14px; height:14px; border:1.2px solid #94a3b8; border-radius:3px;"></div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

    </div>
    ` : ''}

    <!-- ========================================================================= -->
    <!-- [PAGE: VOCAB ONLY] IF LAYOUT IS VOCAB-ONLY -->
    <!-- ========================================================================= -->
    ${layout === 'vocab-only' ? `
    <div class="page-front">
      <div class="header-box">
        <div class="top-meta">
          <div>
            <span>[ 일일 수능 어휘 테스트지 ]</span>
            <span class="badge">Vocabulary Test</span>
          </div>
          <div>
            <span>성명: <b>${settings.studentName}</b> · 학습일자: ${settings.studyDate} · 점수: [ &nbsp; &nbsp; / 100점 ]</span>
          </div>
        </div>
        <h1 class="main-title" style="font-size:12pt;">${passage.title} - 필수 어휘 쓰기 시험</h1>
      </div>

      <table class="vocab-table" style="margin-top:10px;">
        <thead>
          <tr>
            <th style="width:30px; text-align:center;">No.</th>
            <th style="width:25%;">영어 단어</th>
            <th style="width:10%; text-align:center;">품사</th>
            <th style="width:35%;">우리말 뜻 쓰기 (테스트)</th>
            <th style="width:30%;">예문 힌트</th>
          </tr>
        </thead>
        <tbody>
          ${passage.vocabulary.map((v, idx) => `
            <tr>
              <td style="text-align:center; font-weight:bold; color:#64748b;">${idx + 1}</td>
              <td><b style="font-family:Georgia,serif; font-size:9.5pt; color:#0f172a;">${v.word}</b></td>
              <td style="text-align:center; font-family:monospace; color:#475569;">${v.partOfSpeech}</td>
              <td><div style="height:18px; border-bottom:1px dashed #cbd5e1;"></div></td>
              <td style="font-size:7.8pt; font-family:Georgia,serif; color:#64748b; font-style:italic;">"${v.exampleEn}"</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

  </div>

  <script>
    window.addEventListener('load', () => {
      setTimeout(() => {
        try {
          window.print();
        } catch(e) {
          console.warn(e);
        }
      }, 300);
    });
  </script>
</body>
</html>`;
}

/**
 * Universal print trigger that works reliably in iframes, new windows, or direct browser dialog
 */
export function directPrintWorksheet(
  passage: Passage,
  activeProfile?: UserProfile
): void {
  const studentName = activeProfile?.name 
    ? (activeProfile.name === '열공마미' ? '수험생' : activeProfile.name)
    : '수험생';
  const studyDate = new Date().toISOString().split('T')[0];

  const html = generateWorksheetHtml(passage, {
    studentName,
    studyDate,
    includeBackground: true,
    includePassage: true,
    includeQuestions: true,
    includeWritingTask: true,
    includeVocabList: true,
    layoutType: 'all-in-one',
  });

  // Strategy 1: Open dedicated Print window (Bypasses iframe sandbox restrictions completely)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  
  let newWin: Window | null = null;
  try {
    newWin = window.open(blobUrl, '_blank');
  } catch (e) {
    console.warn('Window open error:', e);
  }

  // Strategy 2: If window.open was blocked or null, use hidden iframe or direct print
  if (!newWin) {
    let printFrame = document.getElementById('a4-worksheet-direct-print-iframe') as HTMLIFrameElement;
    if (!printFrame) {
      printFrame = document.createElement('iframe');
      printFrame.id = 'a4-worksheet-direct-print-iframe';
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
      doc.write(html);
      doc.close();
      setTimeout(() => {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
      }, 250);
    } else {
      window.print();
    }
  }
}
