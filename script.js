// 1. ตัวแปรสถานะระบบ
let currentLang = "th";
let currentSceneId = "scene_intro";

// ตัวแปรเก็บแต้ม
let scores = {
  typeA: 0, // ไดฟุกุสตรอว์เบอร์รี
  typeB: 0, // ฮานามิดังโงะ
  typeC: 0  // นามะกาชิ
};

let currentStep = 0;
const totalSteps = 4; 

// ข้อความ UI หน้าแรกและปุ่ม 2 ภาษา
const uiTexts = {
  startTitle: {
    th: "เลือกคำตอบที่ตรงกับใจเพื่อค้นหาตัวตนของคุณ",
    ja: "心に寄り添う答えを選んで、本当の自分を見つけましょう"
  },
  startBtn: {
    th: "เริ่มเลย ➜",
    ja: "はじめる ➜"
  },
  restartBtn: {
    th: "เล่นใหม่อีกครั้ง ↺",
    ja: "もう一度あそぶ ↺"
  }
};

// 2. ฐานข้อมูลเนื้อเรื่อง
const storyScenes = {
  scene_intro: {
    text: {
      th: "ออกเดินทางไปกับเรื่องราวและค้นหาขนมที่ใช่ในแบบตัวคุณ",
      ja: "物語を旅して、あなたにぴったりの和菓子を見つけよう"
    },
    choices: [
      { 
        text: { th: "ถัดไป ➜", ja: "次へ ➜" }, 
        nextScene: "scene_1",
        type: null,
        points: 0 
      }
    ]
  },

  scene_1: {
    image: "https://i.postimg.cc/vHXKYRrh/scene-1.png",
    text: {
      th: "วันนี้คุณกลับมาถึงห้องด้วยความรู้สึกที่เหนื่อยล้า\nคุณละทิ้งทุกอย่างแล้วทิ้งตัวลงนอนบนโซฟา คิดแค่ว่าได้งีบหลับสักพักก่อนก็คงดี...",
      ja: "今日は疲れ果てて部屋に戻ってきたあなた。\n何もかも放り出してソファに倒れ込み、\n「少しだけでも眠れたらいいな…」とぼんやり思います。"
    },
    choices: [
      { 
        text: { th: "ถัดไป ➜", ja: "次へ ➜" }, 
        nextScene: "scene_2",
        type: null,
        points: 0 
      }
    ]
  },

  scene_2: {
    image: "https://i.postimg.cc/Jzzz0W9D/Scene-2.png",
    text: {
      th: "...",
      ja: "..."
    },
    choices: [
      { 
        text: { th: "ถัดไป ➜", ja: "次へ ➜" }, 
        nextScene: "scene_3",
        type: null,
        points: 0 
      }
    ]
  },

  scene_3: {
    image: "https://i.postimg.cc/TYzqrCJp/Scene-3.png",
    text: {
      th: "เมื่อลืมตาขึ้นมา คุณพบว่าไม่ได้อยู่ในห้องของตัวเองอีกต่อไป คุณกำลังยืนอยู่กลางทุ่งหญ้าและป่าไม้ ในสถานที่ที่ไม่เคยเห็นมาก่อน",
      ja: "目を覚ますと、そこはもう自分の部屋ではありませんでした。目の前に広がる草原と森——あなたは、見覚えのない見知らぬ場所に立っていました。"
    },
    choices: [
      { 
        text: { th: "ตกใจเป็นกังวลสุด ๆ อยากรีบหาทางกลับบ้าน", ja: "不安でパニック！早く家に帰りたい" }, 
        nextScene: "scene_result",
        type: "typeA",
        points: 1 
      },
      { 
        text: { th: "ตื่นเต้นเหมือนได้อิเซไกมาต่างโลก", ja: "まるで異世界転生！？ワクワクする" }, 
        nextScene: "scene_result",
        type: "typeB",
        points: 1
      },
      { 
        text: { th: "สับสน มึนงง แต่ก็อยากลองสำรวจที่แห่งนี้", ja: "混乱しているけど、少し探検してみたい" }, 
        nextScene: "scene_result",
        type: "typeC",
        points: 1 
      }
    ]
  }
};

