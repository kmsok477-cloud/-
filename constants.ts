import { NursingSkill, GameItem } from './types';

export const VITAL_SIGNS_SKILL: NursingSkill = {
  id: 'vital-signs',
  title: '활력징후 측정 (Vital Signs)',
  description: '혈압, 맥박, 호흡, 체온을 정확하게 측정하는 핵심 기본간호술입니다.',
  requiredItems: [
    '청진기', '혈압계', '체온계', '초침 시계', '알코올 솜', '손소독제', '간호기록지'
  ],
  steps: [
    {
      id: 1,
      instruction: '물과 비누로 손위생을 실시한다.',
      explanation: '감염 예방을 위한 가장 기본적인 절차입니다. 40-60초간 시행합니다.',
      imageUrl: 'https://picsum.photos/400/200?random=1',
      isCritical: true,
    },
    {
      id: 2,
      instruction: '필요한 물품을 준비한다.',
      explanation: '혈압계, 청진기, 체온계, 솜, 기록지 등을 트레이에 준비합니다.',
      imageUrl: 'https://picsum.photos/400/200?random=2',
      isCritical: false,
    },
    {
      id: 3,
      instruction: '대상자에게 간호사 자신을 소개한다.',
      explanation: '안녕하세요, 담당간호사 OOO입니다.',
      isCritical: false,
    },
    {
      id: 4,
      instruction: '대상자의 이름을 개방형으로 질문하여 대상자를 확인한다.',
      explanation: '환자 리스트밴드와 대조하여 정확한 환자 확인이 필요합니다.',
      isCritical: true,
    },
    {
      id: 5,
      instruction: '대상자에게 체온 측정의 목적과 절차를 설명한다.',
      explanation: '설명을 통해 대상자의 불안을 감소시키고 협조를 구합니다.',
      isCritical: false,
    },
    {
      id: 6,
      instruction: '전자 체온계를 겨드랑이 중앙에 밀착시키고 팔을 접게 한다.',
      explanation: '피부와 밀착되어야 정확한 체온 측정이 가능합니다.',
      imageUrl: 'https://picsum.photos/400/200?random=3',
      isCritical: true,
    },
    {
      id: 7,
      instruction: '요골동맥을 찾아 맥박을 1분간 측정한다.',
      explanation: '검지와 중지를 사용하여 요골동맥 부위를 가볍게 누릅니다.',
      isCritical: true,
    },
    {
      id: 8,
      instruction: '맥박 측정 후 손을 떼지 않은 채로 호흡을 1분간 측정한다.',
      explanation: '환자가 호흡 측정임을 인지하면 호흡 양상이 변할 수 있습니다.',
      isCritical: true,
    },
    {
      id: 9,
      instruction: '상완동맥을 찾아 커프를 감고 혈압을 측정한다.',
      explanation: '커프의 하단이 팔꿈치 접히는 선보다 2-3cm 위에 오도록 합니다.',
      imageUrl: 'https://picsum.photos/400/200?random=4',
      isCritical: true,
    },
    {
      id: 10,
      instruction: '측정 결과를 기록하고 대상자에게 알린다.',
      explanation: '비정상 수치가 발견될 경우 즉시 수간호사나 의사에게 보고합니다.',
      isCritical: true,
    },
  ],
};

