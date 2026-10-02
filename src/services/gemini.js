const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-pro',
];

/**
 * Helper to call Google Generative Language API with automatic model fallbacks.
 */
async function callGeminiAPIParts(apiKey, parts, generationConfig = {}) {
  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.85,
            topP: 0.95,
            maxOutputTokens: 3000,
            ...generationConfig,
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const message = errData?.error?.message || `API error ${response.status}`;
        lastError = new Error(message);

        // If it's a model not found / deprecated error, try the next model
        if (response.status === 404 || message.toLowerCase().includes('not found') || message.toLowerCase().includes('no longer available')) {
          console.warn(`Model ${model} unavailable, trying fallback...`);
          continue;
        }

        throw lastError;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return text.trim();
      }
    } catch (err) {
      lastError = err;
      if (err.message && (err.message.includes('API error 404') || err.message.toLowerCase().includes('no longer available'))) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('Failed to communicate with Gemini API.');
}

/**
 * Analyze reference video / audio / text files to learn an influencer's unique writing/speaking style.
 */
export async function analyzeInfluencerStyleWithGemini(apiKey, items = []) {
  if (!apiKey) {
    // Intelligent simulation fallback
    return {
      persona: "Pro Tech & Lifestyle Creator",
      vibe: "High-clarity, charismatic, fast-paced, visually punchy",
      tone: 48,
      avgSentenceLength: 11,
      complexity: "Conversational",
      hookStyle: "Instant visual juxtaposition or curiosity-gap question in first 3s",
      ctaStyle: "Ask a specific debate question in the comments + invite to join inner circle",
      topPhrases: [
        "here is the crazy part",
        "let me break it down",
        "now look closely at this",
        "at the end of the day",
        "drop your thoughts below",
        "this changes everything"
      ],
      frequentWords: [
        { word: "insane", count: 34 },
        { word: "clean", count: 28 },
        { word: "basically", count: 22 },
        { word: "game-changer", count: 20 },
        { word: "smooth", count: 18 },
        { word: "flawless", count: 14 }
      ],
      summary: "Modern, high-energy creator persona with sharp sentence pacing, signature opening curiosity hooks, and relatable conversational authority."
    };
  }

  const parts = [];

  for (const item of items) {
    if (item.data && item.mimeType) {
      parts.push({
        inlineData: {
          mimeType: item.mimeType,
          data: item.data,
        },
      });
    } else if (item.text) {
      parts.push({
        text: `--- REFERENCE CONTENT (${item.name || 'Sample Script/Transcript'}) ---\n${item.text}\n--- END REFERENCE ---`,
      });
    }
  }

  const promptText = `You are an expert AI speech, linguistic, and creator-style analyst.
Analyze the provided reference video/audio/script/transcript content from this content creator/freelancer/influencer.

Extract their unique writing, speaking, and delivery style DNA.

You must return ONLY a valid, raw JSON object (no markdown quotes, no explanation) with the following structure:
{
  "persona": "e.g. Tech Enthusiast & Educator / Casual Lifestyle Vlogger / Punchy Business Coach",
  "vibe": "e.g. Energetic, authentic, rapid-fire, relatable",
  "tone": 45, // numeric score from 0 (ultra-casual/slangy) to 100 (formal/academic)
  "avgSentenceLength": 13, // average number of words per sentence
  "complexity": "Conversational", // "Casual", "Conversational", "Technical", or "Formal"
  "hookStyle": "e.g. Provocative question with a curiosity gap in first 5 seconds",
  "ctaStyle": "e.g. Ask for community opinion in comments and tease next video",
  "topPhrases": [
    "here's the thing",
    "let's break it down",
    "honestly",
    "game-changer",
    "real talk",
    "drop a comment below"
  ],
  "frequentWords": [
    { "word": "awesome", "count": 28 },
    { "word": "literally", "count": 22 },
    { "word": "vibe", "count": 18 },
    { "word": "insane", "count": 16 },
    { "word": "basically", "count": 14 },
    { "word": "clean", "count": 11 }
  ],
  "summary": "Concise 2-sentence summary of what makes this influencer's voice distinctive."
}

Analyze the references and return the JSON object:`;

  parts.push({ text: promptText });

  const rawOutput = await callGeminiAPIParts(apiKey, parts, {
    temperature: 0.2,
  });

  try {
    const cleaned = rawOutput
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse style JSON:', rawOutput, err);
    throw new Error('AI analyzed the references but the response format was invalid. Please try again.');
  }
}

/**
 * Generate a script using the Gemini API tailored to the influencer's learned style.
 */