// 3. ฟังก์ชันเริ่มเกม
function startGame() {
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("result-screen").classList.add("hidden");
  
  const storyScreen = document.getElementById("story-screen");
  storyScreen.classList.remove("hidden");
  triggerFade(storyScreen);

  scores = { typeA: 0, typeB: 0, typeC: 0 };
  currentStep = 1;
  currentSceneId = "scene_intro";
  
  updateProgressBar();
  renderScene(currentSceneId);
}

// อัปเดตแถบ Progress Bar
function updateProgressBar() {
  const progressBar = document.getElementById("progress-bar");
  if (progressBar) {
    const percent = Math.min((currentStep / totalSteps) * 100, 100);
    progressBar.style.width = `${percent}%`;
  }
}

// 4. เรนเดอร์ฉากและคำนวณแต้ม Type
function renderScene(sceneId) {
  if (sceneId === "scene_result") {
    showResult();
    return;
  }

  const scene = storyScenes[sceneId];
  if (!scene) return;

  const storyScreen = document.getElementById("story-screen");
  triggerFade(storyScreen);

  const imgEl = document.getElementById("scene-img");
  if (scene.image) {
    imgEl.src = "";
    imgEl.src = scene.image;
    imgEl.style.display = "block";
  } else {
    imgEl.src = "";
    imgEl.style.display = "none";
  }

  document.getElementById("story-text").innerText = scene.text[currentLang];

  const choicesContainer = document.getElementById("choice-buttons");
  choicesContainer.innerHTML = "";

  scene.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "main-btn";
    btn.innerText = choice.text[currentLang];

    btn.onclick = () => {
      if (choice.type && choice.points) {
        if (!scores[choice.type]) {
          scores[choice.type] = 0;
        }
        scores[choice.type] += choice.points;
      }
      
      currentStep++;
      updateProgressBar();

      currentSceneId = choice.nextScene;
      renderScene(currentSceneId);
    };

    choicesContainer.appendChild(btn);
  });
}

// 5. แสดงผลลัพธ์
function showResult() {
  document.getElementById("story-screen").classList.add("hidden");
  
  const resultScreen = document.getElementById("result-screen");
  resultScreen.classList.remove("hidden");
  triggerFade(resultScreen);

  const resultImg = document.getElementById("result-img");
  const resultTitle = document.getElementById("result-title");
  const resultDesc = document.getElementById("result-desc");

  let highestType = "typeA";
  let maxScore = -1;

  for (const type in scores) {
    if (scores[type] > maxScore) {
      maxScore = scores[type];
      highestType = type;
    }
  }

  if (highestType === "typeA") {
    resultImg.src = "https://i.postimg.cc/PxD8rkBk/IMG-5757.png";
    resultTitle.innerText = currentLang === "th" 
      ? "ไดฟุกุสตรอว์เบอร์รี" 
      : "いちご大福（いちごだいふく）";
    resultDesc.innerText = currentLang === "th" 
      ? "คุณเป็นคนอ่อนหวาน นุ่มนวล แต่แอบมีความสดใสและซ่อนเสน่ห์เฉพาะตัวไว้ เหมือนความหวานของถั่วแดงที่ผสานกับความเปรี้ยวอมหวานของสตรอว์เบอร์รีสด" 
      : "優しく柔らかな雰囲気の中に、愛らしい魅力と元気を秘めたあなた。甘い餡と甘酸っぱいいちごのように、周囲を自然と笑顔にします。";

  } else if (highestType === "typeB") {
    resultImg.src = "https://i.postimg.cc/J0q0G7xx/IMG-5759.png";
    resultTitle.innerText = currentLang === "th" 
      ? "ฮานามิดังโงะ (Hanami Dango)" 
      : "花見団子（はなみだんご）";
    resultDesc.innerText = currentLang === "th" 
      ? "คุณเป็นคนร่าเริง มีชีวิตชีวา เข้ากับคนง่าย และชอบส่งต่อพลังบวก เหมือนสีสันทั้งสามของฤดูใบไม้ผลิที่ทำให้ทุกคนรู้สึกสดชื่นและมีรอยยิ้ม" 
      : "明るく元気いっぱいで、親しみやすいあなた。春の訪れを告げる三色の団子のように、みんなの心をパッと華やかに明るくするムードメーカーです。";

  } else if (highestType === "typeC") {
    resultImg.src = "https://i.postimg.cc/x17Ck4GD/IMG-5758.png";
    resultTitle.innerText = currentLang === "th" 
      ? "นามะกาชิ (Namagashi)" 
      : "生菓子（なまがし）";
    resultDesc.innerText = currentLang === "th" 
      ? "คุณเป็นคนประณีต ละเอียดอ่อน มีความคิดสร้างสรรค์และลึกซึ้ง เหมือนขนมชั้นสูงที่สะท้อนความงดงามของฤดูกาลและธรรมชาติผ่านรูปทรงศิลปะ" 
      : "繊細で美意識が高く、思慮深いあなた。四季の移ろいや自然の美しさを繊細に表現する生菓子のように、独特の優雅さと深みを持っています。";
  }
}

