import React, { useState, useEffect } from 'react';
import { ViewState, UserProfile } from './types';
import HomeView from './components/HomeView';
import PracticeModule from './components/PracticeModule';
import VideoRecorder from './components/VideoRecorder';
import SelfCheck from './components/SelfCheck';
import GameModule from './components/GameModule';
import Dashboard from './components/Dashboard';
import WelcomeScreen from './components/WelcomeScreen';
import { 
  Home,
  BookOpen, 
  Video, 
  ClipboardCheck, 
  Gamepad2, 
  BarChart2, 
  Activity,
  Menu,
  UserCircle
} from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Load profile from local storage if exists
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to parse user profile");
      }
    }
  }, []);

  const handleLogin = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
  };

  const handleLogout = () => {
    setUserProfile(null);
    localStorage.removeItem('userProfile');
    setCurrentView(ViewState.HOME);
  };

  if (!userProfile) {
    return <WelcomeScreen onComplete={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case ViewState.HOME:
        return <HomeView onNavigate={setCurrentView} userProfile={userProfile} />;
      case ViewState.PRACTICE:
        return <PracticeModule />;
      case ViewState.VIDEO:
        return <VideoRecorder />;
      case ViewState.SELF_CHECK:
        return <SelfCheck />;
      case ViewState.GAME:
        return <GameModule />;
      case ViewState.STATS:
        return <Dashboard />;
      default:
        return <HomeView onNavigate={setCurrentView} userProfile={userProfile} />;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all duration-200 ${
        currentView === view
          ? 'bg-teal-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100 hover:text-teal-600'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm z-20">
        <div className="flex items-center gap-2 text-teal-700">
          <Activity size={24} />
          <h1 className="text-xl font-bold tracking-tight">NursingSkill Pro</h1>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={`
        fixed inset-y-0 left-0 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 bg-white border-r border-gray-200 z-30 flex flex-col shadow-lg md:shadow-none
      `}>
        <div 
          className="p-6 hidden md:flex items-center gap-2 text-teal-700 border-b border-gray-100 cursor-pointer"
          onClick={() => setCurrentView(ViewState.HOME)}
        >
          <Activity size={28} />
          <h1 className="text-xl font-bold tracking-tight">NursingSkill Pro</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem view={ViewState.HOME} icon={Home} label="홈" />

          <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            학습 모듈
          </div>
          <NavItem view={ViewState.PRACTICE} icon={BookOpen} label="연습하기" />
          <NavItem view={ViewState.VIDEO} icon={Video} label="동영상 촬영" />
          <NavItem view={ViewState.SELF_CHECK} icon={ClipboardCheck} label="자가 평가" />
          
          <div className="mt-6 px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            강화 및 분석
          </div>
          <NavItem view={ViewState.GAME} icon={Gamepad2} label="게임 (Gamification)" />
          <NavItem view={ViewState.STATS} icon={BarChart2} label="대시보드" />
        </nav>

        <div className="p-4 border-t border-gray-100">
           <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                  <UserCircle size={24} />
              </div>
              <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{userProfile.name}</p>
                  <p className="text-xs text-gray-500 truncate">{userProfile.schoolName}</p>
              </div>
           </div>
           
           <button 
             onClick={handleLogout}
             className="w-full py-2 px-4 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition"
           >
             로그아웃
           </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative p-4 md:p-6">
        <div className="h-full w-full max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;