export async function generateWithGemini(apiKey, topic, options = {}) {
  const { 
    tone = 50, 
    targetLength = 'Medium (~600 words)', 
    styleTraits = null, 
    referenceLinks = [],
    format = 'YouTube Video (Standard)',
    targetAudience = 'Tech enthusiasts & creators'
  } = options;

  if (!apiKey) {
    // High-quality smart demo script generator
    const persona = styleTraits?.persona || 'Tech Creator';
    const phrases = styleTraits?.topPhrases || ["here's the crazy part", "let me break it down", "game-changer"];
    const phrase1 = phrases[0] || "here's the crazy part";
    const phrase2 = phrases[1] || "let's be completely honest";

    return `So I've been experimenting with ${topic} for the past couple of weeks, and I have to say—${phrase1}.\n\nMost people think you have to overcomplicate the whole workflow, but once you peel back the layers, the real unlock is surprisingly simple.\n\nLet me break it down into three things that actually matter.\n\nFirst, let's talk about the friction. When you look at how traditional creators approach this, they waste hours on manual tweaking. But with the right setup, you eliminate 80% of the cognitive overhead instantly. It's clean, snappy, and basically a night-and-day difference.\n\nSecond, ${phrase2}: consistency is where everyone falls off. If your system takes more than 10 minutes to boot up, you're not going to stick with it. That's why having this automated framework in place feels like a genuine game-changer.\n\nAnd finally, look at the end result. Whether you're producing content for YouTube, client work, or building your own brand, the speed at which you can iterate is unmatched.\n\nNow look at this: what's the single biggest bottleneck in your current setup right now? Drop your thoughts in the comments below—I'm reading every single one. And if this gave you value, hit subscribe for more deep dives. Let's get to work.`;
  }

  const toneLabel = tone < 25 ? 'very casual, slangy, and high-energy' : tone < 50 ? 'casual and conversational' : tone < 70 ? 'balanced, punchy, and engaging' : tone < 85 ? 'professional and authoritative' : 'formal and structured';

  let styleSection = '';
  if (styleTraits) {
    const phrases = styleTraits.topPhrases?.join('", "') || '';
    const words = styleTraits.frequentWords?.map(w => w.word).join(', ') || '';
    styleSection = `
LEARNED INFLUENCER STYLE DNA (STRICTLY ADHERE TO THIS VOICE):
- Persona: ${styleTraits.persona || 'Content Creator'}
- Vibe & Cadence: ${styleTraits.vibe || 'Engaging and conversational'}
- Signature Phrases & Catchphrases to naturally weave in: "${phrases}"
- Frequently Used Slang / Vocabulary: ${words}
- Opening Hook Style: ${styleTraits.hookStyle || 'Punchy hook in first 5 seconds'}
- Call to Action (CTA) Style: ${styleTraits.ctaStyle || 'Engage the audience in comments'}
- Sentence Pacing: Average sentence length of ~${styleTraits.avgSentenceLength || 14} words
- Linguistic Complexity: ${styleTraits.complexity || 'Conversational'}
- Distinctive Voice Summary: ${styleTraits.summary || 'Energetic, relatable, and authentic creator tone'}`;
  }

  let referencesSection = '';
  if (referenceLinks && referenceLinks.length > 0) {
    referencesSection = `\nREFERENCE LINKS & CONTEXT:\n${referenceLinks.map(l => `- ${l}`).join('\n')}`;
  }

  const prompt = `You are writing a top-tier creator/influencer script.

TOPIC: ${topic}
FORMAT: ${format}
TARGET AUDIENCE: ${targetAudience}
TARGET SCRIPT LENGTH: ${targetLength}
TONE INTENSITY: ${toneLabel}
${styleSection}
${referencesSection}

CRITICAL SCRIPTWRITING INSTRUCTIONS:
1. Write in FIRST PERSON ("I", "we", "you") as if the influencer is speaking on camera.
2. Hook: Start immediately with their learned hook style in the first 1-2 lines. No fluff.
3. Flow: Naturally incorporate their signature catchphrases, favorite words, and slang without forcing it.
4. Structure: Break into clear, readable spoken paragraphs (with rhythm and emphasis).
5. Ending: Finish with their characteristic call-to-action / sign-off.
6. Clean output: Output ONLY the spoken script text without bracketed stage notes.

Write the script now:`;

  return await callGeminiAPIParts(apiKey, [{ text: prompt }], { temperature: 0.88 });
}

/**
 * Regenerate a script with feedback using the Gemini API.
 */
