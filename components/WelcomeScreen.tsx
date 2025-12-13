import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Activity, GraduationCap, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: (profile: UserProfile) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [schoolName, setSchoolName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim() || !studentId.trim() || !name.trim()) {
      setError('모든 정보를 입력해주세요.');
      return;
    }
    onComplete({ schoolName, studentId, name });
  };

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Replace any non-digit character with empty string
    const value = e.target.value.replace(/[^0-9]/g, '');
    setStudentId(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md animate-fade-in border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">NursingSkill Pro</h1>
          <p className="text-gray-500">간호대학생을 위한 핵심술기 자가학습</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">학교명</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <GraduationCap size={18} />
              </div>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="예: 한국대학교"
                className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">학번</label>
              <input
                type="text"
                inputMode="numeric"
                value={studentId}
                onChange={handleStudentIdChange}
                placeholder="20240001"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-700 transition shadow-md flex items-center justify-center gap-2 group"
          >
            학습 시작하기
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-8">
          입력하신 정보는 로컬 기기에만 저장됩니다.
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;