import React, { useRef, useState, useEffect } from 'react';
import { Camera, StopCircle, Play, Save, RefreshCw, ArrowLeft, Activity, Stethoscope, Wind, Droplets, Book, ChevronRight, CheckCircle2, Circle, CameraOff, Mic } from 'lucide-react';
import { SKILLS_LIST } from '../constants';
import { NursingSkill } from '../types';

const VideoRecorder: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<NursingSkill | null>(null);
  const [recordings, setRecordings] = useState<Record<string, string>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<string, Set<number>>>({});

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(recordings).forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  // Initialize checks when skill is selected
  useEffect(() => {
    if (selectedSkill && !checkedSteps[selectedSkill.id]) {
      setCheckedSteps(prev => ({
        ...prev,
        [selectedSkill.id]: new Set()
      }));
    }
  }, [selectedSkill]);

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error(err);
      setError("카메라 및 마이크 권한이 필요합니다. 브라우저 설정에서 허용해주세요.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Manage camera lifecycle
  useEffect(() => {
    // If a recording exists, or we leave the skill, make sure camera is stopped
    if (selectedSkill && recordings[selectedSkill.id]) {
      stopCamera();
    }
    return () => stopCamera();
  }, [selectedSkill, recordings]);

  const startRecording = async () => {
    if (!videoRef.current?.srcObject) {
      await startCamera();
    }
    
    // Check again if stream is active (in case startCamera failed)
    setTimeout(() => {
        if (!videoRef.current?.srcObject) return;

        const stream = videoRef.current.srcObject as MediaStream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const localChunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            localChunks.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(localChunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          
          if (selectedSkill) {
            setRecordings(prev => ({
              ...prev,
              [selectedSkill.id]: url
            }));
          }
          stopCamera();
        };

        mediaRecorder.start();
        setIsRecording(true);
    }, 500);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRetry = () => {
    if (selectedSkill) {
      const url = recordings[selectedSkill.id];
      if (url) URL.revokeObjectURL(url);
      
      const newRecordings = { ...recordings };
      delete newRecordings[selectedSkill.id];
      setRecordings(newRecordings);
      
      // Reset checks for this skill
      setCheckedSteps(prev => ({
        ...prev,
        [selectedSkill.id]: new Set()
      }));
      
      // Reset state so user can start camera again manually
      setIsCameraActive(false);
    }
  };

  const toggleStepCheck = (skillId: string, stepId: number) => {
    setCheckedSteps(prev => {
      const currentSet = new Set(prev[skillId] || []);
      if (currentSet.has(stepId)) {
        currentSet.delete(stepId);
      } else {
        currentSet.add(stepId);
      }
      return { ...prev, [skillId]: currentSet };
    });
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

  // View 1: Skill Selection List
  if (!selectedSkill) {
    return (
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">동영상 촬영 - 술기 선택</h2>
          <p className="text-gray-600">녹화할 핵심술기를 선택해주세요.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
          {SKILLS_LIST.map((skill) => (
            <button
              key={skill.id}
              onClick={() => setSelectedSkill(skill)}
              className="flex items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all text-left group relative"
            >
              <div className="mr-4 p-3 bg-gray-50 rounded-lg group-hover:bg-teal-50 transition-colors">
                {getSkillIcon(skill.id)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-teal-700 transition-colors">
                  {skill.title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  {recordings[skill.id] ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      <Play size={10} fill="currentColor" /> 저장됨
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
                      녹화 전
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-teal-500" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  const hasRecording = !!recordings[selectedSkill.id];
  const currentVideoUrl = recordings[selectedSkill.id];
  const skillChecks = checkedSteps[selectedSkill.id] || new Set();

  // View 2: Recorder & Player
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden relative animate-fade-in">
      {/* Header */}
      <div className="p-4 bg-gray-900 text-white flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSelectedSkill(null)} 
            className="hover:bg-gray-700 p-2 rounded-full transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-bold truncate">{selectedSkill.title}</h2>
        </div>
        {hasRecording && (
          <div className="flex gap-2">
             <button
              onClick={handleRetry}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition"
            >
              <RefreshCw size={14} /> 다시 촬영
            </button>
            <a
              href={currentVideoUrl}
              download={`${selectedSkill.id}-practice.webm`}
              className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 rounded text-xs font-bold transition"
            >
              <Save size={14} /> 저장
            </a>
          </div>
        )}
      </div>

      {/* Main Layout: Split Video and Checklist */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-gray-100">
        
        {/* Left/Top: Video Area */}
        <div className={`relative flex flex-col ${hasRecording ? 'md:w-1/2 h-1/2 md:h-full' : 'w-full h-full'}`}>
          <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden group">
            {error ? (
              <div className="text-white text-center p-6 max-w-xs">
                <CameraOff size={48} className="mx-auto mb-4 text-gray-500" />
                <p className="mb-4 text-red-400 text-sm">{error}</p>
                <button 
                  onClick={startCamera}
                  className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-sm"
                >
                  권한 재요청
                </button>
              </div>
            ) : hasRecording ? (
              <video 
                src={currentVideoUrl} 
                controls 
                className="w-full h-full object-contain"
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover transform scale-x-[-1] ${!isCameraActive ? 'hidden' : ''}`}
                />
                {!isCameraActive && (
                  <div className="text-center">
                    <button
                      onClick={startCamera}
                      className="flex flex-col items-center gap-3 text-gray-400 hover:text-white transition"
                    >
                      <div className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 transition">
                        <Camera size={32} />
                      </div>
                      <span className="text-sm font-medium">카메라 켜기</span>
                    </button>
                  </div>
                )}
              </>
            )}
            
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 bg-opacity-90 text-white px-3 py-1 rounded-full animate-pulse z-20">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-xs font-bold">REC</span>
              </div>
            )}
          </div>

          {/* Recording Controls (Only when no recording exists) */}
          {!hasRecording && (
            <div className="p-6 bg-gray-900 flex justify-center items-center shrink-0">
               {isRecording ? (
                  <button
                    onClick={stopRecording}
                    className="flex flex-col items-center gap-2 group"
                  >
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-red-500 group-hover:scale-105 transition">
                        <div className="w-6 h-6 bg-red-500 rounded-sm"></div>
                     </div>
                     <span className="text-white text-xs">촬영 종료</span>
                  </button>
                ) : (
                  <button
                    onClick={startRecording}
                    disabled={!isCameraActive && !error} 
                    className={`flex flex-col items-center gap-2 group ${!isCameraActive ? 'opacity-50' : 'opacity-100'}`}
                  >
                     <div className={`w-16 h-16 bg-red-600 rounded-full flex items-center justify-center border-4 border-white ${isCameraActive ? 'group-hover:bg-red-700' : ''} transition`}>
                        {isCameraActive ? <div className="w-4 h-4 bg-white rounded-full"></div> : <Camera size={24} className="text-white" />}
                     </div>
                     <span className="text-white text-xs">{isCameraActive ? '촬영 시작' : '카메라 대기'}</span>
                  </button>
                )}
            </div>
          )}
        </div>

        {/* Right/Bottom: Checklist Area (Visible during playback) */}
        {hasRecording && (
          <div className="md:w-1/2 h-1/2 md:h-full bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 bg-gray-50 border-b flex items-center gap-2">
               <CheckCircle2 size={20} className="text-teal-600" />
               <h3 className="font-bold text-gray-800">영상 검토 체크리스트</h3>
               <span className="text-xs bg-white border px-2 py-0.5 rounded text-gray-500 ml-auto">
                 {skillChecks.size} / {selectedSkill.steps.length} 완료
               </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
               {selectedSkill.steps.map(step => (
                 <button 
                   key={step.id}
                   onClick={() => toggleStepCheck(selectedSkill.id, step.id)}
                   className={`w-full text-left p-3 rounded-lg border-2 transition-all flex gap-3 ${
                     skillChecks.has(step.id) 
                       ? 'border-teal-500 bg-teal-50' 
                       : 'border-transparent bg-gray-50 hover:bg-gray-100'
                   }`}
                 >
                   <div className={`mt-0.5 ${skillChecks.has(step.id) ? 'text-teal-600' : 'text-gray-300'}`}>
                     {skillChecks.has(step.id) ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                   </div>
                   <div>
                      <div className={`text-sm font-medium ${skillChecks.has(step.id) ? 'text-teal-900' : 'text-gray-700'}`}>
                        {step.instruction}
                      </div>
                      {step.isCritical && (
                        <span className="text-[10px] text-red-500 font-bold mt-1 inline-block">
                          * 필수 항목
                        </span>
                      )}
                   </div>
                 </button>
               ))}
            </div>
            <div className="p-3 bg-gray-50 text-center text-xs text-gray-400 border-t">
              영상을 보며 수행한 항목을 체크해보세요
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;