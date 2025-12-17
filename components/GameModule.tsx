import React, { useState, useEffect } from 'react';
import { GAME_ITEMS_POOL, SKILLS_LIST } from '../constants';
import { Timer, Check, X, RotateCcw, Trophy, ArrowRight, ArrowLeft, Stethoscope, Activity, Droplets, Wind, Book } from 'lucide-react';
import { GameItem, NursingSkill, AssessmentRecord } from '../types';

type GameType = 'MENU' | 'SKILL_SELECT' | 'ITEM_SELECT' | 'SEQUENCE';
type GameState = 'PLAYING' | 'WON' | 'LOST';

const GameModule: React.FC = () => {
  const [gameType, setGameType] = useState<GameType>('MENU');
  const [targetGameMode, setTargetGameMode] = useState<'ITEM_SELECT' | 'SEQUENCE' | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<NursingSkill | null>(null);

  // Game State
  const [gameState, setGameState] = useState<GameState>('PLAYING');
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);

  // Item Game State
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set<string>());
  
  // Sequence Game State
  const [sequencePool, setSequencePool] = useState<any[]>([]);
  const [userSequence, setUserSequence] = useState<any[]>([]);

  // Timer Effect
  useEffect(() => {
    let interval: number;
    if (gameState === 'PLAYING' && (gameType === 'ITEM_SELECT' || gameType === 'SEQUENCE') && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleGameOver(0, 'LOST'); // Timeout means 0 score for now or calculation
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, gameType, timeLeft]);

  // Helper to handle game end and saving
  const handleGameOver = (finalScore: number, state: GameState) => {
    setScore(finalScore);
    setGameState(state);

    if (selectedSkill) {
        const newRecord: AssessmentRecord = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            score: finalScore,
            passed: state === 'WON' || finalScore >= 80,
            type: gameType === 'ITEM_SELECT' ? 'GAME_ITEM' : 'GAME_ORDER',
            skillTitle: selectedSkill.title
        };

        try {
            const history = JSON.parse(localStorage.getItem('nursing_history') || '[]');
            history.push(newRecord);
            localStorage.setItem('nursing_history', JSON.stringify(history));
        } catch (e) {
            console.error("Failed to save game history", e);
        }
    }
  };

  const handleStartGameRequest = (mode: 'ITEM_SELECT' | 'SEQUENCE') => {
    setTargetGameMode(mode);
    setGameType('SKILL_SELECT');
  };

  const handleSkillSelect = (skill: NursingSkill) => {
    setSelectedSkill(skill);
    if (targetGameMode) {
        startGame(targetGameMode, skill);
    }
  };

  const startGame = (type: 'ITEM_SELECT' | 'SEQUENCE', skill: NursingSkill) => {
    setGameType(type);
    setGameState('PLAYING');
    setScore(0);
    
    if (type === 'ITEM_SELECT') {
      setTimeLeft(45); // Give a bit more time as there are more items
      setSelectedItemIds(new Set<string>());
    } else if (type === 'SEQUENCE') {
      setTimeLeft(120);
      
      const stepsToOrder = skill.steps.map(s => ({ id: s.id, text: s.instruction }));
      
      // Shuffle
      const shuffled = [...stepsToOrder].sort(() => Math.random() - 0.5);
      setSequencePool(shuffled);
      setUserSequence([]);
    }
  };

  const handleItemToggle = (item: GameItem) => {
    if (gameState !== 'PLAYING') return;
    
    const newSet = new Set(selectedItemIds);
    if (newSet.has(item.id)) {
      newSet.delete(item.id);
    } else {
      newSet.add(item.id);
    }
    setSelectedItemIds(newSet);
  };

  const submitItemGame = () => {
    if (!selectedSkill) return;

    // Check answers based on selectedSkill.requiredItems
    const requiredItemNames = selectedSkill.requiredItems;
    
    // Find IDs of correct items from the POOL based on name matching
    const correctIds: string[] = GAME_ITEMS_POOL
        .filter((i: GameItem) => requiredItemNames.includes(i.name))
        .map((i: GameItem) => i.id);

    const selectedArray: string[] = Array.from(selectedItemIds);
    
    const missedCorrect = correctIds.filter((id: string) => !selectedItemIds.has(id));
    const selectedWrong = selectedArray.filter((id: string) => !correctIds.includes(id));

    let calculatedScore = 0;
    let finalState: GameState = 'LOST';

    if (missedCorrect.length === 0 && selectedWrong.length === 0) {
      calculatedScore = 100;
      finalState = 'WON';
    } else {
      // Simple scoring formula
      const totalCorrect = correctIds.length;
      const correctSelected = totalCorrect - missedCorrect.length;
      const rawScore = Math.max(0, (correctSelected * 10) - (selectedWrong.length * 10)); // Arbitrary scoring
      
      calculatedScore = Math.min(100, rawScore);
      finalState = 'LOST';
    }
    handleGameOver(calculatedScore, finalState);
  };

  const handleSequenceSelect = (step: any) => {
    if (gameState !== 'PLAYING') return;
    
    // Add to user sequence, remove from pool
    setUserSequence(prev => [...prev, step]);
    setSequencePool(prev => prev.filter(s => s.id !== step.id));
  };

  const submitSequenceGame = () => {
    // Check order
    let isCorrect = true;
    for (let i = 0; i < userSequence.length - 1; i++) {
        // Since we are sorting by ID (step ID reflects order)
        if (userSequence[i].id > userSequence[i+1].id) {
            isCorrect = false;
            break;
        }
    }

    let calculatedScore = 0;
    let finalState: GameState = 'LOST';

    if (isCorrect && sequencePool.length === 0) {
        calculatedScore = 100;
        finalState = 'WON';
    } else {
        calculatedScore = 40; // Participation points
        finalState = 'LOST';
    }
    handleGameOver(calculatedScore, finalState);
  };

  const getSkillIcon = (id: string) => {
    switch (id) {
      case 'vital-signs': return <Activity size={24} className="text-pink-500" />;
      case 'tube-feeding': return <Stethoscope size={24} className="text-orange-500" />;
      case 'suction': return <Wind size={24} className="text-blue-500" />;
      case 'iv-therapy': return <Droplets size={24} className="text-sky-500" />;
      default: return <Book size={24} className="text-teal-500" />;
    }
  };

  const renderMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 h-full place-content-center">
      <button 
        onClick={() => handleStartGameRequest('ITEM_SELECT')}
        className="bg-blue-500 hover:bg-blue-600 text-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4 transition transform hover:-translate-y-1"
      >
        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl">💊</div>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">물품 준비 게임</h3>
          <p className="text-blue-100">30초 안에 필요한 물품을 모두 고르세요!</p>
        </div>
      </button>

      <button 
        onClick={() => handleStartGameRequest('SEQUENCE')}
        className="bg-purple-500 hover:bg-purple-600 text-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4 transition transform hover:-translate-y-1"
      >
        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl">🔢</div>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">순서 맞추기 게임</h3>
          <p className="text-purple-100">뒤죽박죽 섞인 순서를 바로잡으세요!</p>
        </div>
      </button>
    </div>
  );

  const renderSkillSelect = () => (
    <div className="p-8 h-full overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {targetGameMode === 'ITEM_SELECT' ? '물품 준비' : '순서 맞추기'} - 술기 선택
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SKILLS_LIST.map(skill => (
                <button
                    key={skill.id}
                    onClick={() => handleSkillSelect(skill)}
                    className="flex items-center p-6 bg-white rounded-xl shadow-md border-2 border-transparent hover:border-teal-500 hover:shadow-lg transition group text-left"
                >
                    <div className="mr-4 p-3 bg-gray-50 rounded-full group-hover:bg-teal-50">
                        {getSkillIcon(skill.id)}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-teal-700">{skill.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{skill.requiredItems.length}개 물품 / {skill.steps.length}단계</p>
                    </div>
                </button>
            ))}
        </div>
    </div>
  );

  const renderResultOverlay = () => {
    if (gameState === 'PLAYING') return null;
    return (
      <div className="absolute inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center animate-fade-in">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
          {gameState === 'WON' ? (
            <div className="text-green-500 mb-4 flex justify-center"><Trophy size={64} /></div>
          ) : (
            <div className="text-red-500 mb-4 flex justify-center"><X size={64} /></div>
          )}
          <h2 className="text-3xl font-bold mb-2">{gameState === 'WON' ? '성공!' : '실패'}</h2>
          <p className="text-gray-600 mb-6">점수: <span className="font-bold text-xl">{score}점</span></p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => {
                setGameType('MENU');
                setGameState('PLAYING');
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              메뉴로
            </button>
            <button 
              onClick={() => {
                  if (selectedSkill && targetGameMode) startGame(targetGameMode, selectedSkill);
              }}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium flex items-center gap-2"
            >
              <RotateCcw size={18} /> 다시하기
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-slate-50 relative rounded-lg overflow-hidden shadow-inner">
      {renderResultOverlay()}

      {gameType !== 'MENU' && (
        <div className="bg-white p-4 shadow-sm flex justify-between items-center z-10 relative">
          <button 
            onClick={() => {
                if (gameType === 'SKILL_SELECT') setGameType('MENU');
                else setGameType('SKILL_SELECT');
            }} 
            className="text-gray-500 hover:text-gray-800 font-medium flex items-center gap-1"
          >
             <ArrowLeft size={18} /> {gameType === 'SKILL_SELECT' ? '메인 메뉴' : '술기 선택'}
          </button>
          
          {(gameType === 'ITEM_SELECT' || gameType === 'SEQUENCE') && (
            <div className={`flex items-center gap-2 text-xl font-bold font-mono ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
                <Timer /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
          
          {selectedSkill && (gameType === 'ITEM_SELECT' || gameType === 'SEQUENCE') && (
               <div className="text-sm font-bold text-teal-600 hidden md:block">
                   {selectedSkill.title}
               </div>
          )}
        </div>
      )}

      {gameType === 'MENU' && renderMenu()}
      {gameType === 'SKILL_SELECT' && renderSkillSelect()}

      {gameType === 'ITEM_SELECT' && (
        <div className="p-6 h-[calc(100%-4rem)] overflow-y-auto">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-20">
            {GAME_ITEMS_POOL.map(item => (
              <button
                key={item.id}
                onClick={() => handleItemToggle(item)}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all aspect-square justify-center ${
                  selectedItemIds.has(item.id)
                    ? 'border-blue-500 bg-blue-50 transform scale-105 shadow-md'
                    : 'border-gray-200 bg-white hover:border-blue-200'
                }`}
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight break-keep">{item.name}</span>
                {selectedItemIds.has(item.id) && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-0.5">
                    <Check size={10} />
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-center z-10">
             <button 
               onClick={submitItemGame}
               className="w-full max-w-md bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700"
             >
               제출하기
             </button>
          </div>
        </div>
      )}

      {gameType === 'SEQUENCE' && (
        <div className="p-6 h-[calc(100%-4rem)] flex flex-col">
            <div className="flex-1 flex gap-4 overflow-hidden">
                {/* Pool */}
                <div className="flex-1 bg-gray-100 rounded-xl p-4 flex flex-col overflow-hidden">
                    <h4 className="font-bold text-gray-500 mb-4 flex-shrink-0">선택지</h4>
                    <div className="space-y-2 overflow-y-auto pr-2">
                        {sequencePool.map(step => (
                            <button
                                key={step.id}
                                onClick={() => handleSequenceSelect(step)}
                                className="w-full text-left p-3 bg-white rounded-lg border shadow-sm hover:bg-blue-50 transition text-sm text-gray-900"
                            >
                                {step.text}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center text-gray-400">
                    <ArrowRight size={32} />
                </div>

                {/* Result List */}
                <div className="flex-1 bg-blue-50 rounded-xl p-4 border-2 border-dashed border-blue-200 flex flex-col overflow-hidden">
                    <h4 className="font-bold text-blue-800 mb-4 flex-shrink-0">순서대로 나열됨</h4>
                    <div className="space-y-2 overflow-y-auto pr-2">
                        {userSequence.map((step, idx) => (
                            <div key={step.id} className="p-3 bg-white rounded-lg border border-blue-100 shadow-sm flex gap-3 items-center">
                                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    {idx + 1}
                                </span>
                                <span className="text-sm line-clamp-2 text-gray-900">{step.text}</span>
                            </div>
                        ))}
                        {userSequence.length === 0 && (
                            <div className="text-center text-gray-400 mt-10">왼쪽에서 카드를 선택하세요</div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="mt-4 flex justify-end flex-shrink-0">
                <button 
                    onClick={submitSequenceGame}
                    disabled={sequencePool.length > 0}
                    className={`px-8 py-3 rounded-xl font-bold shadow-lg transition ${
                        sequencePool.length > 0 
                        ? 'bg-gray-300 text-gray-500' 
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                >
                    결과 확인
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default GameModule;