import React, { useState } from 'react';
import { CheckCircle2, XCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizViewProps {
  quiz: QuizQuestion[];
  videoId: string;
}

const QuizView: React.FC<QuizViewProps> = ({ quiz }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    if (option === quiz[currentStep].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentStep < quiz.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="text-center py-10">
        <div className="mb-6 inline-block p-4 bg-blue-100 rounded-full text-blue-600">
          <CheckCircle2 size={64} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz Completed!</h2>
        <p className="text-slate-600 mb-8 text-lg">You scored <span className="font-bold text-blue-600">{score}</span> out of <span className="font-bold">{quiz.length}</span></p>
        <button
          onClick={resetQuiz}
          className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto"
        >
          <RefreshCcw size={20} />
          Retake Quiz
        </button>
      </div>
    );
  }

  const currentQuestion = quiz[currentStep];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center text-sm font-medium text-slate-400">
        <span className="bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">Question {currentStep + 1} / {quiz.length}</span>
        <span className="text-blue-600 font-bold">{Math.round(((currentStep) / quiz.length) * 100)}% Done</span>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 leading-tight">{currentQuestion.question}</h3>
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isCorrect = option === currentQuestion.correctAnswer;
            const isSelected = option === selectedOption;
            
            let bgClass = 'bg-white border-slate-200 hover:border-blue-400';
            let textClass = 'text-slate-700';
            let icon = null;

            if (isAnswered) {
              if (isCorrect) {
                bgClass = 'bg-green-50 border-green-500 ring-4 ring-green-50';
                textClass = 'text-green-700 font-bold';
                icon = <CheckCircle2 className="text-green-500" size={20} />;
              } else if (isSelected) {
                bgClass = 'bg-red-50 border-red-500 ring-4 ring-red-50';
                textClass = 'text-red-700 font-bold';
                icon = <XCircle className="text-red-500" size={20} />;
              } else {
                bgClass = 'bg-white border-slate-100 opacity-50';
              }
            } else if (isSelected) {
              bgClass = 'bg-blue-50 border-blue-500';
            }

            return (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOptionSelect(option)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${bgClass} ${textClass}`}
              >
                <span>{option}</span>
                {icon}
              </motion.button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={nextQuestion}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
        >
          {currentStep === quiz.length - 1 ? 'See Results' : 'Next Question'}
        </motion.button>
      )}
    </div>
  );
};

export default QuizView;
