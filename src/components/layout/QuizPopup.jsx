import React from 'react';
import { useStore } from '../../store/useStore';
import { QUIZ_DATA } from '../../data/index';

export default function QuizPopup() {
    const isOpen = useStore(s => s.isQuizOpen);
    const close = () => useStore.getState().setIsQuizOpen(false);
    
    const structure = useStore(s => s.selectedStructure);
    const progressMap = useStore(s => s.quizProgress);
    const setAnswer = useStore(s => s.setQuizAnswer);
    const setIndex = useStore(s => s.setQuizIndex);

    if (!isOpen) return null;

    // Load structure questions or fallback to default
    const questions = QUIZ_DATA[structure] || QUIZ_DATA['Default'];
    
    // Get user's saved progress for THIS specific structure
    const prog = progressMap[structure] || { currentIndex: 0, answers: {} };
    const { currentIndex, answers } = prog;

    const q = questions[currentIndex];
    const selectedAns = answers[currentIndex];
    const isAnswered = selectedAns !== undefined;
    const isCorrect = selectedAns === q.correct;

    // Calculate score
    const score = Object.entries(answers).filter(([qIdx, aIdx]) => questions[qIdx].correct === aIdx).length;
    const progressPercent = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="fixed inset-0 bg-slate-900/60 z-[9999] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl max-h-[95vh] rounded-2xl shadow-2xl flex flex-col relative overflow-hidden animate-fade-in">
                
                {/* Close Button Top Left */}
                <button 
                    onClick={close}
                    className="absolute top-4 left-4 z-10 w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
                    title="Close Quiz"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>

                {/* Header / Progress Bar */}
                <div className="px-8 pt-6 pb-4 border-b shrink-0 mt-8">
                    <div className="flex justify-between text-sm font-bold text-slate-600 mb-3">
                        <span>Question {currentIndex + 1} of {questions.length}</span>
                        <span>Score: {score}/{questions.length}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>

                {/* Question Area */}
                <div className="p-8 overflow-y-auto flex-1 bg-slate-50">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                        {/* Tags */}
                        <div className="flex gap-2 mb-4 flex-wrap">
                            {q.tags.map((tag, i) => {
                                let tagColor = 'bg-slate-100 text-slate-700'; // Default gray
                                
                                if (tag === 'Easy') tagColor = 'bg-emerald-100 text-emerald-700';
                                else if (tag === 'Medium') tagColor = 'bg-yellow-100 text-yellow-800';
                                else if (tag === 'Hard') tagColor = 'bg-red-100 text-red-700';
                                else if (i === 0) tagColor = 'bg-indigo-100 text-indigo-700'; // Keep 1st category tag blue

                                return (
                                    <span key={i} className={`px-3 py-1 rounded-full text-xs font-bold ${tagColor}`}>
                                        {tag}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Question Text */}
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">{q.text}</h2>

                        {/* Options */}
                        <div className="flex flex-col gap-3">
                            {q.options.map((opt, i) => {
                                let boxClass = "border-slate-200 hover:bg-slate-50 hover:border-slate-300";
                                let textClass = "text-slate-700";
                                
                                if (isAnswered) {
                                    if (i === q.correct) {
                                        boxClass = "border-emerald-500 bg-emerald-50"; // Highlight correct answer
                                    } else if (i === selectedAns) {
                                        boxClass = "border-rose-400 bg-rose-50"; // Highlight wrong choice
                                    } else {
                                        boxClass = "border-slate-200 opacity-50"; // Dim others
                                    }
                                }

                                return (
                                    <div 
                                        key={i} 
                                        onClick={() => !isAnswered && setAnswer(structure, currentIndex, i)} 
                                        className={`border-2 p-4 rounded-xl flex items-center transition-all ${!isAnswered ? 'cursor-pointer' : ''} ${boxClass}`}
                                    >
                                        <span className="font-bold text-indigo-600 mr-4 w-6 text-lg shrink-0">{['A.', 'B.', 'C.', 'D.'][i]}</span>
                                        <span className={`font-semibold ${textClass}`}>{opt}</span>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Explanation Feedback Box */}
                        {isAnswered && (
                            <div className={`mt-6 p-4 rounded-xl border flex gap-4 animate-fade-in ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                                <div className="shrink-0 mt-0.5">
                                    {isCorrect ? (
                                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="font-bold text-lg mb-1 text-slate-800">
                                        {isCorrect ? 'Correct!' : 'Incorrect'}
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                        {q.explanation}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t flex justify-between bg-white shrink-0 items-center">
                    <button 
                        onClick={() => currentIndex > 0 && setIndex(structure, currentIndex - 1)}
                        disabled={currentIndex === 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        Previous
                    </button>
                    
                    <button 
                        onClick={() => currentIndex < questions.length - 1 && setIndex(structure, currentIndex + 1)}
                        disabled={currentIndex === questions.length - 1}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        Next
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}