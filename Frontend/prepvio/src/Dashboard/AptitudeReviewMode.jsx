import { useEffect, useState } from "react";
import { 
  Brain, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ArrowRight, 
  ShieldCheck,
  Target,
  Sparkles,
  Clock,
  BarChart3,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

function AptitudeReviewMode() {
  const [test, setTest] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState({
    accuracy: 0,
    questionsAttempted: 0,
    totalQuestions: 0
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("aptitude_review_data");
      console.log("📦 Raw localStorage data:", raw);

      if (!raw) {
        setError("No review data found. Please select a test to review.");
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(raw);
      console.log("✅ Parsed data:", parsed);
      console.log("✅ Answers array:", parsed.answers);

      if (!parsed.answers || parsed.answers.length === 0) {
        setError("No answers available for review.");
        setLoading(false);
        return;
      }

      // Calculate analysis data
      const totalQuestions = parsed.answers.length;
      const questionsAttempted = parsed.answers.filter(ans => 
        ans.selectedIndex !== undefined && ans.selectedIndex !== null
      ).length;
      const correctAnswers = parsed.answers.filter(ans => 
        ans.selectedIndex === ans.correctIndex
      ).length;
      const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

      setAnalysisData({
        accuracy,
        questionsAttempted,
        totalQuestions
      });

      // Add calculated fields to test object
      parsed.correctAnswers = correctAnswers;
      parsed.totalQuestions = totalQuestions;
      parsed.percentage = accuracy;

      setTest(parsed);
      setLoading(false);
    } catch (e) {
      console.error("Invalid review data", e);
      setError("Invalid review data. Please try again.");
      setLoading(false);
    }
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case "easy": return "bg-green-50 border-green-200 text-green-700";
      case "medium": return "bg-orange-50 border-orange-200 text-orange-700";
      case "hard": return "bg-red-50 border-red-200 text-red-700";
      default: return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-[#D4F478] mx-auto mb-4 animate-pulse" />
          <p className="text-xl font-bold text-gray-900">
            Loading review data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-100 text-center max-w-md w-full">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-gray-900 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.href = "/aptitude-analysis"}
            className="bg-[#D4F478] text-black px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#cbf060] transition-colors"
          >
            Back to Analysis
          </button>
        </div>
      </div>
    );
  }

  if (!test) return null;

  const answer = test.answers[current];
  const isCorrect = answer.selectedIndex === answer.correctIndex;
  
  // Calculate performance metrics
  const correctCount = test.answers.filter(a => a.selectedIndex === a.correctIndex).length;
  const accuracyPercentage = Math.round((correctCount / test.answers.length) * 100);

  return (
    <div className="min-h-screen bg-[#FDFBF9] p-4 md:p-10 flex flex-col items-center">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT SIDE: QUESTION CONTENT */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header */}
          <header className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-4">
              <Brain className="w-8 h-8 p-1.5 bg-black text-[#D4F478] rounded-xl" />
              <div>
                <h2 className="font-black text-xl">Review Mode</h2>
                <p className="text-xs text-gray-500 font-medium">{test.topic}</p>
              </div>
            </div>
            {/* <button
              onClick={() => window.location.href = "/aptitude-analysis"}
              className="bg-[#D4F478] text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#cbf060] transition-colors"
            >
              Back to Analysiss
            </button> */}
          </header>

          {/* Question Card */}
          <main className="bg-white rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Question {current + 1} of {test.answers.length}
              </span>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getDifficultyColor(answer.difficulty)}`}>
                {answer.difficulty || "Medium"}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 leading-tight">
              {answer.question}
            </h2>

            {/* Answer Status */}
            <div className={`p-4 rounded-2xl mb-8 ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <span className="font-bold text-green-700">Correct Answer!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-600" />
                    <span className="font-bold text-red-700">Incorrect Answer</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Options */}
            <div className="grid gap-4 mb-10">
              {answer.options.map((opt, i) => {
                const isUserAnswer = answer.selectedIndex === i;
                const isCorrectAnswer = answer.correctIndex === i;
                
                return (
                  <div 
                    key={i} 
                    className={`p-6 rounded-2xl border-2 text-left font-bold transition-all ${
                      isCorrectAnswer 
                        ? "bg-green-50 border-green-300 text-green-900" 
                        : isUserAnswer 
                        ? "bg-red-50 border-red-300 text-red-900"
                        : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{String.fromCharCode(65+i)}. {opt.text}</span>
                      {isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                      {isUserAnswer && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation */}
            {answer.explanation && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-10">
                <p className="text-xs font-black text-blue-600 uppercase tracking-wider mb-2">Explanation</p>
                <p className="text-gray-700 leading-relaxed">{answer.explanation}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-100">
              <button 
                onClick={() => current > 0 && setCurrent(c => c - 1)} 
                disabled={current === 0}
                className="text-gray-400 font-bold flex items-center gap-2 hover:text-gray-900 transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>
              <button 
                onClick={() => current < test.answers.length - 1 && setCurrent(c => c + 1)} 
                disabled={current === test.answers.length - 1}
                className="bg-black text-white px-8 py-4 rounded-2xl font-black hover:bg-gray-900 transition-colors disabled:opacity-30 flex items-center gap-2"
              >
                Next <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </main>
        </div>

        {/* RIGHT SIDE: SIDEBAR */}
        <aside className="lg:col-span-4 space-y-8">
          

          {/* Accuracy Stats Card */}
          {/* Accuracy Stats Card */}
          <div className="bg-black rounded-[2.5rem] p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#D4F478]/20 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#D4F478]" />
              </div>
              <div>
                <h3 className="text-lg font-black">Performance</h3>
                <p className="text-sm text-gray-400">Complete test analytics</p>
              </div>
            </div>
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full border-8 border-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl font-black">{analysisData.accuracy}%</span>
                    <p className="text-sm text-gray-400 mt-1">Accuracy</p>
                  </div>
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full border-8 border-transparent border-t-[#D4F478]"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
            
            {/* Test Information */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium">Topic:</span>
                <span className="font-bold text-[#D4F478]">{test.topic}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium">Score:</span>
                <span className="font-bold">{correctCount}/{test.answers.length}</span>
              </div>
              {test.timeTakenSeconds && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Time Taken:</span>
                  <span className="font-bold">
                    {Math.floor(test.timeTakenSeconds / 60)}:{String(test.timeTakenSeconds % 60).padStart(2, '0')}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium">Status:</span>
                <span className={`font-bold ${
                  accuracyPercentage >= 80 ? "text-green-400" :
                  accuracyPercentage >= 60 ? "text-blue-400" :
                  "text-orange-400"
                }`}>
                  {accuracyPercentage >= 80 ? "Excellent" :
                   accuracyPercentage >= 60 ? "Good" :
                   "Needs Improvement"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
              <div className="text-center p-4 bg-gray-900 rounded-2xl">
                <div className="text-2xl font-black">{analysisData.questionsAttempted}</div>
                <div className="text-xs text-gray-400">Attempted</div>
              </div>
              <div className="text-center p-4 bg-gray-900 rounded-2xl">
                <div className="text-2xl font-black">{correctCount}</div>
                <div className="text-xs text-gray-400">Correct</div>
              </div>
            </div>
          </div>

          {/* Answer Status Card */}
          <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-black uppercase text-gray-400 tracking-wider">Answer Status</p>
              {/* <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-black">{correctCount}/{test.answers.length} correct</span>
                <span className="text-xs font-bold text-[#D4F478]">({accuracyPercentage}%)</span>
              </div> */}
            </div>
            
            <div className="grid grid-cols-5 gap-3 mb-6">
              {test.answers.map((ans, idx) => {
                const isAnswered = ans.selectedIndex !== undefined;
                const isCorrect = ans.selectedIndex === ans.correctIndex;
                
                return (
                  <button 
                    key={idx} 
                    onClick={() => setCurrent(idx)}
                    className={`h-12 rounded-2xl font-black text-sm transition-all relative overflow-hidden ${
                      current === idx 
                        ? "bg-black text-white shadow-lg scale-110 z-10" 
                        : isAnswered && isCorrect
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : isAnswered
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                  <div className="w-2 h-2 rounded-full bg-green-500" /> Correct
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                  <div className="w-2 h-2 rounded-full bg-black" /> Current
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                  <div className="w-2 h-2 rounded-full bg-red-500" /> Incorrect
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                  <div className="w-2 h-2 rounded-full bg-gray-100" /> Not Attempted
                </div>
              </div>
            </div>
          </div>

          {/* Test Stats Card */}
          {/* <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#D4F478]" />
              Test Information
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Topic:</span>
                <span className="font-bold">{test.topic}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Total Questions:</span>
                <span className="font-bold">{test.answers.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Score:</span>
                <span className="font-bold text-[#D4F478]">{correctCount}/{test.answers.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Percentage:</span>
                <span className="font-bold text-[#D4F478]">{accuracyPercentage}%</span>
              </div>
              {test.timeTakenSeconds && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Time Taken:</span>
                  <span className="font-bold">
                    {Math.floor(test.timeTakenSeconds / 60)}:{String(test.timeTakenSeconds % 60).padStart(2, '0')}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Status:</span>
                <span className={`font-bold ${
                  accuracyPercentage >= 80 ? "text-green-600" :
                  accuracyPercentage >= 60 ? "text-blue-600" :
                  "text-orange-600"
                }`}>
                  {accuracyPercentage >= 80 ? "Excellent" :
                   accuracyPercentage >= 60 ? "Good" :
                   "Needs Improvement"}
                </span>
              </div>
            </div>
          </div> */}
        </aside>
      </div>
    </div>
  );
}

export default AptitudeReviewMode;