export const TUBE_FEEDING_SKILL: NursingSkill = {
  id: 'tube-feeding',
  title: '간헐적 위관영양',
  description: 'L-tube를 통해 영양액을 안전하게 공급하는 기술입니다.',
  requiredItems: ['처방지', '위관영양액', '50cc 주사기', '물', '청진기', '일회용 장갑', '손소독제'],
  steps: [
    { id: 1, instruction: '물과 비누로 손위생을 실시한다.', explanation: '교차 감염을 예방합니다.', isCritical: true },
    { id: 2, instruction: '처방된 위관영양액을 체온 정도로 데운다.', explanation: '차가운 영양액은 복부 경련이나 설사를 유발할 수 있습니다.', isCritical: true },
    { id: 3, instruction: '대상자를 확인하고 절차를 설명한다.', explanation: '환자의 협조를 구하고 불안을 감소시킵니다.', isCritical: false },
    { id: 4, instruction: '좌위 또는 반좌위(30-45도)를 취하게 한다.', explanation: '기도 흡인을 예방하기 위한 자세입니다.', isCritical: true },
    { id: 5, instruction: '장갑을 끼고 위관의 위치를 확인한다.', explanation: '위 내용물 흡인 또는 공기 주입 후 청진으로 확인합니다.', isCritical: true },
    { id: 6, instruction: '위 잔류량을 확인한다.', explanation: '소화 상태를 확인합니다. 잔류량이 많으면 의사에게 보고합니다.', isCritical: true },
    { id: 7, instruction: '위관을 꺾어 쥔 상태에서 주사기에 영양액을 채워 연결한다.', explanation: '공기가 위장으로 들어가는 것을 방지합니다.', isCritical: false },
    { id: 8, instruction: '중력에 의해 천천히 주입되도록 한다.', explanation: '너무 빠른 주입은 오심, 구토를 유발할 수 있습니다.', isCritical: true },
    { id: 9, instruction: '주입 후 물 30-60ml를 주입하여 위관을 씻어준다.', explanation: '위관의 개방성을 유지하고 찌꺼기로 인한 세균 번식을 막습니다.', isCritical: false },
    { id: 10, instruction: '주입 후 30분 이상 앉아있도록 교육한다.', explanation: '역류 및 흡인을 예방합니다.', isCritical: true },
  ]
};

export const SUCTION_SKILL: NursingSkill = {
  id: 'suction',
  title: '기관내 흡인',
  description: '기도 내 분비물을 제거하여 기도를 유지하고 환기를 돕습니다.',
  requiredItems: ['흡인기', '멸균 흡인 카테터', '멸균 장갑', '생리식염수', '산소', '손소독제'],
  steps: [
    { id: 1, instruction: '손위생 후 필요한 물품을 준비한다.', explanation: '무균술 적용이 필요한 절차입니다.', isCritical: true },
    { id: 2, instruction: '흡인압을 점검한다. (성인 110-150mmHg)', explanation: '과도한 압력은 점막 손상을 유발합니다.', isCritical: true },
    { id: 3, instruction: '필요 시 과산소화를 실시한다.', explanation: '흡인 중 발생할 수 있는 저산소증을 예방합니다.', isCritical: true },
    { id: 4, instruction: '멸균 장갑을 착용하고 카테터를 연결한다.', explanation: '흡인 카테터 삽입 부분은 무균 상태를 유지해야 합니다.', isCritical: true },
    { id: 5, instruction: '카테터를 부드럽게 삽입한다. 이때 흡인압을 주지 않는다.', explanation: '삽입 시 압력을 주면 점막이 손상됩니다.', isCritical: true },
    { id: 6, instruction: '저항이 느껴지면 1cm 후퇴 후, 간헐적으로 흡인하며 돌려 뺀다.', explanation: '한 곳에 집중적인 압력을 피하고 골고루 흡인합니다.', isCritical: true },
    { id: 7, instruction: '흡인 시간은 10-15초를 넘기지 않는다.', explanation: '장시간 흡인은 심각한 저산소증을 유발합니다.', isCritical: true },
    { id: 8, instruction: '카테터를 생리식염수로 세척한다.', explanation: '분비물의 성상을 관찰하고 관을 세척합니다.', isCritical: false },
    { id: 9, instruction: '청진을 통해 호흡음을 확인한다.', explanation: '흡인의 효과를 평가합니다.', isCritical: false },
    { id: 10, instruction: '사용 물품을 정리하고 손위생을 한다.', explanation: '병원균 전파를 막습니다.', isCritical: false },
  ]
};