// 6. สลับภาษา
function changeLanguage(lang) {
  currentLang = lang;

  document.body.classList.toggle("lang-ja", lang === "ja");

  document.getElementById("lang-btn-th")?.classList.toggle("active", lang === "th");
  document.getElementById("lang-btn-ja")?.classList.toggle("active", lang === "ja");

  document.getElementById("start-title").innerText = uiTexts.startTitle[lang];
  document.getElementById("start-btn").innerText = uiTexts.startBtn[lang];
  document.getElementById("restart-btn").innerText = uiTexts.restartBtn[lang];

  if (!document.getElementById("story-screen").classList.contains("hidden")) {
    renderScene(currentSceneId);
  } else if (!document.getElementById("result-screen").classList.contains("hidden")) {
    showResult();
  }
}

function switchLanguage(lang) {
  changeLanguage(lang);
}

// 7. เริ่มใหม่
function restartGame() {
  document.getElementById("result-screen").classList.add("hidden");
  
  const startScreen = document.getElementById("start-screen");
  startScreen.classList.remove("hidden");
  triggerFade(startScreen);

  scores = { typeA: 0, typeB: 0, typeC: 0 };
  currentStep = 0;
  currentSceneId = "scene_intro";
  
  const progressBar = document.getElementById("progress-bar");
  if (progressBar) progressBar.style.width = "0%";
}

function triggerFade(element) {
  element.classList.remove("fade-in");
  void element.offsetWidth;
  element.classList.add("fade-in");
}

// 8. BGM (เล่นทันทีเมื่อสัมผัสหน้าจอครั้งแรก + สลับปุ่มเปิด/ปิด)
const bgm = document.getElementById("bgm");
const musicBtn = document.getElementById("music-toggle-btn");

function startMusic() {
  if (bgm && bgm.paused) {
    bgm.play().then(() => {
      if (musicBtn) {
        musicBtn.classList.add("playing");
        musicBtn.innerText = "♫";
      }
    }).catch(err => console.log("Audio play blocked:", err));
  }
}

// แตะหรือคลิกที่หน้าจอครั้งแรกเพื่อเริ่มเพลง
document.addEventListener("click", startMusic, { once: true });
document.addEventListener("touchstart", startMusic, { once: true });

// ปุ่มเปิด/ปิดเสียงมุมขวาบน
if (musicBtn && bgm) {
  musicBtn.onclick = (e) => {
    e.stopPropagation(); // ไม่ให้กระทบตัวดักจับแตะจอ
    if (bgm.paused) {
      bgm.play().then(() => {
        musicBtn.classList.add("playing");
        musicBtn.innerText = "♫";
      }).catch(err => console.log("Audio play blocked:", err));
    } else {
      bgm.pause();
      musicBtn.classList.remove("playing");
      musicBtn.innerText = "✕";
    }
  };
}

// ผูกฟังก์ชันเข้ากับ Global Window
window.startGame = startGame;
window.restartGame = restartGame;
window.changeLanguage = changeLanguage;
