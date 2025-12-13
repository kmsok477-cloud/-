import React, { useState } from 'react';
import { VITAL_SIGNS_SKILL } from '../constants';
import { EvaluationStatus, AssessmentRecord } from '../types';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

const SelfCheck: React.FC = () => {
  const [scores, setScores] = useState<Record<number, EvaluationStatus>>({});
  const [submitted, setSubmitted] = useState(false);

  const steps = VITAL_SIGNS_SKILL.steps;

  const handleScoreChange = (stepId: number, status: EvaluationStatus) => {
    setScores(prev => ({
      ...prev,
      [stepId]: status,
    }));
  };

  const calculateTotalScore = () => {
    const totalPossible = steps.length * 2; // 2 points for COMPLETE
    let currentTotal = 0;
    Object.values(scores).forEach(val => {
      currentTotal += (val as number);
    });
    return Math.round((currentTotal / totalPossible) * 100);
  };

  const getStatusColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const saveResult = (finalScore: number) => {
    const newRecord: AssessmentRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      score: finalScore,
      passed: finalScore >= 80,
      type: 'SELF_CHECK',
      skillTitle: VITAL_SIGNS_SKILL.title
    };

    try {
      const history = JSON.parse(localStorage.getItem('nursing_history') || '[]');
      history.push(newRecord);
      localStorage.setItem('nursing_history', JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  const handleSubmit = () => {
    // Validate all fields filled
    if (Object.keys(scores).length < steps.length) {
      alert("모든 항목을 평가해주세요.");
      return;
    }
    
    const finalScore = calculateTotalScore();
    setSubmitted(true);
    saveResult(finalScore);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setScores({});
    setSubmitted(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md h-full overflow-y-auto">
      <div className="p-6 border-b sticky top-0 bg-white z-10">
        <h2 className="text-2xl font-bold text-gray-800">자가평가 (Self-Check)</h2>
        <p className="text-gray-500 text-sm mt-1">자신의 수행을 객관적으로 평가해보세요.</p>
        
        {submitted && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-slide-down">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700">총점</span>
              <span className={`text-3xl font-bold ${getStatusColor(calculateTotalScore())}`}>
                {calculateTotalScore()}점
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-500 text-right">
              {calculateTotalScore() >= 80 ? '훌륭합니다! 🎉' : '조금 더 연습이 필요해요 💪'}
              <br/>
              <span className="text-xs text-gray-400">결과가 대시보드에 저장되었습니다.</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {steps.map((step) => (
          <div key={step.id} className="pb-4 border-b border-gray-100 last:border-0">
            <div className="flex gap-2 mb-3">
              <span className="font-bold text-teal-600 w-6 flex-shrink-0">{step.id}.</span>
              <p className={`text-gray-800 ${step.isCritical ? 'font-medium' : ''}`}>
                {step.instruction}
                {step.isCritical && <span className="text-red-500 ml-2 text-xs font-bold">*필수</span>}
              </p>
            </div>

            <div className="flex gap-2 ml-8">
              <button
                disabled={submitted}
                onClick={() => handleScoreChange(step.id, EvaluationStatus.COMPLETE)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm transition border ${
                  scores[step.id] === EvaluationStatus.COMPLETE
                    ? 'bg-green-100 border-green-500 text-green-700 font-bold'
                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                완전수행 (2)
              </button>
              <button
                disabled={submitted}
                onClick={() => handleScoreChange(step.id, EvaluationStatus.PARTIAL)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm transition border ${
                  scores[step.id] === EvaluationStatus.PARTIAL
                    ? 'bg-yellow-100 border-yellow-500 text-yellow-700 font-bold'
                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                부분수행 (1)
              </button>
              <button
                disabled={submitted}
                onClick={() => handleScoreChange(step.id, EvaluationStatus.NOT_DONE)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm transition border ${
                  scores[step.id] === EvaluationStatus.NOT_DONE
                    ? 'bg-red-100 border-red-500 text-red-700 font-bold'
                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                미수행 (0)
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-gray-50 border-t">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition shadow-lg"
          >
            제출하기
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="w-full py-3 bg-gray-600 text-white rounded-xl font-bold text-lg hover:bg-gray-700 transition shadow-lg"
          >
            다시 평가하기
          </button>
        )}
      </div>
    </div>
  );
};

export default SelfCheck;