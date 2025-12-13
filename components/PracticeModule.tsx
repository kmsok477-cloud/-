import React, { useState } from 'react';
import { SKILLS_LIST } from '../constants';
import { NursingSkill } from '../types';
import { ChevronRight, ChevronLeft, Info, Eye, EyeOff, ArrowLeft, Book, Stethoscope, Activity, Droplets, Wind } from 'lucide-react';

const PracticeModule: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<NursingSkill | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(true);

  // Function to render icon based on skill ID
  const getSkillIcon = (id: string) => {
    switch (id) {
      case 'vital-signs': return <Activity size={32} className="text-pink-500" />;
      case 'tube-feeding': return <Stethoscope size={32} className="text-orange-500" />; // L-tube icon approximation
      case 'suction': return <Wind size={32} className="text-blue-500" />;
      case 'iv-therapy': return <Droplets size={32} className="text-sky-500" />;
      default: return <Book size={32} className="text-teal-500" />;
    }
  };

  const handleSelectSkill = (skill: NursingSkill) => {
    setSelectedSkill(skill);
    setCurrentStepIndex(0);
    setShowExplanation(true);
  };

  const handleBackToList = () => {
    setSelectedSkill(null);
  };

  const steps = selectedSkill?.steps || [];
  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // 1. Skill Selection View
  if (!selectedSkill) {
    return (
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">핵심술기 선택</h2>
          <p className="text-gray-600">연습하고 싶은 간호술기를 선택해주세요.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
          {SKILLS_LIST.map((skill) => (
            <button
              key={skill.id}
              onClick={() => handleSelectSkill(skill)}
              className="flex items-start p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all text-left group"
            >
              <div className="mr-4 p-3 bg-gray-50 rounded-lg group-hover:bg-teal-50 transition-colors">
                {getSkillIcon(skill.id)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-teal-700 transition-colors">
                  {skill.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {skill.description}
                </p>
                <div className="mt-3 flex items-center text-xs font-semibold text-gray-400 group-hover:text-teal-600">
                  총 {skill.steps.length}단계 <ChevronRight size={14} className="ml-1" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 2. Practice View (Existing Logic)
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-4 bg-teal-600 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
            <button onClick={handleBackToList} className="hover:bg-teal-700 p-1 rounded-full transition">
                <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg md:text-xl font-bold truncate max-w-[200px] md:max-w-md">
                {selectedSkill.title}
            </h2>
        </div>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center gap-2 bg-teal-700 px-3 py-1 rounded-full text-sm hover:bg-teal-800 transition"
        >
          {showExplanation ? <EyeOff size={16} /> : <Eye size={16} />}
          <span className="hidden md:inline">{showExplanation ? '설명 숨기기' : '설명 보기'}</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2">
        <div
          className="bg-teal-500 h-2 transition-all duration-300"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
            Step {currentStepIndex + 1} / {steps.length}
          </span>
          
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
            {currentStep.instruction}
          </h3>

          {showExplanation && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg animate-fade-in">
              <div className="flex items-start gap-3">
                <Info className="text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">핵심 포인트</h4>
                  <p className="text-blue-800 text-sm md:text-base">{currentStep.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {showExplanation && currentStep.imageUrl && (
            <div className="w-full rounded-xl overflow-hidden shadow-lg mb-6 border border-gray-100">
               <img 
                 src={currentStep.imageUrl} 
                 alt="Step visual" 
                 className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
               />
            </div>
          )}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${
            currentStepIndex === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ChevronLeft size={20} className="mr-1" />
          이전
        </button>

        <div className="text-gray-500 font-medium">
          {currentStepIndex + 1} <span className="text-gray-300">/</span> {steps.length}
        </div>

        <button
          onClick={handleNext}
          disabled={currentStepIndex === steps.length - 1}
          className={`flex items-center px-6 py-2 rounded-lg font-bold shadow-sm transition ${
            currentStepIndex === steps.length - 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}
        >
          {currentStepIndex === steps.length - 1 ? '완료' : '다음'}
          {currentStepIndex !== steps.length - 1 && <ChevronRight size={20} className="ml-1" />}
        </button>
      </div>
    </div>
  );
};

export default PracticeModule;