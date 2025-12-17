import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Award, Calendar, AlertCircle, Download } from 'lucide-react';
import { AssessmentRecord } from '../types';
import * as XLSX from 'xlsx';

const Dashboard: React.FC = () => {
  const [history, setHistory] = useState<AssessmentRecord[]>([]);
  const [lineData, setLineData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    bestScore: 0,
    averageScore: 0,
    totalAttempts: 0,
    recentDate: '-'
  });

  useEffect(() => {
    // Load history from localStorage
    const savedHistory: AssessmentRecord[] = JSON.parse(localStorage.getItem('nursing_history') || '[]');
    setHistory(savedHistory);

    if (savedHistory.length > 0) {
      // 1. Process for Line Chart (Sequence of attempts)
      const processedLineData = savedHistory.map((record, index) => ({
        name: `${index + 1}회`,
        score: record.score,
        date: new Date(record.date).toLocaleDateString(),
        tooltipTitle: `${record.skillTitle} (${record.type === 'SELF_CHECK' ? '자가평가' : '게임'})`
      }));
      setLineData(processedLineData);

      // 2. Process for Bar Chart (Proficiency by Skill)
      const skillGroups: Record<string, number[]> = {};
      savedHistory.forEach(record => {
        const title = record.skillTitle || '기타';
        if (!skillGroups[title]) skillGroups[title] = [];
        skillGroups[title].push(record.score);
      });

      const processedBarData = Object.keys(skillGroups).map(title => ({
        name: title.length > 8 ? title.substring(0, 8) + '...' : title, // Truncate for display
        fullName: title,
        val: Math.round(skillGroups[title].reduce((a, b) => a + b, 0) / skillGroups[title].length)
      }));
      setBarData(processedBarData);

      // 3. Stats
      const best = Math.max(...savedHistory.map(r => r.score));
      const total = savedHistory.length;
      const avg = Math.round(savedHistory.reduce((a, b) => a + b.score, 0) / total);
      
      const lastDate = new Date(savedHistory[savedHistory.length - 1].date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      let recentStr = '오늘';
      if (diffDays === 1) recentStr = '어제';
      else if (diffDays > 1) recentStr = `${diffDays}일 전`;

      setStats({
        bestScore: best,
        averageScore: avg,
        totalAttempts: total,
        recentDate: recentStr
      });
    }
  }, []);

  const handleExportExcel = () => {
    if (history.length === 0) {
      alert('내보낼 데이터가 없습니다.');
      return;
    }

    // Prepare data for Excel
    const excelData = history.map((record, index) => {
        const dateObj = new Date(record.date);
        
        let typeName = '기타';
        if (record.type === 'SELF_CHECK') typeName = '자가평가';
        else if (record.type === 'GAME_ITEM') typeName = '물품게임';
        else if (record.type === 'GAME_ORDER') typeName = '순서게임';

        return {
            'No.': index + 1,
            '날짜': dateObj.toLocaleDateString(),
            '시간': dateObj.toLocaleTimeString(),
            '구분': typeName,
            '술기명': record.skillTitle,
            '점수': record.score,
            '결과': record.passed ? '통과' : '미달'
        };
    });

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    
    // Auto-adjust column width (approximate)
    const wscols = [
        { wch: 6 },  // No
        { wch: 12 }, // Date
        { wch: 10 }, // Time
        { wch: 10 }, // Type
        { wch: 25 }, // Skill Title
        { wch: 8 },  // Score
        { wch: 8 }   // Result
    ];
    worksheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workbook, worksheet, "학습이력");

    // Generate file name with current timestamp
    const today = new Date();
    const fileName = `NursingSkill_Report_${today.getFullYear()}${(today.getMonth()+1).toString().padStart(2,'0')}${today.getDate().toString().padStart(2,'0')}.xlsx`;

    // Download
    XLSX.writeFile(workbook, fileName);
  };

  if (history.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <AlertCircle size={48} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">아직 학습 기록이 없습니다.</h3>
        <p className="text-gray-500 max-w-md">
          게임이나 자가평가를 완료하면 이곳에 학습 성취도가 기록됩니다.<br/>
          지금 바로 실습을 시작해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto space-y-6">
      <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">학습 대시보드</h2>
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm font-medium text-sm"
          >
            <Download size={16} />
            엑셀로 내보내기
          </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Award size={24} />
            </div>
            <h3 className="text-gray-500 font-medium">최고 점수</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.bestScore}점</p>
          <p className="text-xs text-blue-500 mt-1">계속해서 기록을 경신해보세요!</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-gray-500 font-medium">평균 점수</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.averageScore}점</p>
          <p className="text-xs text-gray-400 mt-1">총 {stats.totalAttempts}회 평가 기준</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Calendar size={24} />
            </div>
            <h3 className="text-gray-500 font-medium">최근 학습일</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.recentDate}</p>
          <p className="text-xs text-gray-400 mt-1">꾸준한 학습이 중요합니다.</p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">시행 회차별 성취도 변화</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                formatter={(value: any, name: any, props: any) => [
                    `${value}점`, 
                    props.payload.tooltipTitle
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#0d9488" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

       {/* Secondary Chart */}
       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">항목(술기)별 평균 숙련도</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 11}} />
               <YAxis hide domain={[0, 100]} />
               <Tooltip 
                 cursor={{fill: 'transparent'}}
                 formatter={(value: any) => [`${value}점`, '평균 점수']}
                 labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) {
                        return payload[0].payload.fullName;
                    }
                    return label;
                 }}
               />
               <Bar dataKey="val" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;