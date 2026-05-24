// ----- Promo / timer -----
const timerEl = document.getElementById('timer');
const promoCard = document.getElementById('promoCard');
const quizCard = document.getElementById('quizCard');
const promoStatus = document.getElementById('promoStatus');

let remaining = 30; 
updateTimer();
const t = setInterval(()=>{
  remaining--;
  updateTimer();
  if(remaining<=0){
    clearInterval(t);
    promoStatus.textContent = '觀影完成！正在派送破譯任務…';
    setTimeout(()=>{
      promoCard.style.display='none';
      startQuiz();
    }, 700);
  }
}, 1000);

function updateTimer(){
  const mm = '00';
  const ss = String(remaining).padStart(2,'0');
  timerEl.textContent = `${mm}:${ss}`;
}

// ----- 3題 核心題庫 -----
const QUESTIONS = [
  {
    type: '成分破譯',
    img: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800&auto=format&fit=crop', 
    text: '電子煙主打「天然水果香精、草本調味」，宣稱吸食安全。然而，這類食品級香精高溫加熱霧化後吸入深層肺部，會造成什麼實質危害？',
    options: [
      '香精在高溫下會裂解並產生甲醛、乙醛與重金屬微粒，直接破壞肺泡與呼吸道防線。',
      '食品級香精進入肺部後會自動轉化為百分之百無害的水蒸氣，幫助氣管保持濕潤。',
      '只要標示為天然水果提取，人體呼吸系統就能完美將其代謝為基礎維生素。'
    ],
    correct: 0,
    explain: '食品級標示僅限於經由腸胃道消化的安全性，一旦改由高溫加熱霧化直接吸入深層肺部，其化學結構改變會對細支氣管與肺泡造成不可逆的化學性損傷與慢性發炎。'
  },
  {
    type: '行銷識破',
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop', 
    text: '文宣不斷強調產品「輕薄便攜、沒有傳統紙菸臭味、外觀如時尚數位配件或聯名卡通」。這背後隱藏了什麼商業話術陷阱？',
    options: [
      '用高科技與潮流社交便利性作為包裝，刻意轉移並淡化高度成癮與致癌的真實健康風險焦點。',
      '證明該產品經過國際科技大廠聯合綠色認證，屬於完全無害的數位未來科技。',
      '暗示只要沒有散發傳統煙臭味，其產生的霧化微粒就不具備任何二手煙毒害。'
    ],
    correct: 0,
    explain: '這是一種典型的「風險轉移」與「視覺去污名化」行銷策略，利用精緻的外觀設計來繞過消費者對毒害的戒心，進而吸引年輕族群盲從接觸。'
  },
  {
    type: '法律漏洞',
    img: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop', 
    text: '某網路代購網頁聲稱：「本產品屬於『草本霧化器』，完全不含傳統菸草成分，因此不受在地菸害防制法管制，在網路上銷售和購買皆完全合法。」下列反駁何者正確？',
    options: [
      '這是違法誤導。現行法規是以產品的「實質用途與吸食型態」全面禁絕。新興類菸品不論改稱什麼名字，皆嚴禁在網路展示、推廣或販售。',
      '只要包裝上確實沒有寫出「電子煙」三個字，在法律層面上就能視為合法的灰色地帶。',
      '利用社群平台（如 IG、Threads、LINE 團購群）以私人暗號進行私訊交易，法律就無法追溯處罰。'
    ],
    correct: 0,
    explain: '台灣《菸害防制法》已將電子煙等產品全面歸類為「類菸品」，採取全面禁絕的最高管制標準，凡是製造、輸入、販賣、網路宣傳或展示，甚至在任何場所吸食皆屬違法。'
  }
];

// ----- Quiz Game Logic -----
const qImage = document.getElementById('qImage');
const qText = document.getElementById('qText');
const choicesEl = document.getElementById('choices');
const progressPill = document.getElementById('progressPill');
const resultBox = document.getElementById('resultBox');
const resultTitle = document.getElementById('resultTitle');
const scoreDisplay = document.getElementById('scoreDisplay');
const resultMsg = document.getElementById('resultMsg');
const reportList = document.getElementById('reportList');
const retryBtn = document.getElementById('retryBtn');
const nextBtn = document.getElementById('nextBtn');