export async function regenerateWithGemini(apiKey, originalScript, feedback, styleTraits = null) {
  if (!apiKey) {
    return `${originalScript}\n\n[Revised based on: "${feedback}"]\n\nHere's the refined take: Let's cut straight to the point without any fluff. When you apply this exact principle, the immediate payoff is undeniable. Check the description link to try it yourself!`;
  }

  let styleSection = '';
  if (styleTraits) {
    const phrases = styleTraits.topPhrases?.join('", "') || '';
    styleSection = `\nMaintain the influencer's persona (${styleTraits.persona || 'Creator'}), signature phrases: "${phrases}", and overall cadence.`;
  }

  const prompt = `You are revising an influencer's script based on user feedback.

ORIGINAL SCRIPT:
${originalScript}

USER FEEDBACK / REQUESTED CHANGES:
${feedback}
${styleSection}

INSTRUCTIONS:
- Apply the requested feedback changes precisely.
- Preserve the influencer's unique voice, authentic slang, and core message unless asked to change them.
- Output ONLY the revised script text (no commentary, no explanations, no stage tags).

Revised script:`;

  return await callGeminiAPIParts(apiKey, [{ text: prompt }], { temperature: 0.8 });
}

/**
 * Generate 5 High-Converting Viral Hook variations and Clickable Titles.
 */
export async function generateViralHooksWithGemini(apiKey, topic, styleTraits = null) {
  if (!apiKey) {
    return {
      hooks: [
        { type: "Curiosity Gap", text: `I spent 14 days testing ${topic} so you don't have to—and the result made zero sense.`, score: 96 },
        { type: "Contrarian / Hot Take", text: `Stop doing ${topic} the traditional way. 99% of creators are wasting their time.`, score: 94 },
        { type: "The Shocking Stat", text: `What if I told you 1 small switch in ${topic} could double your output overnight?`, score: 92 },
        { type: "Story Hook", text: `Two months ago, I was completely stuck with ${topic}. Then I found this exact framework.`, score: 90 },
        { type: "Direct Challenge", text: `If you want to master ${topic} in 2026, you only need to understand these 3 rules.`, score: 88 },
      ],
      titles: [
        `Why Everyone is WRONG About ${topic}`,
        `The ONLY ${topic} Guide You Need in 2026`,
        `I Tried ${topic} for 30 Days (Real Results)`,
        `${topic}: The Secret Nobody Talks About`,
        `How to Master ${topic} Fast (Step-by-Step)`
      ],
      tags: [`#${topic.replace(/\s+/g, '')}`, '#CreatorEconomy', '#WorkflowHack', '#ProductivityTips', '#ViralVideo']
    };
  }

  const prompt = `Generate 5 viral video hooks and 5 high CTR YouTube/TikTok titles for the topic: "${topic}".
Creator persona: ${styleTraits?.persona || 'Top Influencer'}

Return ONLY a JSON object:
{
  "hooks": [
    { "type": "Curiosity Gap", "text": "...", "score": 95 },
    { "type": "Contrarian / Hot Take", "text": "...", "score": 93 },
    { "type": "The Shocking Stat", "text": "...", "score": 91 },
    { "type": "Story Hook", "text": "...", "score": 89 },
    { "type": "Direct Challenge", "text": "...", "score": 87 }
  ],
  "titles": ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"],
  "tags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"]
}`;

  const res = await callGeminiAPIParts(apiKey, [{ text: prompt }], { temperature: 0.8 });
  try {
    const cleaned = res.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Failed to generate hooks. Please try again.');
  }
}

/**
 * Generate Scene-by-Scene Visual Storyboard & B-Roll cues.
 */
