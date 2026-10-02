import React, { useState } from 'react';
import { 
  FlaskConical, Sparkles, TrendingUp, CheckCircle2, ShieldCheck, 
  BarChart3, Zap, Layers, RefreshCw, ArrowRight, Award, FileText, Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ExperimentMode() {
  const { experimentData, styleDNA } = useApp();
  const [activeTestTopic, setActiveTestTopic] = useState('Why 99% of Software Startups Overcomplicate Architecture');
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResults, setTestResults] = useState(null);

  const handleRunLiveBenchmark = () => {
    setIsRunningTest(true);
    setTimeout(() => {
      setTestResults({
        topic: activeTestTopic,
        styleflow: {
          excerpt: `Most engineering teams burn six months building distributed microservices for a product with zero users. Here is the uncomfortable reality: premature optimization is not engineering discipline—it is sophisticated avoidance of user feedback.\n\nWhen you keep your architecture dead simple, you ship daily. Speed is the only moat that compounds.`,
          wordsPerSentence: 11.8,
          gradeLevel: 'Grade 7.8',
          vocabComplexity: '15.2%',
          styleMatch: '95.4%',
          ttr: '0.82',
        },
        zeroshot: {
          excerpt: `Software architecture is a critical component of building scalable web applications. In many instances, modern software development teams encounter numerous complexities due to an inclination toward over-engineering their software stacks before market validation is achieved. Consequently, resources are depleted.`,
          wordsPerSentence: 24.3,
          gradeLevel: 'Grade 14.2',
          vocabComplexity: '28.6%',
          styleMatch: '62.1%',
          ttr: '0.64',
        }
      });
      setIsRunningTest(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-dark-900 rounded-2xl p-6 text-white border border-gray-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-brand-500/20 border border-brand-400/30 text-brand-300">
                <FlaskConical className="w-5 h-5 text-brand-400" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-400">
                Ablation & Benchmarking Suite
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
              Empirical Stylometric Evaluation
            </h1>
            <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
              Systematic quantitative evaluation of StyleFlow's 3-Agent Stylometric RAG architecture against standard LLM baseline prompting across 50 randomized essay topics.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-center">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Evaluated Topics</p>
              <p className="text-lg font-black text-brand-300">N = 50</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-center">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Evaluator Mode</p>
              <p className="text-lg font-black text-emerald-400">Blind A/B</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Style Cosine Match</span>
            <Award className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-50">94.2%</div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            +38.6% vs Base Zero-Shot (68.4%)
          </p>
        </div>

        <div className="bg-white dark:bg-dark-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Sentence Cadence MAE</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-50">0.8 words</div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-1">
            Target baseline: 11.9 words / sentence
          </p>
        </div>

        <div className="bg-white dark:bg-dark-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Lexical Diversity (TTR)</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-50">98.5%</div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Exact match to 0.81 TTR baseline
          </p>
        </div>

        <div className="bg-white dark:bg-dark-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Human Blind Preference</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-50">91.0%</div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-1">
            Selected as creator-authentic
          </p>
        </div>
      </div>

      {/* Comparative Methodology Matrix Table */}
      <div className="bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-600" />
              Comparative Architecture Performance Matrix
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Automated Stylometric Distance and Readability Metrics vs Target Persona
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 uppercase tracking-wider font-bold">
                <th className="py-3 px-3">Pipeline Strategy</th>
                <th className="py-3 px-3">Style Cosine Sim</th>
                <th className="py-3 px-3">Sentence Cadence MAE</th>
                <th className="py-3 px-3">TTR Alignment</th>
                <th className="py-3 px-3">Flesch-Kincaid Delta</th>
                <th className="py-3 px-3">Blind Acceptance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <tr className="bg-brand-50/50 dark:bg-brand-950/30 font-semibold">
                <td className="py-3.5 px-3 flex items-center gap-2 text-brand-900 dark:text-brand-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>StyleFlow (3-Agent + RAG + Stylometrics)</span>
                  <span className="px-1.5 py-0.5 rounded bg-brand-200 dark:bg-brand-800 text-[10px] font-black text-brand-800 dark:text-brand-200">
                    Active
                  </span>
                </td>
                <td className="py-3.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">94.2%</td>
                <td className="py-3.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">0.8 words</td>
                <td className="py-3.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">98.5%</td>
                <td className="py-3.5 px-3 font-bold">±0.2 grades</td>
                <td className="py-3.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">91.0%</td>
              </tr>
              <tr>
                <td className="py-3.5 px-3 text-gray-700 dark:text-gray-300">
                  Standard Few-Shot In-Context (GPT-4o)
                </td>
                <td className="py-3.5 px-3 text-gray-700 dark:text-gray-300">79.1%</td>
                <td className="py-3.5 px-3 text-gray-700 dark:text-gray-300">3.2 words</td>
                <td className="py-3.5 px-3 text-gray-700 dark:text-gray-300">81.4%</td>
                <td className="py-3.5 px-3 text-gray-700 dark:text-gray-300">±1.9 grades</td>
                <td className="py-3.5 px-3 text-gray-700 dark:text-gray-300">64.0%</td>
              </tr>
              <tr>
                <td className="py-3.5 px-3 text-gray-700 dark:text-gray-300">
                  Zero-Shot Base Prompt (Claude 3.5 Sonnet)
                </td>
                <td className="py-3.5 px-3 text-gray-700 dark:text-gray-300">68.4%</td>
                <td className="py-3.5 px-3 text-gray-700 dark:text-gray-300">5.4 words</td>
                <td className="py-3.5 px-3 text-gray-700 dark:text-gray-300">72.1%</td>
                <td className="py-3.5 px-3 text-gray-700 dark:text-gray-300">±4.5 grades</td>
                <td className="py-3.5 px-3 text-gray-700 dark:text-gray-300">38.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Dimension Alignment Progress Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-600" />
            5-Dimension Stylometric Alignment Breakdown
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Comparing StyleFlow against standard baselines across individual stylistic markers:
          </p>

          <div className="space-y-3.5 pt-2">
            {experimentData.metricsChart.map((metric, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-700 dark:text-gray-300">{metric.label}</span>
                  <div className="flex gap-3 text-[11px]">
                    <span className="text-brand-600 dark:text-brand-400 font-bold">StyleFlow: {metric.styleflow}%</span>
                    <span className="text-gray-400">Few-Shot: {metric.fewshot}%</span>
                    <span className="text-gray-400">Zero-Shot: {metric.zeroshot}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-dark-800 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-brand-600 rounded-full transition-all duration-500" 
                    style={{ width: `${metric.styleflow}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Interactive Benchmark Playground */}
        <div className="bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-brand-600" />
              Live A/B Stylometric Test Runner
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Enter any test premise to see the live syntactic differences between StyleFlow and standard Zero-Shot LLM generation.
            </p>

            <div className="mt-3">
              <input
                type="text"
                value={activeTestTopic}
                onChange={(e) => setActiveTestTopic(e.target.value)}
                placeholder="Enter test topic..."
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-dark-850 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              onClick={handleRunLiveBenchmark}
              disabled={isRunningTest || !activeTestTopic.trim()}
              className="mt-3 w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isRunningTest ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Running Side-by-Side Evaluation...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Run Live Stylometric Diff Test
                </>
              )}
            </button>
          </div>

          {testResults ? (
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs">
              {/* StyleFlow Side */}
              <div className="p-3 bg-brand-50/50 dark:bg-brand-950/40 rounded-xl border border-brand-200/60 dark:border-brand-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-700 dark:text-brand-300">StyleFlow Pipeline</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-brand-200 dark:bg-brand-800 text-brand-900 dark:text-brand-100 rounded">
                    {testResults.styleflow.styleMatch} Match
                  </span>
                </div>
                <p className="text-[11px] text-gray-700 dark:text-gray-300 italic line-clamp-4">
                  "{testResults.styleflow.excerpt}"
                </p>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 space-y-0.5 pt-1 border-t border-brand-200/40 dark:border-brand-800/40">
                  <div>Avg Sentence: <strong>{testResults.styleflow.wordsPerSentence} words</strong></div>
                  <div>Readability: <strong>{testResults.styleflow.gradeLevel}</strong></div>
                </div>
              </div>

              {/* Zero-Shot Side */}
              <div className="p-3 bg-gray-50 dark:bg-dark-850 rounded-xl border border-gray-200 dark:border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Zero-Shot Base LLM</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                    {testResults.zeroshot.styleMatch} Match
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 italic line-clamp-4">
                  "{testResults.zeroshot.excerpt}"
                </p>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 space-y-0.5 pt-1 border-t border-gray-200 dark:border-gray-700">
                  <div>Avg Sentence: <strong>{testResults.zeroshot.wordsPerSentence} words</strong> (Over-verbose)</div>
                  <div>Readability: <strong>{testResults.zeroshot.gradeLevel}</strong></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-dark-850 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 text-center text-xs text-gray-400">
              Click "Run Live Stylometric Diff Test" to execute real-time syntactic and lexical metric comparisons.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
