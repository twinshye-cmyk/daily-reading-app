import { Passage } from '../types';

export const PRESET_PASSAGES: Passage[] = [
  {
    id: 'passage-neuro-01',
    title: 'The Dynamic Architecture of Neural Plasticity',
    titleKo: '신경 가소성의 동적 구조와 평생 학습의 본질',
    category: 'science',
    level: '고3/수능 실전',
    wordCount: 168,
    readTimeMinutes: 4,
    source: '2025 수능특강 변형 / 뇌신경인지과학',
    backgroundKnowledge: '과거 고전 신경과학에서는 성인이 되면 뇌신경망이 고정된다고 보았으나, 현대 뇌 가소성(Neuroplasticity) 연구는 새로운 학습과 자극을 통해 성인의 뇌 역시 시냅스 구조와 신경 회로를 평생 재배열하고 강화한다는 사실을 입증했습니다.',
    paragraphs: [
      {
        paragraphNumber: 1,
        textEn: 'For decades, classical neuroscience operated under the assumption that the adult human brain was structurally immutable. However, revolutionary neuroimaging techniques have decisively dismantled this dogma, establishing the pervasive reality of neuroplasticity. Rather than functioning as rigid biological hardware, the adult brain possesses an astonishing capacity to reorganize its synaptic architecture in response to cognitive stimulation and experiential learning. When an individual consistently engages in novel intellectual endeavors, dormant neural pathways are systematically activated, and dendritic spines multiply at key synaptic junctions. Under repeated practice, these newly forged circuits exhibit increased myelination, allowing electrical signals to travel with superior velocity and fidelity. Consequently, learning is not merely a process of passive information acquisition, but an active physical sculpting of biological circuitry that endures throughout our entire lifespan.',
        textKo: '수십 년 동안 고전 신경과학은 성인 인간의 뇌가 구조적으로 불변이라는 가정하에 작동했습니다. 그러나 혁신적인 뇌 영상 기술은 이러한 통념을 결정적으로 해체하며 신경 가소성의 보편적인 실체를 확립했습니다. 뇌는 고정된 생물학적 하드웨어로 기능하기보다는 인지적 자극과 경험적 학습에 반응하여 시냅스 구조를 재조직하는 놀라운 능력을 지니고 있습니다. 개인이 새로운 지적 노력에 지속적으로 참여할 때, 휴면 상태의 신경 통로가 체계적으로 활성화되고 핵심 시냅스 접합부에서 수상돌기 가시가 증식합니다. 반복적인 연습 아래에서, 새롭게 형성된 이 회로들은 증가된 수초화를 보여주며, 전기 신호가 더 뛰어난 속도와 정확도로 이동할 수 있게 합니다. 결과적으로 학습은 단순히 수동적인 정보 습득 과정이 아니라, 일생 전체에 걸쳐 지속되는 생물학적 회로망의 능동적인 물리적 조각 과정입니다.',
        sentenceBreakdown: [
          {
            sentenceEn: 'For decades, classical neuroscience operated under the assumption that the adult human brain was structurally immutable.',
            chunks: [
              { chunkEn: 'For decades,', chunkKo: '수십 년 동안,' },
              { chunkEn: 'classical neuroscience operated', chunkKo: '고전 신경과학은 작동했다' },
              { chunkEn: 'under the assumption that', chunkKo: '~라는 가정하에' },
              { chunkEn: 'the adult human brain', chunkKo: '성인 인간의 뇌가' },
              { chunkEn: 'was structurally immutable.', chunkKo: '구조적으로 불변이라는.' },
            ],
            grammarTip: '동격의 접속사 that: the assumption that + 완전한 절 (가정의 구체적 내용을 설명). immutable (불변의).',
          },
          {
            sentenceEn: 'However, revolutionary neuroimaging techniques have decisively dismantled this dogma, establishing the pervasive reality of neuroplasticity.',
            chunks: [
              { chunkEn: 'However,', chunkKo: '그러나,' },
              { chunkEn: 'revolutionary neuroimaging techniques', chunkKo: '혁신적인 뇌 영상 기술들은' },
              { chunkEn: 'have decisively dismantled this dogma,', chunkKo: '이러한 통념(교조)을 결정적으로 해체했으며,' },
              { chunkEn: 'establishing the pervasive reality', chunkKo: '보편적 실체를 확립했다' },
              { chunkEn: 'of neuroplasticity.', chunkKo: '신경 가소성의.' },
            ],
            grammarTip: '분사구문: establishing... (= and they have established...의 능동적 분사구문). dismantle (해체하다).',
          },
          {
            sentenceEn: 'Rather than functioning as rigid biological hardware, the adult brain possesses an astonishing capacity to reorganize its synaptic architecture in response to cognitive stimulation and experiential learning.',
            chunks: [
              { chunkEn: 'Rather than functioning', chunkKo: '기능하기보다는' },
              { chunkEn: 'as rigid biological hardware,', chunkKo: '완고한(고정된) 생물학적 하드웨어로서,' },
              { chunkEn: 'the adult brain possesses', chunkKo: '성인의 뇌는 지니고 있다' },
              { chunkEn: 'an astonishing capacity', chunkKo: '놀라운 능력을' },
              { chunkEn: 'to reorganize its synaptic architecture', chunkKo: '그것의 시냅스 구조를 재편성하는' },
              { chunkEn: 'in response to cognitive stimulation', chunkKo: '인지적 자극과' },
              { chunkEn: 'and experiential learning.', chunkKo: '경험적 학습에 반응하여.' },
            ],
            grammarTip: 'Rather than + -ing 구문: ~하기보다는 오히려. to reorganize는 capacity를 수식하는 형용사적 용법의 to부정사.',
          },
          {
            sentenceEn: 'When an individual consistently engages in novel intellectual endeavors, dormant neural pathways are systematically activated, and dendritic spines multiply at key synaptic junctions.',
            chunks: [
              { chunkEn: 'When an individual consistently engages in', chunkKo: '개인이 지속적으로 참여할 때' },
              { chunkEn: 'novel intellectual endeavors,', chunkKo: '새로운 지적 노력에,' },
              { chunkEn: 'dormant neural pathways are systematically activated,', chunkKo: '휴면 상태의 신경 통로가 체계적으로 활성화되고,' },
              { chunkEn: 'and dendritic spines multiply', chunkKo: '수상돌기 가시들이 증식한다' },
              { chunkEn: 'at key synaptic junctions.', chunkKo: '핵심 시냅스 접합부에서.' },
            ],
            grammarTip: 'engage in (~에 참여하다/종사하다), dormant (휴면 중인/잠자는), dendritic spines (수상돌기 가시).',
          },
          {
            sentenceEn: 'Under repeated practice, these newly forged circuits exhibit increased myelination, allowing electrical signals to travel with superior velocity and fidelity.',
            chunks: [
              { chunkEn: 'Under repeated practice,', chunkKo: '반복적인 연습 아래에서,' },
              { chunkEn: 'these newly forged circuits exhibit', chunkKo: '새롭게 형성된 이 회로들은 보여준다' },
              { chunkEn: 'increased myelination,', chunkKo: '증가된 수초화(절연층 형성)를,' },
              { chunkEn: 'allowing electrical signals to travel', chunkKo: '전기 신호가 이동하도록 허용하면서' },
              { chunkEn: 'with superior velocity and fidelity.', chunkKo: '더 우수한 속도와 정확성으로.' },
            ],
            grammarTip: 'allowing + O + to V (5형식 분사구문). fidelity (충실도, 정확성).',
          },
          {
            sentenceEn: 'Consequently, learning is not merely a process of passive information acquisition, but an active physical sculpting of biological circuitry that endures throughout our entire lifespan.',
            chunks: [
              { chunkEn: 'Consequently,', chunkKo: '결과적으로,' },
              { chunkEn: 'learning is not merely a process', chunkKo: '학습은 단지 과정이 아니라' },
              { chunkEn: 'of passive information acquisition,', chunkKo: '수동적인 정보 습득의,' },
              { chunkEn: 'but an active physical sculpting', chunkKo: '능동적인 물리적 조각 과정이다' },
              { chunkEn: 'of biological circuitry', chunkKo: '생물학적 회로망의' },
              { chunkEn: 'that endures throughout our entire lifespan.', chunkKo: '우리의 전 생애에 걸쳐 지속되는.' },
            ],
            grammarTip: 'not merely A but B (= not only A but also B): A뿐만 아니라 B도. that은 주격 관계대명사.',
          },
        ],
      },
    ],
    vocabulary: [
      {
        word: 'immutable',
        phonetic: '/ɪˈmjuːtəbl/',
        partOfSpeech: 'adj.',
        meaningKo: '불변의, 바꿀 수 없는',
        exampleEn: 'The laws of physics are considered immutable.',
        exampleKo: '물리학의 법칙들은 불변인 것으로 여겨진다.',
        synonyms: ['unchangeable', 'fixed', 'permanent'],
        csatImportance: '⭐⭐⭐ (필수)',
      },
      {
        word: 'dismantle',
        phonetic: '/dɪsˈmæntl/',
        partOfSpeech: 'v.',
        meaningKo: '(통념·제도를) 해체하다, 분해하다',
        exampleEn: 'New empirical evidence dismantled the prevailing theory.',
        exampleKo: '새로운 실증적 증거가 지배적인 이론을 해체했다.',
        synonyms: ['deconstruct', 'demolish', 'break down'],
        csatImportance: '⭐⭐⭐ (필수)',
      },
      {
        word: 'pervasive',
        phonetic: '/pərˈveɪsɪv/',
        partOfSpeech: 'adj.',
        meaningKo: '만연하는, 보편적인, 널리 퍼진',
        exampleEn: 'The pervasive influence of technology is felt in all aspects of life.',
        exampleKo: '기술의 만연한 영향력은 삶의 모든 측면에서 느껴진다.',
        synonyms: ['ubiquitous', 'widespread', 'prevalent'],
        csatImportance: '⭐⭐ (빈출)',
      },
      {
        word: 'dormant',
        phonetic: '/ˈdɔːrmənt/',
        partOfSpeech: 'adj.',
        meaningKo: '휴면기의, 잠자는, 활동을 중단한',
        exampleEn: 'Seeds can lie dormant in the soil for decades before sprouting.',
        exampleKo: '씨앗은 싹이 트기 전 수십 년 동안 토양 속에서 휴면 상태로 있을 수 있다.',
        synonyms: ['inactive', 'quiescent', 'latent'],
        csatImportance: '⭐⭐ (빈출)',
      },
      {
        word: 'circuitry',
        phonetic: '/ˈsɜːrkɪtri/',
        partOfSpeech: 'n.',
        meaningKo: '회로망, 신경 회로 체계',
        exampleEn: 'Synaptic circuitry adapts according to repeated behaviors.',
        exampleKo: '시냅스 회로망은 반복되는 행동에 따라 적응한다.',
        synonyms: ['network', 'system', 'pathway'],
        csatImportance: '⭐ (심화)',
      },
    ],
    questions: [
      {
        id: 'q1-neuro',
        type: '빈칸추론',
        questionEn: 'Which of the following best fits the blank at the conclusion of the passage regarding the nature of human learning?',
        questionKo: '다음 글의 빈칸에 들어갈 말로 가장 적절한 것은?',
        options: [
          { num: 1, text: 'a predetermined biological destiny unaffected by external stimuli' },
          { num: 2, text: 'an active physical remodeling of the brain’s structural pathways' },
          { num: 3, text: 'a temporary storage of data that rapidly decays without repetition' },
          { num: 4, text: 'the deterioration of synaptic connections caused by aging' },
          { num: 5, text: 'a purely cognitive process separated from physiological changes' },
        ],
        correctAnswer: 2,
        explanation: '본문은 성인의 뇌 역시 고정되어 있지 않고, 경험과 지적 노력에 따라 시냅스 구조가 재조직(reorganize)되고 물리적으로 조각(physical sculpting of biological circuitry)된다는 신경 가소성을 설명하고 있으므로 ②번이 가장 적절합니다.',
        tip: '오답 함정: ①번은 과거의 잘못된 통념(고정론), ⑤번은 생물학적 변화와 분리된 순수 인지 과정이라는 설명으로 본문의 "physical sculpting"과 정면 배치됩니다.',
      },
    ],
    writingOrSummaryTask: {
      prompt: 'Summarize the central thesis of the text in one complete English sentence using the words "neuroplasticity" and "reorganize".',
      guide: '신경 가소성과 뇌 회로의 재조직을 연결하여 핵심 주장을 한 문장으로 요약하세요.',
      modelAnswer: 'Neuroplasticity demonstrates that human learning is an active process through which the brain continuously reorganizes its physical circuitry throughout life.',
    },
    createdAt: '2025-01-10T00:00:00Z',
  },
  {
    id: 'passage-econ-02',
    title: 'The Tyranny of Abundance: Decision Fatigue in Modern Consumerism',
    titleKo: '풍요의 역설: 현대 소비사회에서의 결정 피로',
    category: 'economy',
    level: '고2 실력',
    wordCount: 165,
    readTimeMinutes: 3,
    source: 'EBS 수능특강 연계 / 행동경제학',
    backgroundKnowledge: '배리 슈워츠(Barry Schwartz)의 ‘선택의 역설(The Paradox of Choice)’에 따르면, 선택지가 많아질수록 자유와 만족도가 높아질 것이라는 상식과 달리, 뇌는 과도한 비교로 인해 에너지를 고갈시키고 결국 후회와 불안감을 느끼게 됩니다.',
    paragraphs: [
      {
        paragraphNumber: 1,
        textEn: 'Modern economic orthodoxy has long postulated that expanding consumer choices invariably enhances personal autonomy and psychological satisfaction. Yet empirical investigations into behavioral psychology reveal a starkly contradictory phenomenon known as the paradox of choice. When confronted with an overwhelming proliferation of options, human cognitive bandwidth suffers severe depletion. Evaluating countless subtle variations requires sustained analytical effort, which rapidly exhausts executive mental functions. Consequently, excessive options induce decision paralysis rather than liberation, accompanied by a chronic escalation of anticipated regret regarding unchosen alternatives. Consumers who strive for the optimal choice frequently end up feeling dissatisfied with their final decision, regardless of its objective merit.',
        textKo: '현대 경제학의 정설은 소비자 선택의 확장이 언제나 개인의 자율성과 심리적 만족을 증진시킨다고 오랫동안 상정해 왔습니다. 그러나 행동 심리학의 실증적 연구들은 선택의 역설이라 알려진 완전히 모순되는 현상을 밝혀냅니다. 압도적으로 급증하는 선택지들과 마주할 때, 인간의 인지적 대역폭은 심각한 고갈을 겪게 됩니다. 수많은 미세한 차이들을 평가하는 것은 지속적인 분석적 노력을 필요로 하며, 이는 실행적 정신 기능을 빠르게 소진시킵니다. 결과적으로 지나친 선택권은 해방감보다는 결정 마비를 유발하며, 선택받지 못한 대안들에 대한 예상된 후회의 만성적인 고조를 동반합니다. 최적의 선택을 위해 분투하는 소비자들은 그 선택의 객관적 우수성과 관계없이 종종 최종 결정에 불만을 느끼게 됩니다.',
        sentenceBreakdown: [
          {
            sentenceEn: 'Modern economic orthodoxy has long postulated that expanding consumer choices invariably enhances personal autonomy and psychological satisfaction.',
            chunks: [
              { chunkEn: 'Modern economic orthodoxy has long postulated', chunkKo: '현대 경제학적 정설은 오랫동안 상정해 왔다' },
              { chunkEn: 'that expanding consumer choices', chunkKo: '소비자 선택을 확장하는 것이' },
              { chunkEn: 'invariably enhances', chunkKo: '변함없이 향상시킨다고' },
              { chunkEn: 'personal autonomy and psychological satisfaction.', chunkKo: '개인의 자율성과 심리적 만족을.' },
            ],
            grammarTip: '동명사 주어 expanding consumer choices는 단수 취급하므로 동사 enhances가 쓰임. orthodoxy (정설/통설).',
          },
          {
            sentenceEn: 'Yet empirical investigations into behavioral psychology reveal a starkly contradictory phenomenon known as the paradox of choice.',
            chunks: [
              { chunkEn: 'Yet empirical investigations', chunkKo: '그러나 실증적 연구들은' },
              { chunkEn: 'into behavioral psychology', chunkKo: '행동 심리학에 대한' },
              { chunkEn: 'reveal a starkly contradictory phenomenon', chunkKo: '완전히 모순되는 현상을 밝혀낸다' },
              { chunkEn: 'known as the paradox of choice.', chunkKo: '선택의 역설로 알려진.' },
            ],
            grammarTip: 'known as는 앞의 명사 phenomenon을 수식하는 과거분사구.',
          },
          {
            sentenceEn: 'When confronted with an overwhelming proliferation of options, human cognitive bandwidth suffers severe depletion.',
            chunks: [
              { chunkEn: 'When confronted with', chunkKo: '~에 직면했을 때' },
              { chunkEn: 'an overwhelming proliferation of options,', chunkKo: '선택지의 압도적인 급증에,' },
              { chunkEn: 'human cognitive bandwidth', chunkKo: '인간의 인지적 대역폭은' },
              { chunkEn: 'suffers severe depletion.', chunkKo: '심각한 고갈을 겪는다.' },
            ],
            grammarTip: '분사구문 When (human beings are) confronted with... 수동의 의미. proliferation (급증/확산).',
          },
          {
            sentenceEn: 'Evaluating countless subtle variations requires sustained analytical effort, which rapidly exhausts executive mental functions.',
            chunks: [
              { chunkEn: 'Evaluating countless subtle variations', chunkKo: '수많은 미세한 차이점들을 평가하는 것은' },
              { chunkEn: 'requires sustained analytical effort,', chunkKo: '지속적인 분석적 노력을 요구하며,' },
              { chunkEn: 'which rapidly exhausts', chunkKo: '이는 빠르게 소진시킨다' },
              { chunkEn: 'executive mental functions.', chunkKo: '실행적인 정신 기능들을.' },
            ],
            grammarTip: '관계대명사의 계속적 용법 (, which): 앞 절 전체를 선행사로 받아 부연 설명.',
          },
          {
            sentenceEn: 'Consequently, excessive options induce decision paralysis rather than liberation, accompanied by a chronic escalation of anticipated regret regarding unchosen alternatives.',
            chunks: [
              { chunkEn: 'Consequently, excessive options induce', chunkKo: '결과적으로 과도한 선택지들은 유도한다' },
              { chunkEn: 'decision paralysis rather than liberation,', chunkKo: '해방보다는 결정 마비를,' },
              { chunkEn: 'accompanied by a chronic escalation', chunkKo: '만성적인 고조에 수반되어' },
              { chunkEn: 'of anticipated regret regarding unchosen alternatives.', chunkKo: '선택되지 않은 대안들에 대한 예상된 후회의.' },
            ],
            grammarTip: 'accompanied by... (분사구문 부대상황), regarding (~에 관하여 = concerning, about).',
          },
          {
            sentenceEn: 'Consumers who strive for the optimal choice frequently end up feeling dissatisfied with their final decision, regardless of its objective merit.',
            chunks: [
              { chunkEn: 'Consumers who strive for the optimal choice', chunkKo: '최적의 선택을 위해 분투하는 소비자들은' },
              { chunkEn: 'frequently end up feeling dissatisfied', chunkKo: '빈번히 결국 불만을 느끼게 된다' },
              { chunkEn: 'with their final decision,', chunkKo: '그들의 최종 결정에,' },
              { chunkEn: 'regardless of its objective merit.', chunkKo: '그것의 객관적인 장점과 무관하게.' },
            ],
            grammarTip: 'end up + -ing (결국 ~하게 되다), regardless of (~와 상관없이).',
          },
        ],
      },
    ],
    vocabulary: [
      {
        word: 'orthodoxy',
        phonetic: '/ˈɔːrθədɑːksi/',
        partOfSpeech: 'n.',
        meaningKo: '통설, 정설, 전통적 신념',
        exampleEn: 'He challenged the economic orthodoxy of the era.',
        exampleKo: '그는 그 시대의 경제적 통설에 도전했다.',
        synonyms: ['dogma', 'doctrine', 'convention'],
        csatImportance: '⭐⭐ (빈출)',
      },
      {
        word: 'proliferation',
        phonetic: '/prəˌlɪfəˈreɪʃn/',
        partOfSpeech: 'n.',
        meaningKo: '급증, 확산, 증식',
        exampleEn: 'The proliferation of digital devices transformed communication.',
        exampleKo: '디지털 기기의 급증은 소통 방식을 변화시켰다.',
        synonyms: ['rapid growth', 'multiplication', 'expansion'],
        csatImportance: '⭐⭐⭐ (필수)',
      },
      {
        word: 'depletion',
        phonetic: '/dɪˈpliːʃn/',
        partOfSpeech: 'n.',
        meaningKo: '고갈, 소모',
        exampleEn: 'Overworking leads to the depletion of emotional resources.',
        exampleKo: '과로는 정서적 자원의 고갈로 이어진다.',
        synonyms: ['exhaustion', 'reduction', 'drain'],
        csatImportance: '⭐⭐⭐ (필수)',
      },
      {
        word: 'paralysis',
        phonetic: '/pəˈræləsɪs/',
        partOfSpeech: 'n.',
        meaningKo: '마비, 무력 상태, 불능',
        exampleEn: 'Analysis paralysis occurs when overthinking prevents action.',
        exampleKo: '분석 마비는 지나친 생각이 행동을 가로막을 때 발생한다.',
        synonyms: ['immobility', 'stagnation', 'standstill'],
        csatImportance: '⭐⭐ (빈출)',
      },
      {
        word: 'acute',
        phonetic: '/əˈkjuːt/',
        partOfSpeech: 'adj.',
        meaningKo: '극심한, 예리한, 급성의',
        exampleEn: 'There is an acute shortage of medical supplies.',
        exampleKo: '의료 물자의 극심한 부족이 있다.',
        synonyms: ['severe', 'intense', 'sharp'],
        csatImportance: '⭐⭐⭐ (필수)',
      },
    ],
    questions: [
      {
        id: 'q1-econ',
        type: '주제/제목',
        questionEn: 'What is the most suitable title for the passage?',
        questionKo: '다음 글의 제목으로 가장 적절한 것은?',
        options: [
          { num: 1, text: 'How Diverse Consumer Goods Boost National Productivity' },
          { num: 2, text: 'The Dark Side of Limitless Choice: Exhaustion and Regret' },
          { num: 3, text: 'Methods for Marketing Specialists to Expand Product Lines' },
          { num: 4, text: 'Why Rational Consumers Always Make Optimal Decisions' },
          { num: 5, text: 'The Psychological Origin of Brand Loyalty in Modern Times' },
        ],
        correctAnswer: 2,
        explanation: '본문은 선택권이 무제한으로 늘어날 때 인지적 대역폭이 고갈되고 결정 피로와 마비, 후회가 증대된다는 선택의 역설을 다루고 있으므로 ②번이 가장 적절합니다.',
        tip: '오답 함정: ④번은 전통 경제학의 잘못된 가설이며, 글의 핵심 주장과 정반대입니다.',
      },
    ],
    writingOrSummaryTask: {
      prompt: 'Write down why excessive choice causes mental fatigue according to the passage.',
      guide: '지문에 근거하여 과도한 선택지가 왜 인지적 피로를 유발하는지 서술하세요.',
      modelAnswer: 'Evaluating countless subtle differences among numerous options exhausts human cognitive bandwidth and triggers severe decision fatigue.',
    },
    createdAt: '2025-01-11T00:00:00Z',
  },
  {
    id: 'passage-ai-03',
    title: 'The Algorithmic Mirror: Unmasking Human Bias in Machine Learning',
    titleKo: '알고리즘의 거울: 머신러닝 속에 투영된 인간의 편향성',
    category: 'tech',
    level: '수능 고난도 킬러',
    wordCount: 173,
    readTimeMinutes: 5,
    source: '2025 평가원 모의평가 변형 / AI 윤리학',
    backgroundKnowledge: '인공지능은 순수한 수학적 계산을 수행하므로 완전히 객관적이라고 착각하기 쉽지만, AI가 학습하는 데이터 자체가 역사적 불평등과 인간의 기존 편견을 담고 있기 때문에 편향을 오히려 증폭시킬 수 있습니다.',
    paragraphs: [
      {
        paragraphNumber: 1,
        textEn: 'Artificial intelligence is frequently heralded as an impartial arbiter, untainted by the subjective prejudices that plague human deliberations. However, this purported neutrality is a dangerous illusion. Machine learning algorithms do not synthesize knowledge in a cultural vacuum; rather, their predictive efficacy is fundamentally tethered to historical datasets. When these datasets encode past societal inequities, systemic disparities, or linguistic stereotypes, the algorithm ingests and subsequently amplifies these distortions under a facade of mathematical rigor. Without proactive ethical intervention and algorithmic auditing, automated systems risk perpetuating existing societal imbalances across critical sectors such as recruitment and judicial sentencing. True algorithmic fairness demands continuous scrutiny of both technical models and the foundational data upon which they are constructed.',
        textKo: '인공지능은 인간의 심의를 괴롭히는 주관적 편견에 물들지 않은 공정한 중재자로서 자주 칭송받습니다. 하지만 이러한 중립성에 대한 주장은 위험한 환상입니다. 머신러닝 알고리즘은 문화적 진공 속에서 지식을 합성하지 않으며, 오히려 그 예측적 유효성은 근본적으로 역사적 데이터 세트에 얽매여 있습니다. 이러한 데이터 세트가 과거의 사회적 불평등, 구조적 격차, 또는 언어적 고정관념을 내포하고 있을 때, 알고리즘은 수학적 엄밀함이라는 외피 아래 이러한 왜곡들을 흡수하고 뒤이어 증폭시킵니다. 적극적인 윤리적 개입과 알고리즘 감사 없이는, 자동화된 시스템들이 채용이나 사법 판결과 같은 핵심 분야 전반에서 기존의 사회적 불균형을 영속화할 위험이 있습니다. 진정한 알고리즘의 공정성은 기술적 모델과 그것이 구축된 기초 데이터 모두에 대한 지속적인 정밀 조사를 요구합니다.',
        sentenceBreakdown: [
          {
            sentenceEn: 'Artificial intelligence is frequently heralded as an impartial arbiter, untainted by the subjective prejudices that plague human deliberations.',
            chunks: [
              { chunkEn: 'Artificial intelligence is frequently heralded', chunkKo: '인공지능은 자주 칭송받는다' },
              { chunkEn: 'as an impartial arbiter,', chunkKo: '공정한 중재자로서,' },
              { chunkEn: 'untainted by the subjective prejudices', chunkKo: '주관적 편견에 오염되지 않은' },
              { chunkEn: 'that plague human deliberations.', chunkKo: '인간의 심의를 괴롭히는.' },
            ],
            grammarTip: 'untainted는 an impartial arbiter를 수식하는 분사형 형용사. that은 주격 관계대명사이며 선행사는 prejudices.',
          },
          {
            sentenceEn: 'However, this purported neutrality is a dangerous illusion.',
            chunks: [
              { chunkEn: 'However, this purported neutrality', chunkKo: '그러나 이러한 자칭(주장된) 중립성은' },
              { chunkEn: 'is a dangerous illusion.', chunkKo: '위험한 환상이다.' },
            ],
            grammarTip: 'purported (주장되는, 소문상의 - 수능 킬러문항 단골 어휘).',
          },
          {
            sentenceEn: 'Machine learning algorithms do not synthesize knowledge in a cultural vacuum; rather, their predictive efficacy is fundamentally tethered to historical datasets.',
            chunks: [
              { chunkEn: 'Machine learning algorithms do not synthesize knowledge', chunkKo: '머신러닝 알고리즘은 지식을 합성하지 않는다' },
              { chunkEn: 'in a cultural vacuum;', chunkKo: '문화적 진공 속에서;' },
              { chunkEn: 'rather, their predictive efficacy', chunkKo: '오히려 그들의 예측 효능은' },
              { chunkEn: 'is fundamentally tethered to', chunkKo: '근본적으로 ~에 매여 있다' },
              { chunkEn: 'historical datasets.', chunkKo: '역사적 데이터 세트에.' },
            ],
            grammarTip: 'be tethered to: ~에 묶여 있다/속박되다 (비유적 표현). efficacy (효능, 유효성).',
          },
          {
            sentenceEn: 'When these datasets encode past societal inequities, systemic disparities, or linguistic stereotypes, the algorithm ingests and subsequently amplifies these distortions under a facade of mathematical rigor.',
            chunks: [
              { chunkEn: 'When these datasets encode', chunkKo: '이러한 데이터 세트가 암호화(내포)할 때' },
              { chunkEn: 'past societal inequities, systemic disparities,', chunkKo: '과거의 사회적 불공정, 구조적 격차,' },
              { chunkEn: 'or linguistic stereotypes,', chunkKo: '또는 언어적 고정관념들을,' },
              { chunkEn: 'the algorithm ingests and subsequently amplifies', chunkKo: '알고리즘은 흡수하고 뒤이어 증폭시킨다' },
              { chunkEn: 'these distortions', chunkKo: '이러한 왜곡들을' },
              { chunkEn: 'under a facade of mathematical rigor.', chunkKo: '수학적 엄밀함이라는 외피(겉모습) 아래서.' },
            ],
            grammarTip: 'facade of: ~라는 겉모습/허울. rigor: 엄밀함, 엄격함.',
          },
          {
            sentenceEn: 'Without proactive ethical intervention and algorithmic auditing, automated systems risk perpetuating existing societal imbalances across critical sectors such as recruitment and judicial sentencing.',
            chunks: [
              { chunkEn: 'Without proactive ethical intervention', chunkKo: '사전 예방적인 윤리적 개입과' },
              { chunkEn: 'and algorithmic auditing,', chunkKo: '알고리즘 감사(검증) 없이는,' },
              { chunkEn: 'automated systems risk perpetuating', chunkKo: '자동화 시스템은 영속화할 위험이 있다' },
              { chunkEn: 'existing societal imbalances', chunkKo: '기존의 사회적 불균형을' },
              { chunkEn: 'across critical sectors such as recruitment and judicial sentencing.', chunkKo: '채용 및 사법 판결과 같은 핵심 분야 전반에 걸쳐.' },
            ],
            grammarTip: 'risk + 동명사(~ing): ~할 위험을 무릅쓰다/초래하다. perpetuating (영속화하는 것).',
          },
          {
            sentenceEn: 'True algorithmic fairness demands continuous scrutiny of both technical models and the foundational data upon which they are constructed.',
            chunks: [
              { chunkEn: 'True algorithmic fairness demands', chunkKo: '진정한 알고리즘 공정성은 요구한다' },
              { chunkEn: 'continuous scrutiny', chunkKo: '지속적인 정밀 조사를' },
              { chunkEn: 'of both technical models', chunkKo: '기술적 모델들과' },
              { chunkEn: 'and the foundational data', chunkKo: '기초 데이터 둘 다에 대한' },
              { chunkEn: 'upon which they are constructed.', chunkKo: '그것들이 구축되는 기초가 되는.' },
            ],
            grammarTip: '전치사 + 관계대명사 (upon which): data upon which they are constructed = they are constructed upon data.',
          },
        ],
      },
    ],
    vocabulary: [
      {
        word: 'impartial',
        phonetic: '/ɪmˈpɑːrʃl/',
        partOfSpeech: 'adj.',
        meaningKo: '공정한, 치우치지 않은',
        exampleEn: 'A judge must remain entirely impartial.',
        exampleKo: '판사는 전적으로 공정함을 유지해야 한다.',
        synonyms: ['unbiased', 'objective', 'neutral'],
        csatImportance: '⭐⭐⭐ (필수)',
      },
      {
        word: 'arbiter',
        phonetic: '/ˈɑːrbɪtər/',
        partOfSpeech: 'n.',
        meaningKo: '중재자, 판정자, 결정권자',
        exampleEn: 'The supreme court acts as the ultimate arbiter of the constitution.',
        exampleKo: '대법원은 헌법의 최종 중재자로서 역할을 한다.',
        synonyms: ['judge', 'mediator', 'adjudicator'],
        csatImportance: '⭐⭐ (빈출)',
      },
      {
        word: 'tethered',
        phonetic: '/ˈteðərd/',
        partOfSpeech: 'adj.',
        meaningKo: '묶인, 결속된, 속박된',
        exampleEn: 'Our perceptions are often tethered to our upbringing.',
        exampleKo: '우리의 인식은 종종 우리의 성장 배경에 묶여 있다.',
        synonyms: ['tied', 'bound', 'linked'],
        csatImportance: '⭐⭐ (빈출)',
      },
      {
        word: 'facade',
        phonetic: '/fəˈsɑːd/',
        partOfSpeech: 'n.',
        meaningKo: '표면, 겉모습, 허울',
        exampleEn: 'Behind a facade of confidence lay deep insecurity.',
        exampleKo: '자신감이라는 겉모습 뒤에는 깊은 불안이 놓여 있었다.',
        synonyms: ['front', 'pretense', 'veneer'],
        csatImportance: '⭐⭐⭐ (필수)',
      },
      {
        word: 'perpetuate',
        phonetic: '/pərˈpetʃueɪt/',
        partOfSpeech: 'v.',
        meaningKo: '영속시키다, 지속되게 하다',
        exampleEn: 'Media stereotypes can perpetuate discrimination.',
        exampleKo: '미디어의 고정관념은 차별을 영속화할 수 있다.',
        synonyms: ['prolong', 'continue', 'sustain'],
        csatImportance: '⭐⭐⭐ (필수)',
      },
    ],
    questions: [
      {
        id: 'q1-ai',
        type: '문맥상 어휘',
        questionEn: 'Which of the following phrases most accurately captures the inherent risk of unexamined AI systems described in the passage?',
        questionKo: '다음 중 본문에서 검증되지 않은 AI 시스템의 내재적 위험을 가장 잘 포착한 것은?',
        options: [
          { num: 1, text: 'Elimination of all emotional errors in data collection' },
          { num: 2, text: 'Amplification of historical prejudices masked as mathematical truth' },
          { num: 3, text: 'Replacement of hardware with biological neural mechanisms' },
          { num: 4, text: 'Immediate obsolescence of human judicial professions' },
          { num: 5, text: 'Complete autonomy from past historical datasets' },
        ],
        correctAnswer: 2,
        explanation: '본문은 AI가 중립적이라는 환상과 달리 역사적 데이터에 내재된 불평등과 편향을 수학적 엄밀함이라는 외피 아래 흡수하고 증폭(amplifies distortions)시킨다는 점을 경고하고 있으므로 ②번이 정답입니다.',
        tip: '수능 빈출 코드: AI의 객관성에 대한 맹신 비판 및 데이터 의존성 지적 지문.',
      },
    ],
    writingOrSummaryTask: {
      prompt: 'State the condition under which AI algorithms reproduce human bias.',
      guide: 'AI 알고리즘이 인간의 편향을 재현하게 되는 전제 조건을 한글 또는 영어로 서술하세요.',
      modelAnswer: 'When training datasets contain historical human inequities and stereotypes, algorithms absorb and amplify those biases without proper ethical oversight.',
    },
    createdAt: '2025-01-12T00:00:00Z',
  },
  {
    id: 'passage-ocean-04',
    title: 'The Oceanic Twilight Zone: The Planet’s Unsung Climate Engine',
    titleKo: '심해 중광대: 지구의 숨겨진 기후 조절 엔진',
    category: 'science',
    level: '고2 실력',
    wordCount: 168,
    readTimeMinutes: 4,
    source: 'EBS 수능완성 실전 / 해양생태학',
    backgroundKnowledge: '수심 200m에서 1,000m 사이의 빛이 희미하게 도달하는 \'황혼대(Twilight Zone)\'는 지구상에서 가장 거대한 동물 이동이 일어나는 곳으로, 표층의 탄소를 깊은 바다 바닥으로 끌어내리는 생물학적 탄소 펌프 역할을 수행합니다.',
    paragraphs: [
      {
        paragraphNumber: 1,
        textEn: 'Lying between 200 and 1,000 meters beneath the sea surface, the mesopelagic zone—commonly designated as the ocean twilight zone—remains one of the least comprehended realms on Earth. Despite the perpetual gloom and chilling temperatures, this oceanic layer harbors an immense biomass exceeding that of all global commercial fisheries combined. Every night, billions of mesopelagic organisms undertake a synchronized vertical migration toward surface waters to feed, retreating to the abyss at dawn to avoid visual predators. This monumental biological cycle acts as a colossal biological pump, actively transporting surface carbon into the ocean interior. By sequestering millions of tons of atmospheric carbon into the deep ocean floor for centuries, the twilight zone serves as an indispensable natural regulator of Earth’s climate system.',
        textKo: '해수면 아래 200미터에서 1,000미터 사이에 위치한 중광대(일반적으로 해양 황혼대로 불림)는 지구상에서 가장 덜 이해된 영역 중 하나로 남아 있습니다. 끊임없는 어둠과 차가운 수온에도 불구하고, 이 해양층은 전 세계 상업 어업을 모두 합친 것보다 더 많은 막대한 생물량을 품고 있습니다. 매일 밤 수십억 마리의 중광대 생물들은 먹이를 먹기 위해 표층수를 향해 일제히 수직 이동을 감행하며, 새벽에는 시각적 포식자를 피하기 위해 심연으로 후퇴합니다. 이 기념비적인 생물학적 주기는 거대한 생물학적 펌프로 작동하여, 표층의 탄소를 바다 내부로 능동적으로 수송합니다. 수백 년 동안 수백만 톤의 대기 중 탄소를 심해 바닥으로 격리함으로써, 황혼대는 지구 기후 시스템의 필수불가결한 천연 조절자 역할을 수행합니다.',
        sentenceBreakdown: [
          {
            sentenceEn: 'Lying between 200 and 1,000 meters beneath the sea surface, the mesopelagic zone—commonly designated as the ocean twilight zone—remains one of the least comprehended realms on Earth.',
            chunks: [
              { chunkEn: 'Lying between 200 and 1,000 meters', chunkKo: '200~1,000미터 사이에 위치하면서' },
              { chunkEn: 'beneath the sea surface,', chunkKo: '해수면 아래,' },
              { chunkEn: 'the mesopelagic zone', chunkKo: '중광대는' },
              { chunkEn: '—commonly designated as the ocean twilight zone—', chunkKo: '—흔히 해양 황혼대로 명명되는—' },
              { chunkEn: 'remains one of the least comprehended realms', chunkKo: '가장 덜 이해된 영역 중 하나로 남아 있다' },
              { chunkEn: 'on Earth.', chunkKo: '지구상에서.' },
            ],
            grammarTip: 'Lying between... (분사구문). designate A as B (A를 B로 지정/명명하다).',
          },
          {
            sentenceEn: 'Despite the perpetual gloom and chilling temperatures, this oceanic layer harbors an immense biomass exceeding that of all global commercial fisheries combined.',
            chunks: [
              { chunkEn: 'Despite the perpetual gloom', chunkKo: '영구적인 어둠과' },
              { chunkEn: 'and chilling temperatures,', chunkKo: '차가운 수온에도 불구하고,' },
              { chunkEn: 'this oceanic layer harbors', chunkKo: '이 해양층은 품고 있다' },
              { chunkEn: 'an immense biomass', chunkKo: '막대한 생물량을' },
              { chunkEn: 'exceeding that of all global commercial fisheries combined.', chunkKo: '전 세계 상업 어업 전체의 그것을 초과하는.' },
            ],
            grammarTip: 'that of...에서 대명사 that은 단수 명사 biomass를 대신함 (수능 대명사 일치 문제 단골).',
          },
          {
            sentenceEn: 'Every night, billions of mesopelagic organisms undertake a synchronized vertical migration toward surface waters to feed, retreating to the abyss at dawn to avoid visual predators.',
            chunks: [
              { chunkEn: 'Every night, billions of mesopelagic organisms', chunkKo: '매일 밤 수십억의 중광대 유기체들은' },
              { chunkEn: 'undertake a synchronized vertical migration', chunkKo: '동기화된(일제한) 수직 이동을 수행한다' },
              { chunkEn: 'toward surface waters to feed,', chunkKo: '먹이를 섭취하기 위해 표층수를 향해,' },
              { chunkEn: 'retreating to the abyss at dawn', chunkKo: '새벽에는 심연으로 후퇴하면서' },
              { chunkEn: 'to avoid visual predators.', chunkKo: '시각적 포식자들을 피하기 위해.' },
            ],
            grammarTip: 'undertake (~을 착수하다/수행하다), synchronized (동기화된), retreating (분사구문).',
          },
          {
            sentenceEn: 'This monumental biological cycle acts as a colossal biological pump, actively transporting surface carbon into the ocean interior.',
            chunks: [
              { chunkEn: 'This monumental biological cycle acts as', chunkKo: '이 기념비적인 생물학적 주기는 역할을 한다' },
              { chunkEn: 'a colossal biological pump,', chunkKo: '거대한 생물학적 펌프로서,' },
              { chunkEn: 'actively transporting surface carbon', chunkKo: '표층의 탄소를 능동적으로 수송하면서' },
              { chunkEn: 'into the ocean interior.', chunkKo: '해양 내부로.' },
            ],
            grammarTip: 'actively transporting... (능동 분사구문). colossal (거대한).',
          },
          {
            sentenceEn: 'By sequestering millions of tons of atmospheric carbon into the deep ocean floor for centuries, the twilight zone serves as an indispensable natural regulator of Earth’s climate system.',
            chunks: [
              { chunkEn: 'By sequestering millions of tons of atmospheric carbon', chunkKo: '수백만 톤의 대기 탄소를 격리함으로써' },
              { chunkEn: 'into the deep ocean floor for centuries,', chunkKo: '수 세기 동안 깊은 해저로,' },
              { chunkEn: 'the twilight zone serves as', chunkKo: '황혼대는 역할을 한다' },
              { chunkEn: 'an indispensable natural regulator', chunkKo: '필수불가결한 자연 조절자로서' },
              { chunkEn: 'of Earth’s climate system.', chunkKo: '지구 기후 시스템의.' },
            ],
            grammarTip: 'By + -ing (~함으로써). indispensable (없어서는 안 될, 필수적인).',
          },
        ],
      },
    ],
    vocabulary: [
      {
        word: 'perpetual',
        phonetic: '/pərˈpetʃuəl/',
        partOfSpeech: 'adj.',
        meaningKo: '영구적인, 끊임없는',
        exampleEn: 'The polar regions experience perpetual daylight during summer.',
        exampleKo: '극지방은 여름 동안 끊임없는 백야를 경험한다.',
        synonyms: ['continuous', 'everlasting', 'endless'],
        csatImportance: '⭐⭐⭐ (필수)',
      },
      {
        word: 'harbor',
        phonetic: '/ˈhɑːrbər/',
        partOfSpeech: 'v.',
        meaningKo: '(생각·생물을) 품다, 서식처를 제공하다',
        exampleEn: 'Deep caves harbor undiscovered bacterial species.',
        exampleKo: '깊은 동굴은 미발견된 박테리아 종들을 품고 있다.',
        synonyms: ['shelter', 'contain', 'host'],
        csatImportance: '⭐⭐ (빈출)',
      },
      {
        word: 'synchronized',
        phonetic: '/ˈsɪŋkrənaɪzd/',
        partOfSpeech: 'adj.',
        meaningKo: '동시에 일어나는, 일제히 조율된',
        exampleEn: 'The dancers moved with synchronized precision.',
        exampleKo: '무용수들은 일제히 조율된 정확성으로 움직였다.',
        synonyms: ['coordinated', 'simultaneous'],
        csatImportance: '⭐⭐ (빈출)',
      },
      {
        word: 'sequester',
        phonetic: '/sɪˈkwestər/',
        partOfSpeech: 'v.',
        meaningKo: '(탄소 등을) 격리하다, 가두다, 압류하다',
        exampleEn: 'Forests sequester immense quantities of carbon dioxide.',
        exampleKo: '숲은 막대한 양의 이산화탄소를 격리한다.',
        synonyms: ['isolate', 'trap', 'confine'],
        csatImportance: '⭐⭐⭐ (필수)',
      },
      {
        word: 'colossal',
        phonetic: '/kəˈlɑːsl/',
        partOfSpeech: 'adj.',
        meaningKo: '거대한, 엄청난',
        exampleEn: 'The construction project required a colossal budget.',
        exampleKo: '그 건설 프로젝트는 막대한 예산을 필요로 했다.',
        synonyms: ['gigantic', 'enormous', 'immense'],
        csatImportance: '⭐⭐ (빈출)',
      },
    ],
    questions: [
      {
        id: 'q1-ocean',
        type: '빈칸추론',
        questionEn: 'Based on the passage, the vertical migration of mesopelagic organisms is ecologically crucial because it ________.',
        questionKo: '본문에 따를 때, 중광대 유기체들의 수직 이동이 생태학적으로 중요한 이유는 그것이 _________ 하기 때문이다.',
        options: [
          { num: 1, text: 'transfers substantial carbon from surface layers into the deep ocean' },
          { num: 2, text: 'heats up the freezing temperatures of the ocean twilight zone' },
          { num: 3, text: 'prevents global commercial fisheries from operating at night' },
          { num: 4, text: 'eliminates the need for sunlight in photosynthesis' },
          { num: 5, text: 'destroys the existing deep ocean geological formations' },
        ],
        correctAnswer: 1,
        explanation: '본문 후반부에서 수십억 마리의 생물들이 매일 밤 표층으로 올라와 먹이를 먹고 심해로 돌아가며 수백만 톤의 대기 탄소를 해저로 격리(sequestering carbon into the deep ocean floor)하는 생물학적 펌프 역할을 한다고 명시되어 있으므로 ①번이 정답입니다.',
        tip: '수능 지문 핵심 연결고리: vertical migration -> biological pump -> carbon sequestration.',
      },
    ],
    writingOrSummaryTask: {
      prompt: 'Explain the role of the ocean twilight zone as a biological pump in 1-2 Korean sentences.',
      guide: '중광대 생물의 수직 이동과 탄소 격리 사이의 관계를 서술하세요.',
      modelAnswer: '중광대 생물들이 매일 밤 표층으로 올라와 섭취한 탄소를 새벽에 심해로 운반함으로써, 대기 중 탄소를 심해 바닥에 장기간 격리하는 거대한 펌프 역할을 합니다.',
    },
    createdAt: '2025-01-13T00:00:00Z',
  },
  {
    id: 'passage-psych-05',
    title: 'The Dunning-Kruger Paradox: The Cognitive Blind Spot of Incompetence',
    titleKo: '더닝-크루거의 역설: 무능이 빚어내는 인지적 맹점',
    category: 'psychology',
    level: '고1 기초',
    wordCount: 162,
    readTimeMinutes: 3,
    source: '고1 전국연합학력평가 변형 / 심리학 상식',
    backgroundKnowledge: '지식이 부족한 초보자는 자신의 한계를 인식할 메타인지(Metacognition)가 없어 오히려 근거 없는 과도한 자신감을 가지게 되는 반면, 전문가는 알면 알수록 자신의 부족함을 절감하는 현상입니다.',
    paragraphs: [
      {
        paragraphNumber: 1,
        textEn: 'In 1999, psychologists David Dunning and Justin Kruger identified a fascinating cognitive bias in human self-assessment. Individuals possessing minimal expertise in a given discipline consistently overestimate their competence, displaying profound overconfidence. This phenomenon stems from a double deficit: lack of skill not only leads to substandard performance, but also deprives individuals of the metacognitive ability to recognize their own errors. Because incompetent performers cannot distinguish between good and bad work, they remain blissfully unaware of their shortcomings. Conversely, genuine experts frequently underestimate their relative proficiency, falsely presuming that tasks effortless for them are equally simple for others. True intellectual maturity, therefore, begins with the humility of recognizing the boundaries of one\'s own knowledge.',
        textKo: '1999년 심리학자 데이비드 더닝과 저스틴 크루거는 인간의 자기 평가에서 흥미로운 인지 편향을 확인했습니다. 특정 분야에 최소한의 전문 지식만을 가진 사람들은 일관되게 자신의 능력을 과대평가하며 엄청난 과신을 드러냅니다. 이러한 현상은 이중 결함에서 기인합니다. 기술의 부족은 수준 이하의 성과를 낳을 뿐만 아니라, 자신의 실수를 인식할 수 있는 메타인지 능력마저 박탈하기 때문입니다. 무능한 수행자들은 훌륭한 작업과 미흡한 작업을 구별할 수 없기 때문에, 자신의 결점을 전혀 모르는 상태로 남아있게 됩니다. 반대로 진정한 전문가들은 자주 자신의 상대적인 능숙함을 과소평가하며, 자신에게 수월한 과업이 타인에게도 똑같이 단순할 것이라고 잘못 추정합니다. 그러므로 진정한 지적 성숙은 자신의 지식의 한계를 인식하는 겸손함에서 시작됩니다.',
        sentenceBreakdown: [
          {
            sentenceEn: 'In 1999, psychologists David Dunning and Justin Kruger identified a fascinating cognitive bias in human self-assessment.',
            chunks: [
              { chunkEn: 'In 1999, psychologists David Dunning and Justin Kruger', chunkKo: '1999년 심리학자 데이비드 더닝과 저스틴 크루거는' },
              { chunkEn: 'identified a fascinating cognitive bias', chunkKo: '흥미로운 인지 편향을 확인했다' },
              { chunkEn: 'in human self-assessment.', chunkKo: '인간의 자기 평가에서.' },
            ],
            grammarTip: 'bias (편향, 선입견), self-assessment (자기 평가).',
          },
          {
            sentenceEn: 'Individuals possessing minimal expertise in a given discipline consistently overestimate their competence, displaying profound overconfidence.',
            chunks: [
              { chunkEn: 'Individuals possessing minimal expertise', chunkKo: '최소한의 전문성을 지닌 개인들은' },
              { chunkEn: 'in a given discipline', chunkKo: '주어진 분야에서' },
              { chunkEn: 'consistently overestimate their competence,', chunkKo: '일관되게 자신의 능력을 과대평가하며,' },
              { chunkEn: 'displaying profound overconfidence.', chunkKo: '깊은 과신을 드러낸다.' },
            ],
            grammarTip: 'possessing (능동 분사 수식), displaying (분사구문 부대상황).',
          },
          {
            sentenceEn: 'This phenomenon stems from a double deficit: lack of skill not only leads to substandard performance, but also deprives individuals of the metacognitive ability to recognize their own errors.',
            chunks: [
              { chunkEn: 'This phenomenon stems from a double deficit:', chunkKo: '이 현상은 이중 결함에서 비롯된다:' },
              { chunkEn: 'lack of skill not only leads to', chunkKo: '기술의 부족은 ~로 이어질 뿐만 아니라' },
              { chunkEn: 'substandard performance,', chunkKo: '기준 이하의 성과,' },
              { chunkEn: 'but also deprives individuals', chunkKo: '개인들에게서 박탈하기도 한다' },
              { chunkEn: 'of the metacognitive ability', chunkKo: '메타인지적 능력을' },
              { chunkEn: 'to recognize their own errors.', chunkKo: '자신의 오류를 인식할 수 있는.' },
            ],
            grammarTip: 'deprive A of B: A에게서 B를 박탈하다 (수능 빈출 숙어).',
          },
          {
            sentenceEn: 'Because incompetent performers cannot distinguish between good and bad work, they remain blissfully unaware of their shortcomings.',
            chunks: [
              { chunkEn: 'Because incompetent performers cannot distinguish', chunkKo: '무능한 수행자들은 구별할 수 없기 때문에' },
              { chunkEn: 'between good and bad work,', chunkKo: '좋은 작업과 나쁜 작업 사이를,' },
              { chunkEn: 'they remain blissfully unaware', chunkKo: '그들은 더없이 행복하게 인식하지 못하는 상태로 남는다' },
              { chunkEn: 'of their shortcomings.', chunkKo: '자신들의 결점을.' },
            ],
            grammarTip: 'distinguish between A and B (A와 B를 구별하다), unaware of (~을 모르는/인식하지 못하는).',
          },
          {
            sentenceEn: 'Conversely, genuine experts frequently underestimate their relative proficiency, falsely presuming that tasks effortless for them are equally simple for others.',
            chunks: [
              { chunkEn: 'Conversely, genuine experts', chunkKo: '반대로 진정한 전문가들은' },
              { chunkEn: 'frequently underestimate their relative proficiency,', chunkKo: '자주 자신의 상대적 능숙함을 과소평가한다,' },
              { chunkEn: 'falsely presuming that', chunkKo: '잘못 추정하면서' },
              { chunkEn: 'tasks effortless for them', chunkKo: '자신에게 수월한 과업이' },
              { chunkEn: 'are equally simple for others.', chunkKo: '타인에게도 똑같이 단순할 것이라고.' },
            ],
            grammarTip: 'Conversely (대조 연결사), presuming that... (분사구문 + 명사절 that).',
          },
          {
            sentenceEn: 'True intellectual maturity, therefore, begins with the humility of recognizing the boundaries of one\'s own knowledge.',
            chunks: [
              { chunkEn: 'True intellectual maturity, therefore,', chunkKo: '진정한 지적 성숙은 그러므로' },
              { chunkEn: 'begins with the humility', chunkKo: '겸손함에서 시작된다' },
              { chunkEn: 'of recognizing the boundaries', chunkKo: '한계를 인식하는' },
              { chunkEn: 'of one\'s own knowledge.', chunkKo: '자신의 지식의.' },
            ],
            grammarTip: 'humility (겸손), boundaries (경계/한계).',
          },
        ],
      },
    ],
    vocabulary: [
      {
        word: 'overestimate',
        phonetic: '/ˌoʊvərˈestɪmeɪt/',
        partOfSpeech: 'v.',
        meaningKo: '과대평가하다',
        exampleEn: 'Do not overestimate your opponent’s weakness.',
        exampleKo: '상대방의 약점을 과대평가하지 마라.',
        synonyms: ['overrate', 'exaggerate'],
        csatImportance: '⭐⭐⭐ (필수)',
      },
      {
        word: 'deficit',
        phonetic: '/ˈdefɪsɪt/',
        partOfSpeech: 'n.',
        meaningKo: '결함, 결손, 적자',
        exampleEn: 'A deficit in vitamin D affects bone health.',
        exampleKo: '비타민 D의 결핍은 뼈 건강에 영향을 미친다.',
        synonyms: ['shortage', 'deficiency', 'lack'],
        csatImportance: '⭐⭐⭐ (필수)',
      },
      {
        word: 'deprive',
        phonetic: '/dɪˈpraɪv/',
        partOfSpeech: 'v.',
        meaningKo: '박탈하다, 빼앗다',
        exampleEn: 'Sleep deprivation impairs cognitive function.',
        exampleKo: '수면 박탈은 인지 기능을 저하시킨다.',
        synonyms: ['strip', 'rob', 'divest'],
        csatImportance: '⭐⭐⭐ (필수)',
      },
      {
        word: 'humility',
        phonetic: '/hjuːˈmɪləti/',
        partOfSpeech: 'n.',
        meaningKo: '겸손, 겸허',
        exampleEn: 'Great leaders often display genuine humility.',
        exampleKo: '위대한 지도자들은 종종 진정한 겸손을 보여준다.',
        synonyms: ['modesty', 'meekness'],
        csatImportance: '⭐⭐ (빈출)',
      },
    ],
    questions: [
      {
        id: 'q1-psych',
        type: '요약문 완성',
        questionEn: 'According to the passage, novices tend to be overconfident because they lack the (A)________ to evaluate their incompetence, whereas experts often (B)________ their own mastery.',
        questionKo: '다음 요약문의 빈칸 (A), (B)에 들어갈 말로 가장 적절한 것은?',
        options: [
          { num: 1, text: '(A) metacognition / (B) underestimate' },
          { num: 2, text: '(A) enthusiasm / (B) exaggerate' },
          { num: 3, text: '(A) memory / (B) publicize' },
          { num: 4, text: '(A) confidence / (B) neglect' },
          { num: 5, text: '(A) patience / (B) celebrate' },
        ],
        correctAnswer: 1,
        explanation: '초보자는 자신의 무능을 인지할 메타인지(metacognition)가 부족하여 과신하고, 반대로 전문가는 자신의 숙련도를 과소평가(underestimate)하므로 ①번이 정답입니다.',
        tip: '수능 40번 요약문 빈출 패턴: 대조적 두 집단의 인지적 메커니즘 빈칸 채우기.',
      },
    ],
    writingOrSummaryTask: {
      prompt: 'State what "double deficit" refers to in the text.',
      guide: '본문에 언급된 "이중 결함"의 두 가지 요소를 요약하세요.',
      modelAnswer: 'It refers to having poor performance due to a lack of skill and lacking the metacognitive ability to recognize that incompetence.',
    },
    createdAt: '2025-01-14T00:00:00Z',
  },
  {
    id: 'passage-art-06',
    title: 'Biophilic Architecture: Reconnecting Concrete Cities to Living Nature',
    titleKo: '바이오필릭 건축: 콘크리트 도시와 살아 숨 쉬는 자연의 재연결',
    category: 'art',
    level: '고2 실력',
    wordCount: 168,
    readTimeMinutes: 4,
    source: '수능특강 영어독해연습 변형 / 건축 및 생태학',
    backgroundKnowledge: '에드워드 윌슨의 \'바이오필리아(Biophilia)\' 가설에 기반한 바이오필릭 디자인은 단순히 화분을 놓는 수준을 넘어, 자연광, 바람, 식생, 천연 재료를 건축 구조물 자체에 융합하여 인간의 스트레스를 줄이고 도시 생태계를 복원하는 현대 건축 사조입니다.',
    paragraphs: [
      {
        paragraphNumber: 1,
        textEn: 'For over a century, urban architecture prioritized sterile functionality, erecting towering monoliths of steel and reinforced concrete that alienated inhabitants from the natural biosphere. In response to mounting empirical evidence linking urban alienation to elevated psychological distress, biophilic architecture has emerged as a transformative paradigm. By seamlessly integrating dynamic daylighting, natural ventilation corridors, and vertical living walls into structural designs, biophilic spaces demonstrably attenuate stress hormones and stimulate cognitive productivity. Incorporating living vegetation and organic geometries within built environments fosters an innate sense of connection termed biophilia. Architecture is thereby revitalized not merely as static shelter, but as a living ecosystem that nurtures human well-being and restores urban ecological harmony.',
        textKo: '1세기 넘게 도시 건축은 무미건조한 기능성을 우선시하여 거주자들을 자연 생물권으로부터 소외시키는 철골과 철근 콘크리트의 우뚝 솟은 거대 구조물들을 세워왔습니다. 도시적 소외를 높은 심리적 고통과 연관 짓는 실증적 증거가 증가함에 따라, 바이오필릭 건축이 혁신적인 패러다임으로 등장했습니다. 역동적인 자연 채광, 자연 환기 회랑, 그리고 수직 녹화 벽을 구조 설계에 매끄럽게 통합함으로써, 바이오필릭 공간은 스트레스 호르몬을 명백히 감소시키고 인지적 생산성을 자극합니다. 건축 환경 내에 살아있는 식생과 유기적 기하학 구조를 포함하는 것은 바이오필리아라 불리는 타고난 연결감을 함양합니다. 건축은 이로써 단순한 정적 주거지가 아니라 인간의 웰빙을 육성하고 도시 생태적 조화를 복원하는 살아 숨 쉬는 생태계로 거듭나게 됩니다.',
        sentenceBreakdown: [
          {
            sentenceEn: 'For over a century, urban architecture prioritized sterile functionality, erecting towering monoliths of steel and reinforced concrete that alienated inhabitants from the natural biosphere.',
            chunks: [
              { chunkEn: 'For over a century,', chunkKo: '1세기가 넘는 동안,' },
              { chunkEn: 'urban architecture prioritized sterile functionality,', chunkKo: '도시 건축은 불모의(삭막한) 기능성을 우선시했다,' },
              { chunkEn: 'erecting towering monoliths', chunkKo: '우뚝 솟은 거대 건축물들을 세우면서' },
              { chunkEn: 'of steel and reinforced concrete', chunkKo: '강철과 철근 콘크리트의' },
              { chunkEn: 'that alienated inhabitants', chunkKo: '거주자들을 소외시켰던' },
              { chunkEn: 'from the natural biosphere.', chunkKo: '자연 생물권으로부터.' },
            ],
            grammarTip: 'erecting (분사구문), alienate A from B (A를 B로부터 소외시키다).',
          },
          {
            sentenceEn: 'In response to mounting empirical evidence linking urban alienation to elevated psychological distress, biophilic architecture has emerged as a transformative paradigm.',
            chunks: [
              { chunkEn: 'In response to mounting empirical evidence', chunkKo: '증가하는 실증적 증거에 부응하여' },
              { chunkEn: 'linking urban alienation', chunkKo: '도시적 소외를 연결짓는' },
              { chunkEn: 'to elevated psychological distress,', chunkKo: '고조된 심리적 고통과,' },
              { chunkEn: 'biophilic architecture has emerged', chunkKo: '바이오필릭 건축이 등장했다' },
              { chunkEn: 'as a transformative paradigm.', chunkKo: '변혁적인 패러다임으로서.' },
            ],
            grammarTip: 'mounting (증가하는 = increasing), link A to B (A를 B에 결합시키다).',
          },
          {
            sentenceEn: 'By seamlessly integrating dynamic daylighting, natural ventilation corridors, and vertical living walls into structural designs, biophilic spaces demonstrably attenuate stress hormones and stimulate cognitive productivity.',
            chunks: [
              { chunkEn: 'By seamlessly integrating', chunkKo: '매끄럽게 통합함으로써' },
              { chunkEn: 'dynamic daylighting, natural ventilation corridors,', chunkKo: '역동적 자연 채광, 자연 통풍 회랑,' },
              { chunkEn: 'and vertical living walls', chunkKo: '그리고 수직 식생 벽들을' },
              { chunkEn: 'into structural designs,', chunkKo: '구조적 설계 안으로,' },
              { chunkEn: 'biophilic spaces demonstrably attenuate stress hormones', chunkKo: '바이오필릭 공간은 입증 가능하게 스트레스 호르몬을 완화하고' },
              { chunkEn: 'and stimulate cognitive productivity.', chunkKo: '인지적 생산성을 자극한다.' },
            ],
            grammarTip: 'attenuate (약화시키다/줄이다 - 고난도 어휘), by + -ing (~함으로써).',
          },
          {
            sentenceEn: 'Incorporating living vegetation and organic geometries within built environments fosters an innate sense of connection termed biophilia.',
            chunks: [
              { chunkEn: 'Incorporating living vegetation', chunkKo: '살아있는 식생과' },
              { chunkEn: 'and organic geometries', chunkKo: '유기적 기하학적 형태들을 결합하는 것은' },
              { chunkEn: 'within built environments', chunkKo: '건축 환경 내에' },
              { chunkEn: 'fosters an innate sense of connection', chunkKo: '타고난 연결감을 촉진한다' },
              { chunkEn: 'termed biophilia.', chunkKo: '바이오필리아라 칭해지는.' },
            ],
            grammarTip: '동명사 주어 Incorporating... 단수 동사 fosters. termed (과거분사 수식).',
          },
          {
            sentenceEn: 'Architecture is thereby revitalized not merely as static shelter, but as a living ecosystem that nurtures human well-being and restores urban ecological harmony.',
            chunks: [
              { chunkEn: 'Architecture is thereby revitalized', chunkKo: '건축은 그것에 의해 재활성화된다' },
              { chunkEn: 'not merely as static shelter,', chunkKo: '단지 정적인 쉼터로서가 아니라,' },
              { chunkEn: 'but as a living ecosystem', chunkKo: '살아있는 생태계로서' },
              { chunkEn: 'that nurtures human well-being', chunkKo: '인간의 웰빙을 육성하고' },
              { chunkEn: 'and restores urban ecological harmony.', chunkKo: '도시의 생태적 조화를 복원하는.' },
            ],
            grammarTip: 'not merely A but B (A뿐만 아니라 B도), that (주격 관계대명사).',
          },
        ],
      },
    ],
    vocabulary: [
      {
        word: 'sterile',
        phonetic: '/ˈsterəl/',
        partOfSpeech: 'adj.',
        meaningKo: '살균된, 삭막한, 개성이 없는',
        exampleEn: 'The modern office looked sterile and devoid of warmth.',
        exampleKo: '그 현대적인 사무실은 삭막하고 온기가 없어 보였다.',
        synonyms: ['barren', 'cold', 'lifeless'],
        csatImportance: '⭐⭐ (빈출)',
      },
      {
        word: 'alienate',
        phonetic: '/ˈeɪliəneɪt/',
        partOfSpeech: 'v.',
        meaningKo: '소외시키다, 멀어지게 하다',
        exampleEn: 'Strict policies may alienate young workers.',
        exampleKo: '엄격한 정책은 젊은 근로자들을 소외시킬 수 있다.',
        synonyms: ['isolate', 'estrange', 'distance'],
        csatImportance: '⭐⭐⭐ (필수)',
      },
      {
        word: 'attenuate',
        phonetic: '/əˈtenjueɪt/',
        partOfSpeech: 'v.',
        meaningKo: '약화시키다, 완화하다, 줄이다',
        exampleEn: 'Earplugs attenuate external industrial noises.',
        exampleKo: '귀마개는 외부 산업 소음을 감쇠시킨다.',
        synonyms: ['weaken', 'reduce', 'diminish'],
        csatImportance: '⭐⭐⭐ (필수)',
      },
      {
        word: 'seamlessly',
        phonetic: '/ˈsiːmləsli/',
        partOfSpeech: 'adv.',
        meaningKo: '매끄럽게, 이음새 없이 완벽하게',
        exampleEn: 'The software integrates seamlessly with mobile devices.',
        exampleKo: '그 소프트웨어는 모바일 기기와 매끄럽게 연동된다.',
        synonyms: ['smoothly', 'flawlessly'],
        csatImportance: '⭐⭐ (빈출)',
      },
    ],
    questions: [
      {
        id: 'q1-art',
        type: '빈칸추론',
        questionEn: 'Biophilic architecture fundamentally challenges conventional urban construction by treating buildings as ________.',
        questionKo: '바이오필릭 건축은 건물을 _________ 로 취급함으로써 전통적인 도시 건축에 근본적으로 도전한다.',
        options: [
          { num: 1, text: 'isolated monuments preserving sterile industrial machinery' },
          { num: 2, text: 'living ecosystems promoting psychological well-being and nature connectivity' },
          { num: 3, text: 'disposable structures designed strictly for economic profit' },
          { num: 4, text: 'monolithic barriers shielding citizens from all weather conditions' },
          { num: 5, text: 'substitutes for natural forests to eliminate environmental legislation' },
        ],
        correctAnswer: 2,
        explanation: '바이오필릭 건축은 과거의 삭막한 콘크리트 구조물에서 벗어나 자연광, 환기, 식생을 융합하여 인간의 심리적 건강과 인지 생산성을 증진하는 살아있는 생태계(living ecosystem)로 공간을 탈바꿈하므로 ②번이 정답입니다.',
        tip: '수능 주제 일치 비결: 핵심 키워드인 ecosystem과 psychological well-being의 결합.',
      },
    ],
    writingOrSummaryTask: {
      prompt: 'Describe two architectural features utilized in biophilic design to reconnect people with nature.',
      guide: '바이오필릭 디자인에서 자연과의 연결을 위해 활용되는 건축 요소 2가지를 서술하세요.',
      modelAnswer: 'Biophilic architecture utilizes elements such as dynamic daylighting, natural ventilation corridors, and vertical living walls.',
    },
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'passage-spider-07',
    title: 'The Biomimetic Wonder of Spider Silk',
    titleKo: '스파이더 실크의 생체모방 공학: 자연이 빚은 기적의 거미줄',
    category: 'science',
    level: '중3 기본 (중학 심화)',
    wordCount: 152,
    readTimeMinutes: 3,
    source: '중등 교과서 심화 / 생체모방 바이오 공학',
    backgroundKnowledge: '거미줄(Spider Silk)은 같은 두께의 강철보다 5배 강하고 나일론보다 훨씬 유연합니다. 과학자들은 이러한 거미줄의 단백질 구조를 모방하여 방탄복, 친환경 의료용 봉합사, 인공 힘줄 등 다양한 미래 기술을 개발하고 있습니다.',
    paragraphs: [
      {
        paragraphNumber: 1,
        textEn: 'Spider silk is often hailed as one of the most remarkable materials in the natural world. Although it appears fragile to the naked eye, a single strand of spider dragline silk is proportionally five times stronger than high-grade steel and significantly more elastic than synthetic nylon. This extraordinary combination of tensile strength and elasticity allows spider webs to absorb the dynamic impact of flying prey without breaking. Biomimetic engineers are currently deciphering the complex protein sequences of spider silk to manufacture biodegradable medical sutures and lightweight protective armor. By learning from nature’s microscopic architect, modern materials science is developing innovative and sustainable technologies for the future.',
        textKo: '거미줄은 종종 자연계에서 가장 놀라운 물질 중 하나로 칭송받습니다. 육안으로 보기에는 연약해 보이지만, 거미 견인실의 단일 가닥은 비율적으로 고급 강철보다 5배 더 강하며 합성 나일론보다 훨씬 더 탄력적입니다. 인장 강도와 탄력성의 이 놀라운 결합은 거미줄이 찢어지지 않고 날아오는 먹잇감의 역동적인 충격을 흡수할 수 있게 해줍니다. 생체모방 공학자들은 생분해성 의료용 봉합사와 경량 방호복을 제조하기 위해 현재 거미줄의 복잡한 단백질 서열을 해독하고 있습니다. 자연의 미세한 건축가로부터 배움으로써, 현대 재료과학은 미래를 위한 혁신적이고 지속 가능한 기술들을 개발하고 있습니다.',
        sentenceBreakdown: [
          {
            sentenceEn: 'Spider silk is often hailed as one of the most remarkable materials in the natural world.',
            chunks: [
              { chunkEn: 'Spider silk is often hailed as', chunkKo: '거미줄은 종종 ~로 칭송받는다' },
              { chunkEn: 'one of the most remarkable materials', chunkKo: '가장 놀라운 물질들 중 하나로서' },
              { chunkEn: 'in the natural world.', chunkKo: '자연계에서.' },
            ],
            grammarTip: 'one of the + 최상급 + 복수명사: 가장 ~한 것들 중 하나 (be hailed as: ~로 칭송받다)',
          },
          {
            sentenceEn: 'Although it appears fragile to the naked eye, a single strand of spider dragline silk is proportionally five times stronger than high-grade steel and significantly more elastic than synthetic nylon.',
            chunks: [
              { chunkEn: 'Although it appears fragile', chunkKo: '비록 연약해 보일지라도' },
              { chunkEn: 'to the naked eye,', chunkKo: '육안으로 보기에,' },
              { chunkEn: 'a single strand of spider dragline silk', chunkKo: '거미 견인실의 단일 가닥은' },
              { chunkEn: 'is proportionally five times stronger', chunkKo: '비율적으로 5배 더 강하다' },
              { chunkEn: 'than high-grade steel', chunkKo: '고급 강철보다' },
              { chunkEn: 'and significantly more elastic than synthetic nylon.', chunkKo: '그리고 합성 나일론보다 훨씬 더 탄력적이다.' },
            ],
            grammarTip: '배수사 + 비교급 + than: five times stronger than (~보다 5배 더 강한). to the naked eye (육안으로).',
          },
          {
            sentenceEn: 'This extraordinary combination of tensile strength and elasticity allows spider webs to absorb the dynamic impact of flying prey without breaking.',
            chunks: [
              { chunkEn: 'This extraordinary combination', chunkKo: '이 비범한 결합은' },
              { chunkEn: 'of tensile strength and elasticity', chunkKo: '인장 강도와 탄력성의' },
              { chunkEn: 'allows spider webs to absorb', chunkKo: '거미줄이 흡수하도록 허용한다' },
              { chunkEn: 'the dynamic impact of flying prey', chunkKo: '날아다니는 먹잇감의 역동적 충격을' },
              { chunkEn: 'without breaking.', chunkKo: '끊어지지 않고.' },
            ],
            grammarTip: 'allow + 목적어 + to부정사 (5형식 구문: 목적어가 ~하도록 허용하다).',
          },
          {
            sentenceEn: 'Biomimetic engineers are currently deciphering the complex protein sequences of spider silk to manufacture biodegradable medical sutures and lightweight protective armor.',
            chunks: [
              { chunkEn: 'Biomimetic engineers are currently deciphering', chunkKo: '생체모방 공학자들은 현재 해독하고 있다' },
              { chunkEn: 'the complex protein sequences of spider silk', chunkKo: '거미줄의 복잡한 단백질 서열을' },
              { chunkEn: 'to manufacture biodegradable medical sutures', chunkKo: '생분해성 의료 봉합사를 제조하기 위해' },
              { chunkEn: 'and lightweight protective armor.', chunkKo: '그리고 경량 방호복을.' },
            ],
            grammarTip: 'to manufacture: 목적을 나타내는 to부정사의 부사적 용법 (~하기 위해). biodegradable: 생분해성의.',
          },
          {
            sentenceEn: 'By learning from nature’s microscopic architect, modern materials science is developing innovative and sustainable technologies for the future.',
            chunks: [
              { chunkEn: 'By learning from nature’s microscopic architect,', chunkKo: '자연의 미세한 건축가로부터 배움으로써,' },
              { chunkEn: 'modern materials science is developing', chunkKo: '현대 재료과학은 개발하고 있다' },
              { chunkEn: 'innovative and sustainable technologies', chunkKo: '혁신적이고 지속 가능한 기술들을' },
              { chunkEn: 'for the future.', chunkKo: '미래를 위해.' },
            ],
            grammarTip: 'By + -ing (~함으로써). sustainable (지속 가능한).',
          },
        ],
      },
    ],
    vocabulary: [
      {
        word: 'remarkable',
        phonetic: '/rɪˈmɑːrkəbl/',
        partOfSpeech: 'adj.',
        meaningKo: '놀라운, 주목할 만한',
        exampleEn: 'The young scientist made a remarkable discovery.',
        exampleKo: '그 젊은 과학자는 놀라운 발견을 해냈다.',
        synonyms: ['extraordinary', 'outstanding', 'impressive'],
        csatImportance: '⭐⭐⭐ (필수)',
      },
      {
        word: 'elastic',
        phonetic: '/ɪˈlæstɪk/',
        partOfSpeech: 'adj.',
        meaningKo: '탄력 있는, 유연한, 신축성 있는',
        exampleEn: 'Spider silk is extraordinarily elastic.',
        exampleKo: '거미줄은 대단히 탄력적이다.',
        synonyms: ['flexible', 'resilient', 'stretchable'],
        csatImportance: '⭐⭐ (빈출)',
      },
      {
        word: 'decipher',
        phonetic: '/dɪˈsaɪfər/',
        partOfSpeech: 'v.',
        meaningKo: '해독하다, 판독하다',
        exampleEn: 'Researchers are trying to decipher ancient symbols.',
        exampleKo: '연구자들은 고대 상징을 해독하려고 노력하고 있다.',
        synonyms: ['decode', 'unravel', 'interpret'],
        csatImportance: '⭐⭐ (빈출)',
      },
      {
        word: 'biodegradable',
        phonetic: '/ˌbaɪoʊdɪˈɡreɪdəbl/',
        partOfSpeech: 'adj.',
        meaningKo: '생분해성의, 자연 분해되는',
        exampleEn: 'We should use biodegradable materials to protect nature.',
        exampleKo: '우리는 자연을 보호하기 위해 생분해성 물질을 사용해야 한다.',
        synonyms: ['eco-friendly', 'decomposable'],
        csatImportance: '⭐⭐⭐ (필수)',
      },
    ],
    questions: [
      {
        id: 'q1-spider',
        type: '내용 일치',
        questionEn: 'According to the passage, which of the following is TRUE about spider silk?',
        questionKo: '다음 글의 내용과 일치하는 것은?',
        options: [
          { num: 1, text: 'It is heavier and more brittle than artificial nylon.' },
          { num: 2, text: 'It is proportionally five times stronger than high-grade steel.' },
          { num: 3, text: 'It cannot be decomposed naturally by biological organisms.' },
          { num: 4, text: 'It has lost its industrial value due to modern synthetic plastics.' },
          { num: 5, text: 'It is composed purely of inorganic mineral elements.' },
        ],
        correctAnswer: 2,
        explanation: '본문에서 "a single strand of spider dragline silk is proportionally five times stronger than high-grade steel"이라고 명시되어 있으므로 ②번이 일치합니다.',
        tip: '비교급 표현과 proportion(비율) 수치 정확히 파악하기.',
      },
    ],
    writingOrSummaryTask: {
      prompt: 'State two practical applications of synthetic spider silk mentioned in the text.',
      guide: '지문에 언급된 합성 거미줄의 실용적 활용 분야 2가지를 서술하세요.',
      modelAnswer: 'Biodegradable medical sutures and lightweight protective armor.',
    },
    createdAt: '2025-01-16T00:00:00Z',
  },
  {
    id: 'passage-bees-08',
    title: 'The Secret Waggle Dance of Honeybees',
    titleKo: '꿀벌들의 비밀 댄스 언어: 몸짓으로 나누는 소통',
    category: 'science',
    level: '초등 고학년 · 중1 기초',
    wordCount: 145,
    readTimeMinutes: 3,
    source: '초·중등 교과 연계 / 동물 행동학',
    backgroundKnowledge: '노벨 생리의학상을 수상한 카를 폰 프리슈(Karl von Frisch)의 발견에 따르면, 꿀벌은 꽃의 위치를 발견하면 벌통으로 돌아와 태양의 각도와 거리를 몸을 흔드는 ‘8자 춤(Waggle Dance)’으로 동료들에게 정확히 전달합니다.',
    paragraphs: [
      {
        paragraphNumber: 1,
        textEn: 'When a foraging honeybee discovers a rich patch of blooming flowers, she does not keep the secret to herself. Instead, she returns to the dark hive and performs an ingenious movement called the waggle dance to communicate the exact location to her nestmates. The angle of the bee’s dance relative to vertical gravity signals the direction toward the sun, while the duration of the waggle indicates the precise distance to the nectar source. By interpreting these dance vibrations in the dark, other bees can navigate straight to the food supply with remarkable accuracy. Through this sophisticated symbolic language, the entire colony cooperates harmoniously to ensure its collective survival.',
        textKo: '먹이를 찾는 꿀벌이 만발한 꽃들이 모여 있는 풍성한 장소를 발견하면, 그녀는 그 비밀을 혼자만 간직하지 않습니다. 대신 어두운 벌통으로 돌아와 동료 벌들에게 정확한 위치를 전달하기 위해 8자 춤(waggle dance)이라 불리는 기발한 몸짓을 수행합니다. 수직 중력에 대한 벌의 춤 각도는 태양을 향한 방향을 신호로 보내고, 몸을 흔드는 지속 시간은 꿀 원천까지의 정확한 거리를 나타냅니다. 어둠 속에서 이러한 춤의 진동을 해석함으로써, 다른 벌들은 놀라운 정확도로 먹이 공급처로 곧장 비행할 수 있습니다. 이러한 정교한 상징적 언어를 통해 전체 벌 군집은 집단 생존을 보장하기 위해 조화롭게 협력합니다.',
        sentenceBreakdown: [
          {
            sentenceEn: 'When a foraging honeybee discovers a rich patch of blooming flowers, she does not keep the secret to herself.',
            chunks: [
              { chunkEn: 'When a foraging honeybee discovers', chunkKo: '먹이를 찾는 꿀벌이 발견할 때' },
              { chunkEn: 'a rich patch of blooming flowers,', chunkKo: '만발한 꽃들의 풍성한 구역을,' },
              { chunkEn: 'she does not keep the secret', chunkKo: '그녀는 비밀을 지키지 않는다' },
              { chunkEn: 'to herself.', chunkKo: '혼자만.' },
            ],
            grammarTip: 'keep A to oneself: A를 남에게 알리지 않고 혼자만 간직하다. foraging (먹이를 찾아다니는).',
          },
          {
            sentenceEn: 'Instead, she returns to the dark hive and performs an ingenious movement called the waggle dance to communicate the exact location to her nestmates.',
            chunks: [
              { chunkEn: 'Instead, she returns to the dark hive', chunkKo: '대신, 그녀는 어두운 벌통으로 돌아가서' },
              { chunkEn: 'and performs an ingenious movement', chunkKo: '기발한 움직임을 수행한다' },
              { chunkEn: 'called the waggle dance', chunkKo: '8자 춤(waggle dance)이라 불리는' },
              { chunkEn: 'to communicate the exact location', chunkKo: '정확한 위치를 전달하기 위해' },
              { chunkEn: 'to her nestmates.', chunkKo: '그녀의 둥지 동료들에게.' },
            ],
            grammarTip: 'called + 명사: ~라고 불리는 (과거분사 수식). communicate A to B: A를 B에게 전달하다.',
          },
          {
            sentenceEn: 'The angle of the bee’s dance relative to vertical gravity signals the direction toward the sun, while the duration of the waggle indicates the precise distance to the nectar source.',
            chunks: [
              { chunkEn: 'The angle of the bee’s dance', chunkKo: '벌 춤의 각도는' },
              { chunkEn: 'relative to vertical gravity', chunkKo: '수직 중력에 상대적인' },
              { chunkEn: 'signals the direction toward the sun,', chunkKo: '태양을 향한 방향을 신호로 보낸다,' },
              { chunkEn: 'while the duration of the waggle', chunkKo: '반면에 흔드는 지속 시간은' },
              { chunkEn: 'indicates the precise distance', chunkKo: '정확한 거리를 나타낸다' },
              { chunkEn: 'to the nectar source.', chunkKo: '꿀 원천까지의.' },
            ],
            grammarTip: 'relative to (~에 상대적으로), while (접속사: 반면에), nectar (꽃꿀).',
          },
          {
            sentenceEn: 'By interpreting these dance vibrations in the dark, other bees can navigate straight to the food supply with remarkable accuracy.',
            chunks: [
              { chunkEn: 'By interpreting these dance vibrations', chunkKo: '이러한 춤의 진동을 해석함으로써' },
              { chunkEn: 'in the dark,', chunkKo: '어둠 속에서,' },
              { chunkEn: 'other bees can navigate straight', chunkKo: '다른 벌들은 곧바로 항해할 수 있다' },
              { chunkEn: 'to the food supply', chunkKo: '먹이 공급처로' },
              { chunkEn: 'with remarkable accuracy.', chunkKo: '놀라운 정확성으로.' },
            ],
            grammarTip: 'By + -ing (~함으로써), with + 추상명사 = 부사구 (with remarkable accuracy = remarkably accurately).',
          },
          {
            sentenceEn: 'Through this sophisticated symbolic language, the entire colony cooperates harmoniously to ensure its collective survival.',
            chunks: [
              { chunkEn: 'Through this sophisticated symbolic language,', chunkKo: '이러한 정교한 상징적 언어를 통해,' },
              { chunkEn: 'the entire colony cooperates harmoniously', chunkKo: '전체 군집은 조화롭게 협력한다' },
              { chunkEn: 'to ensure its collective survival.', chunkKo: '그들의 집단적 생존을 보장하기 위해.' },
            ],
            grammarTip: 'sophisticated (정교한, 세련된), ensure (보장하다, 확실히 하다).',
          },
        ],
      },
    ],
    vocabulary: [
      {
        word: 'ingenious',
        phonetic: '/ɪnˈdʒiːniəs/',
        partOfSpeech: 'adj.',
        meaningKo: '기발한, 독창적인, 영리한',
        exampleEn: 'She proposed an ingenious solution to the problem.',
        exampleKo: '그녀는 그 문제에 기발한 해결책을 제안했다.',
        synonyms: ['clever', 'brilliant', 'creative'],
        csatImportance: '⭐⭐⭐ (필수)',
      },
      {
        word: 'communicate',
        phonetic: '/kəˈmjuːnɪkeɪt/',
        partOfSpeech: 'v.',
        meaningKo: '(정보·감정을) 전달하다, 소통하다',
        exampleEn: 'Dolphins communicate using sound pulses.',
        exampleKo: '돌고래는 음파를 사용하여 소통한다.',
        synonyms: ['convey', 'transmit', 'express'],
        csatImportance: '⭐⭐⭐ (필수)',
      },
      {
        word: 'duration',
        phonetic: '/duˈreɪʃn/',
        partOfSpeech: 'n.',
        meaningKo: '지속 시간, 기간',
        exampleEn: 'The duration of the flight is three hours.',
        exampleKo: '비행 지속 시간은 3시간이다.',
        synonyms: ['period', 'time span', 'length'],
        csatImportance: '⭐⭐ (빈출)',
      },
      {
        word: 'colony',
        phonetic: '/ˈkɑːləni/',
        partOfSpeech: 'n.',
        meaningKo: '(곤충·동물의) 군집, 군락',
        exampleEn: 'Ants live in highly organized colonies.',
        exampleKo: '개미는 고도로 조직화된 군집 속에서 산다.',
        synonyms: ['settlement', 'community', 'swarm'],
        csatImportance: '⭐⭐ (빈출)',
      },
    ],
    questions: [
      {
        id: 'q1-bees',
        type: '주제 추론',
        questionEn: 'What is the main topic of the passage?',
        questionKo: '다음 글의 주된 주제로 가장 적절한 것은?',
        options: [
          { num: 1, text: 'How honeybees communicate flower locations through dance' },
          { num: 2, text: 'The danger of pesticide pollution on bee populations' },
          { num: 3, text: 'Methods for protecting beehives from winter cold' },
          { num: 4, text: 'Why queen bees dominate the entire colony reproduction' },
          { num: 5, text: 'The chemical differences between various honey types' },
        ],
        correctAnswer: 1,
        explanation: '본문은 꿀벌이 먹이가 있는 장소를 발견했을 때 벌통으로 돌아와 각도와 지속 시간(waggle dance)을 통해 방향과 거리를 전달하는 상징적 댄스 소통 방식을 다루고 있으므로 ①번이 정답입니다.',
        tip: '핵심 키워드: honeybees + waggle dance + communicate location.',
      },
    ],
    writingOrSummaryTask: {
      prompt: 'Explain what the angle and duration of the waggle dance represent.',
      guide: '8자 춤의 각도와 지속 시간이 각각 무엇을 나타내는지 서술하세요.',
      modelAnswer: 'The angle represents the direction toward the sun, and the duration indicates the distance to the flowers.',
    },
    createdAt: '2025-01-17T00:00:00Z',
  },
];