export async function generateStoryboardWithGemini(apiKey, scriptContent) {
  if (!apiKey) {
    return [
      {
        sceneNumber: 1,
        timecode: "0:00 - 0:15",
        title: "The Explosive Hook",
        dialogue: scriptContent.slice(0, 120) + '...',
        visualCue: "A-Roll close-up with dynamic zoom-in. Fast kinetic text animation overlays the main claim.",
        bRoll: "Quick montage of failed attempts / high energy b-roll",
        sfx: "Subtle bass drop & whoosh transition"
      },
      {
        sceneNumber: 2,
        timecode: "0:15 - 1:00",
        title: "The Core Problem & Context",
        dialogue: "Breaking down the exact bottleneck and why most people get it wrong...",
        visualCue: "Medium shot. Screen recording split-screen demonstration.",
        bRoll: "Over-the-shoulder typing, dashboard metrics UI",
        sfx: "Pop sound on key UI callouts"
      },
      {
        sceneNumber: 3,
        timecode: "1:00 - 2:30",
        title: "The Framework / Secret",
        dialogue: "Revealing the 3-step solution and live demonstration...",
        visualCue: "Wide studio shot transitioning to fullscreen screen share.",
        bRoll: "High-contrast diagrams, 3D product renders or code highlight",
        sfx: "Upbeat lo-fi background groove kicks in"
      },
      {
        sceneNumber: 4,
        timecode: "2:30 - End",
        title: "The Climax & CTA Sign-off",
        dialogue: "Final takeaway, community engagement prompt and outro...",
        visualCue: "Close-up direct to lens. End screen cards pop in right corner.",
        bRoll: "Viewer comment highlights, subscribe button animation",
        sfx: "Outro chime and fade"
      }
    ];
  }

  const prompt = `Convert this video script into a structured, production-ready Scene-by-Scene Storyboard with visual cues, B-roll suggestions, and SFX cues.

SCRIPT:
${scriptContent}

Return ONLY a JSON array of scene objects:
[
  {
    "sceneNumber": 1,
    "timecode": "0:00 - 0:15",
    "title": "Scene Name",
    "dialogue": "Spoken line snippet",
    "visualCue": "Camera shot & lighting notes",
    "bRoll": "B-roll asset recommendations",
    "sfx": "Audio / Sound effects cue"
  }
]`;

  const res = await callGeminiAPIParts(apiKey, [{ text: prompt }], { temperature: 0.7 });
  try {
    const cleaned = res.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Failed to parse storyboard. Please try again.');
  }
}

/**
 * Repurpose script into multi-platform formats (Shorts/TikTok, LinkedIn, Twitter/X thread, Newsletter).
 */
export async function generateRepurposedContentWithGemini(apiKey, scriptContent, platform) {
  const formats = {
    tiktok: "A 45-60 second punchy TikTok/Reels script with on-screen text cues [TEXT] and rapid pacing.",
    linkedin: "A high-performing, viral LinkedIn post with clean spacing, strong opening hook, bullet points, and hashtag footer.",
    twitter: "A viral 5-tweet X/Twitter thread with numbered tweets (1/5 to 5/5), punchy one-liners, and a final CTA tweet.",
    newsletter: "A clean Substack/email newsletter edition with catchy subject line, warm conversational greeting, body breakdown, and sign-off."
  };

  const instruction = formats[platform] || formats.tiktok;

  if (!apiKey) {
    if (platform === 'linkedin') {
      return `Most creators waste 15+ hours a week on broken workflows.\n\nHere is what I learned after testing a complete system overhaul:\n\n1. Simplicity beats perfection every single time.\n2. When friction is eliminated, output naturally triples.\n3. Your voice is your competitive moat—never outsource your style.\n\nWhat is the #1 tool that transformed your content production this year?\n\n#ContentCreation #Productivity #CreatorEconomy`;
    }
    if (platform === 'twitter') {
      return `1/5 Most people overcomplicate content creation.\n\nHere's the exact framework I used to cut production time in half without losing quality 🧵👇\n\n2/5 Rule #1: Eliminate the setup friction. If starting takes more than 5 minutes, you'll procrastinate.\n\n3/5 Rule #2: Capture your raw voice. Don't sound like a generic AI template—use your signature hooks and phrases.\n\n4/5 Rule #3: Repurpose intelligently. One longform asset should feed 4 distinct platforms.\n\n5/5 If you found this valuable:\n1. Follow for more creator systems\n2. Retweet the first tweet to help a friend!`;
    }
    if (platform === 'newsletter') {
      return `Subject: The system that doubled my creative output (without burnout)\n\nHey friends,\n\nLast week I took a hard look at my content pipeline. The truth? I was spending way too much time wrestling with ideas instead of shipping.\n\nHere are the 3 big shifts that changed everything for me:\n\n• Shift 1: Pre-building style DNA so drafts sound authentic from second one.\n• Shift 2: Setting up a zero-friction recording studio.\n• Shift 3: Repurposing every core insight into bite-sized nuggets.\n\nTry this in your next project and let me know how it goes!\n\nBest,\nSahas`;
    }
    return `[0-3s] 🔥 Stop scrolling. If you're still making content the hard way, you need to hear this.\n\n[3-15s] [TEXT: The 3-Step Unlock] Most people spend hours writing scripts from scratch.\n\n[15-40s] [TEXT: Cut Production in Half] But when you lock in your unique voice profile, the entire draft comes together in seconds.\n\n[40-60s] [TEXT: Drop a comment] Try this method on your next video and hit follow for more!`;
  }

  const prompt = `Repurpose the following longform script into: ${instruction}

ORIGINAL SCRIPT:
${scriptContent}

Output ONLY the formatted content ready to copy-paste:`;

  return await callGeminiAPIParts(apiKey, [{ text: prompt }], { temperature: 0.82 });
}

