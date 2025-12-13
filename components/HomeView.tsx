import React from 'react';
import { ViewState, UserProfile } from '../types';
import { 
  BookOpen, 
  Video, 
  ClipboardCheck, 
  Gamepad2, 
  BarChart2, 
  ArrowRight,
  Sparkles,
  GraduationCap
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: ViewState) => void;
  userProfile: UserProfile | null;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate, userProfile }) => {
  const menuItems = [
    {
      view: ViewState.PRACTICE,
      title: '핵심술기 연습',
      description: '단계별 가이드와 함께 활력징후 측정을 체계적으로 학습하세요.',
      icon: BookOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      view: ViewState.VIDEO,
      title: '동영상 촬영',
      description: '자신의 실습 과정을 녹화하고 다시 보며 부족한 점을 점검하세요.',
      icon: Video,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      view: ViewState.SELF_CHECK,
      title: '자가 평가',
      description: '체크리스트를 통해 자신의 수행 능력을 객관적으로 평가하세요.',
      icon: ClipboardCheck,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      view: ViewState.GAME,
      title: '게임 학습',
      description: '물품 준비와 순서 맞추기 게임으로 재미있게 핵심 콕콕!',
      icon: Gamepad2,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      view: ViewState.STATS,
      title: '학습 대시보드',
      description: '나의 학습 현황과 성취도 변화를 그래프로 확인하세요.',
      icon: BarChart2,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="h-full overflow-y-auto pr-2">
      <div className="mb-8 p-1">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          안녕하세요, {userProfile ? userProfile.name : '학생'}님! <span className="animate-bounce">👋</span>
        </h1>
        {userProfile && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
                <GraduationCap size={16} />
                <span>{userProfile.schoolName}</span>
                <span className="text-gray-300">|</span>
                <span>{userProfile.studentId}</span>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {menuItems.map((item) => (
          <button
            key={item.title}
            onClick={() => onNavigate(item.view)}
            className="flex flex-col text-left bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className={`w-14 h-14 ${item.bgColor} ${item.textColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
              <item.icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-500 text-sm mb-6 flex-1 leading-relaxed">{item.description}</p>
            <div className={`flex items-center text-sm font-bold ${item.textColor}`}>
              시작하기 <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
      
      {/* Daily Tip Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 opacity-10">
          <Sparkles size={200} />
        </div>
        
        <div className="z-10 mb-4 md:mb-0 max-w-2xl">
          <div className="flex items-center gap-2 mb-2 text-teal-200 uppercase text-xs font-bold tracking-wider">
            <Sparkles size={14} /> Today's Tip
          </div>
          <h3 className="text-xl font-bold mb-2">정확한 맥박 측정을 위한 팁 💡</h3>
          <p className="text-teal-50 opacity-90">
            맥박 측정 시 요골동맥을 너무 세게 누르면 맥박이 차단되어 촉지되지 않을 수 있습니다. 
            검지와 중지로 적당한 압력을 주어 부드럽게 눌러주세요.
          </p>
        </div>
        
        <button 
            onClick={() => onNavigate(ViewState.PRACTICE)}
            className="z-10 px-6 py-3 bg-white text-teal-700 font-bold rounded-xl hover:bg-teal-50 hover:shadow-lg transition transform hover:scale-105 active:scale-95 whitespace-nowrap"
        >
            바로 연습하기
        </button>
      </div>

      <div className="mt-8 text-center text-gray-400 text-sm pb-4">
        &copy; 2024 NursingSkill Pro. All rights reserved.
      </div>
    </div>
  );
};

export default HomeView;