export const CURATED_PASSAGES = PRESET_PASSAGES;

export interface LearnerRecommendation {
  recommendedPassages: Passage[];
  reason: string;
  badgeLabel: string;
}

export function getRecommendedPassagesForLearner(
  profile: { name: string; grade?: string; isMomOrAdmin?: boolean } | null | undefined,
  allPassages: Passage[]
): LearnerRecommendation {
  if (!allPassages || allPassages.length === 0) {
    return {
      recommendedPassages: [],
      reason: '등록된 지문이 없습니다.',
      badgeLabel: '추천 지문',
    };
  }

  const name = profile?.name || '학습자';
  const grade = profile?.grade || '';
  const isMom = profile?.isMomOrAdmin || name === '열공마미' || !grade;

  if (isMom) {
    // Top 3 diverse best CSAT passages for Mom/Admin
    const picks = [
      allPassages.find((p) => p.id === 'passage-neuro-01') || allPassages[0],
      allPassages.find((p) => p.id === 'passage-ai-03') || allPassages[1],
      allPassages.find((p) => p.id === 'passage-art-06') || allPassages[2],
    ].filter(Boolean) as Passage[];
    return {
      recommendedPassages: picks,
      reason: '열공마미님을 위한 수능 대표 핵심 지문 & 분석 가이드',
      badgeLabel: '👑 열공마미 베스트 셀렉션',
    };
  }

  if (grade.includes('초등') || grade.includes('중1') || grade.includes('중2') || grade.includes('중3')) {
    const juniorPicks = allPassages.filter(
      (p) =>
        p.level.includes('초등') ||
        p.level.includes('중') ||
        p.level.includes('기초') ||
        p.id === 'passage-bees-08' ||
        p.id === 'passage-spider-07' ||
        p.id === 'passage-psych-05'
    );
    return {
      recommendedPassages: juniorPicks.slice(0, 3),
      reason: `${name} 님의 눈높이에 딱 맞는 중·고등 기본 구문 독해`,
      badgeLabel: `🎯 ${grade} 맞춤 기초 탄탄`,
    };
  }

  if (grade.includes('고1')) {
    const g1Picks = allPassages.filter(
      (p) =>
        p.level.includes('고1') ||
        p.level.includes('기초') ||
        p.level.includes('기본') ||
        p.id === 'passage-psych-05' ||
        p.id === 'passage-spider-07' ||
        p.id === 'passage-ocean-04'
    );
    return {
      recommendedPassages: g1Picks.slice(0, 3),
      reason: `${name} 님의 고1 학력평가 1등급 도약 & 구문 분석`,
      badgeLabel: `🎯 고1 실력 향상 추천`,
    };
  }

  if (grade.includes('고2')) {
    const g2Picks = allPassages.filter(
      (p) =>
        p.level.includes('고2') ||
        p.level.includes('실력') ||
        p.id === 'passage-econ-02' ||
        p.id === 'passage-ocean-04' ||
        p.id === 'passage-art-06'
    );
    return {
      recommendedPassages: g2Picks.slice(0, 3),
      reason: `${name} 님의 고2 EBS 연계 & 실전 독해 완성`,
      badgeLabel: `🎯 고2 실전 완성 추천`,
    };
  }

  // Default: 고3/수능 or N수/심화
  const csatPicks = allPassages.filter(
    (p) =>
      p.level.includes('고3') ||
      p.level.includes('수능') ||
      p.level.includes('킬러') ||
      p.id === 'passage-neuro-01' ||
      p.id === 'passage-ai-03' ||
      p.id === 'passage-econ-02'
  );

  return {
    recommendedPassages: csatPicks.slice(0, 3),
    reason: `${name} 님의 수능 1등급 킬러 문항 대비 실전 독해`,
    badgeLabel: `🕸️ 수능 1등급 킬러 추천`,
  };
}