const PASS_SCORE = 3; 
let currentIndex = 0;
let userAnswers = []; 
let locked = false;

function startQuiz(){
  quizCard.style.display = 'block';
  document.getElementById('qBox').style.display='block';
  resultBox.style.display='none';
  
  currentIndex = 0;
  userAnswers = [];
  locked = false;
  
  updateStatusLabels();
  loadQuestion(currentIndex);
}

function loadQuestion(index){
  locked = false;
  const q = QUESTIONS[index];
  
  qImage.src = q.img;
  qText.innerHTML = `【${q.type}】${index + 1}. ${q.text}`;
  choicesEl.innerHTML = '';
  
  q.options.forEach((opt, i)=>{
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.addEventListener('click', ()=> handleSelect(i));
    choicesEl.appendChild(btn);
  });
}

function handleSelect(selectedIndex){
  if (locked) return;
  locked = true; 

  userAnswers.push(selectedIndex);
  currentIndex++;
  updateStatusLabels();

  setTimeout(()=>{
    if (currentIndex < QUESTIONS.length) {
      loadQuestion(currentIndex);
    } else {
      evaluateAndShowResult();
    }
  }, 200);
}

function updateStatusLabels(){
  progressPill.textContent = `${Math.min(currentIndex + 1, QUESTIONS.length)} / ${QUESTIONS.length}`;
}

function evaluateAndShowResult(){
  document.getElementById('qBox').style.display='none';
  resultBox.style.display='block';
  
  let finalScore = 0;
  reportList.innerHTML = ''; 

  QUESTIONS.forEach((q, idx) => {
    const userChoiceIdx = userAnswers[idx];
    const isCorrect = userChoiceIdx === q.correct;
    
    if(isCorrect) finalScore++;

    const item = document.createElement('div');
    item.className = `report-item ${isCorrect ? 'item-ok' : 'item-bad'}`;
    
    const statusIcon = isCorrect ? '✅ 破譯成功' : '❌ 破譯失敗';
    const userAnsText = q.options[userChoiceIdx];
    const correctAnsText = q.options[q.correct];

    let answerBlockHtml = '';
    if(isCorrect) {
      answerBlockHtml = `<div class="ans-line correct-ans">你的回答：${userAnsText}</div>`;
    } else {
      answerBlockHtml = `
        <div class="ans-line user-wrong">你的回答：${userAnsText}</div>
        <div class="ans-line correct-ans">正確答案：${correctAnsText}</div>
      `;
    }

    item.innerHTML = `
      <div class="report-q">【${q.type}】第 ${idx + 1} 題 (${statusIcon})</div>
      <div class="report-q" style="font-size:13px; color:var(--muted); font-weight:400;">${q.text}</div>
      <div class="report-ans">
        ${answerBlockHtml}
      </div>
      <div class="report-exp"><strong>破譯關鍵：</strong>${q.explain}</div>
    `;
    reportList.appendChild(item);
  });

  scoreDisplay.textContent = `${finalScore} / ${QUESTIONS.length}`;
  
  if (finalScore === PASS_SCORE){
    resultTitle.textContent = '🎉 完美破譯！通關成功';
    resultMsg.textContent = `太強了！你成功連續答對 3 道關卡，精準識破成分包裝、行銷話術與法規盲點，幻霧濾鏡已全面解除！`;
    retryBtn.style.display = 'none';
    nextBtn.style.display = 'inline-block';
  } else {
    resultTitle.textContent = '❌ 破譯失敗（本關卡需全部答對）';
    resultMsg.textContent = `很遺憾，未能達成全對通關門檻。請詳閱下方破譯報告明細，修正思維後再次發動挑戰！`;
    retryBtn.style.display = 'inline-block';
    nextBtn.style.display = 'none';
  }
}

retryBtn.addEventListener('click', ()=>{
  startQuiz();
});

nextBtn.addEventListener('click', ()=>{
  alert('前往下一關（為連結LINE）');
});

document.addEventListener('keydown', (e)=>{
  if (!quizCard || quizCard.style.display === 'none' || locked || currentIndex >= QUESTIONS.length) return;
  const keys = ['1','2','3'];
  const idx = keys.indexOf(e.key);
  if (idx>=0){
    const btn = choicesEl.querySelectorAll('button')[idx];
    if (btn) btn.click();
  }
});