export const IV_THERAPY_SKILL: NursingSkill = {
  id: 'iv-therapy',
  title: '정맥 수액 주입',
  description: '수분과 전해질 공급, 약물 투여를 위한 말초 정맥 주사를 수행합니다.',
  requiredItems: ['수액', '수액세트', '정맥 카테터', '토니켓', '알코올 솜', '반창고', '손소독제', '처방지'],
  steps: [
    { id: 1, instruction: '투약 처방과 환자를 정확히 확인한다.', explanation: '5 Right (환자, 약물, 용량, 경로, 시간)를 확인합니다.', isCritical: true },
    { id: 2, instruction: '수액세트를 연결하고 챔버를 채운 뒤 공기를 제거한다(Priming).', explanation: '공기 색전증을 예방합니다.', isCritical: true },
    { id: 3, instruction: '주사 부위보다 10-15cm 위쪽을 지혈대(토니켓)로 묶는다.', explanation: '정맥을 울혈시켜 혈관을 찾기 쉽게 합니다.', isCritical: false },
    { id: 4, instruction: '주사 부위를 소독솜으로 안에서 밖으로 닦는다.', explanation: '피부 상주균을 제거합니다.', isCritical: true },
    { id: 5, instruction: '카테터 사면이 위로 오도록 하여 15-30도 각도로 진입한다.', explanation: '정확한 혈관 천자를 위함입니다.', isCritical: true },
    { id: 6, instruction: '혈액 역류가 보이면 카테터(스타일렛)를 약간 낮추어 진입한다.', explanation: '혈관 내로 카테터가 확실히 들어가도록 합니다.', isCritical: true },
    { id: 7, instruction: '탐침을 제거하면서 카테터를 밀어 넣고 지혈대를 푼다.', explanation: '혈류를 개통시킵니다.', isCritical: true },
    { id: 8, instruction: '수액세트를 연결하고 주입 속도를 조절한다.', explanation: '처방된 속도대로 주입되는지 확인합니다.', isCritical: true },
    { id: 9, instruction: '반창고로 단단히 고정하고 날짜와 게이지를 기록한다.', explanation: '카테터 빠짐 예방 및 교체 시기 확인용입니다.', isCritical: false },
    { id: 10, instruction: '환자에게 주의사항을 설명하고 폐기물을 처리한다.', explanation: '주사 부위 통증이나 붓기 시 알리도록 교육합니다.', isCritical: false },
  ]
};

export const SKILLS_LIST: NursingSkill[] = [
  VITAL_SIGNS_SKILL,
  TUBE_FEEDING_SKILL,
  SUCTION_SKILL,
  IV_THERAPY_SKILL
];

export const GAME_ITEMS_POOL: GameItem[] = [
  { id: '1', name: '청진기', isCorrect: true, icon: '🩺' },
  { id: '2', name: '혈압계', isCorrect: true, icon: '📟' },
  { id: '3', name: '체온계', isCorrect: true, icon: '🌡️' },
  { id: '4', name: '초침 시계', isCorrect: true, icon: '⌚' },
  { id: '5', name: '손소독제', isCorrect: true, icon: '🧴' },
  { id: '6', name: '알코올 솜', isCorrect: true, icon: '⚪' },
  { id: '7', name: '간호기록지', isCorrect: true, icon: '📝' },
  { id: '8', name: '50cc 주사기', isCorrect: false, icon: '💉' },
  { id: '9', name: '반창고', isCorrect: false, icon: '🩹' },
  { id: '10', name: '수액세트', isCorrect: false, icon: '〰️' },
  { id: '11', name: '멸균 장갑', isCorrect: false, icon: '🧤' },
  { id: '12', name: '처방지', isCorrect: false, icon: '📋' },
  { id: '13', name: '위관영양액', isCorrect: false, icon: '🥛' },
  { id: '14', name: '물', isCorrect: false, icon: '💧' },
  { id: '15', name: '일회용 장갑', isCorrect: false, icon: '🤚' },
  { id: '16', name: '흡인기', isCorrect: false, icon: '🔌' },
  { id: '17', name: '멸균 흡인 카테터', isCorrect: false, icon: '🥢' },
  { id: '18', name: '생리식염수', isCorrect: false, icon: '🧂' },
  { id: '19', name: '산소', isCorrect: false, icon: '💨' },
  { id: '20', name: '수액', isCorrect: false, icon: '🧊' },
  { id: '21', name: '정맥 카테터', isCorrect: false, icon: '💉' },
  { id: '22', name: '토니켓', isCorrect: false, icon: '🎗️' },
  { id: '23', name: '위관 튜브', isCorrect: false, icon: '➰' },
];

export const MOCK_HISTORY = [
  { name: '1회', score: 65, amt: 2400 },
  { name: '2회', score: 72, amt: 2210 },
  { name: '3회', score: 78, amt: 2290 },
  { name: '4회', score: 85, amt: 2000 },
  { name: '5회', score: 82, amt: 2181 },
  { name: '6회', score: 95, amt: 2500 },
];