const bootScreen = document.getElementById("boot-screen");
const app = document.getElementById("app");

const bootSound = new Audio("assets/audio/boot.mp3");

const passwordPanel = document.getElementById("password-panel");
const passwordInput = document.getElementById("password-input");
const passwordSubmit = document.getElementById("password-submit");
const passwordCancel = document.getElementById("password-cancel");

const textPanel = document.getElementById("text-panel");
const textContent = document.getElementById("text-content");
const textClose = document.getElementById("text-close");

const crewRecordsButton = document.getElementById("crew-records-button");
const crewRecordsPanel = document.getElementById("crew-records-panel");
const crewRecordsOutput = document.getElementById("crew-records-output");
const crewRecordsInput = document.getElementById("crew-records-input");
const crewRecordsSubmit = document.getElementById("crew-records-submit");
const crewRecordsClose = document.getElementById("crew-records-close");
const crewRecords = {
  john: "assets/crew/john.txt",
  bry1: "assets/crew/bry1.txt",
  blossom: "assets/crew/blossom.txt",
  storm: "assets/crew/storm.txt",
  captain: "assets/crew/captain.txt",
  potts: "assets/crew/potts.txt",
  archimedes: "assets/crew/archimedes.txt",
  archie: "assets/crew/archimedes.txt",
  cronus: "assets/crew/cronus.txt",
  chronos: "assets/crew/cronus.txt",
  mstri: "assets/crew/mstri.txt",
};

let typingActive = false; //Animation limiter for crew records typing
let cancelTyping = false;

const player = document.getElementById("player");
const playerContainer = document.getElementById("player-container");
const closeBtn = document.getElementById("close-player");

let activeFile = null;

const loadingPanel = document.getElementById("loading-panel");
const loadingText = document.getElementById("loading-text");



//BOOT
if (!bootScreen || !app) {
  console.error("Boot elements missing");
}

const bootLines = [
  "INITIALISING SYSTEM...",
  "LOADING ARCHIVE NODE...",
  "VERIFYING ACCESS PROTOCOLS...",
  "MOUNTING USER INTERFACE..."
];

const MAX_LINES = 4;
let buffer = [];

function renderBuffer() {
  bootScreen.innerHTML = "";

  buffer.forEach(text => {
    const line = document.createElement("div");
    line.textContent = text;
    bootScreen.appendChild(line);
  });
}

function addBootLine(text) {
  buffer.unshift(text); // new line goes to TOP

  if (buffer.length > MAX_LINES) {
    buffer.pop(); // remove oldest (bottom)
  }

  renderBuffer();
}

function typeIntoBuffer(text, speed = 35) {
  return new Promise((resolve) => {
    let i = 0;
    let current = "";

    function step() {
      if (i < text.length) {
        current += text.charAt(i);
        i++;

        // temporarily show in top slot
        buffer[0] = current;
        renderBuffer();

        setTimeout(step, speed);
      } else {
        resolve();
      }
    }

    step();
  });
}

async function runBootSequence() {
  bootSound.currentTime = 0;
  bootSound.volume = 1;
  bootSound.play();

  setTimeout(() => {
    fadeOutAudio(bootSound, 3000); // fade over 2 seconds
  }, 5000);

  for (let i = 0; i < bootLines.length; i++) {

    // reserve space in buffer for new line
    buffer.unshift("");

    if (buffer.length > MAX_LINES) {
      buffer.pop();
    }

    await typeIntoBuffer(bootLines[i], 35);

    await new Promise(r => setTimeout(r, 150));
  }

  showLogo();
}

function fadeOutAudio(audio, duration = 2000) {
  const steps = 20;
  const stepTime = duration / steps;
  let currentStep = 0;

  const fade = setInterval(() => {
    currentStep++;

    audio.volume = Math.max(0, 1 - currentStep / steps);

    if (currentStep >= steps) {
      clearInterval(fade);
      audio.pause();
      audio.currentTime = 0;
    }
  }, stepTime);
}

//LOGO
function showLogo() {
  bootScreen.innerHTML = "";

  const logo = document.createElement("img");
  logo.src = "assets/logo2.png";
  logo.alt = "UMC Logo";
  
  logo.classList.add("boot-logo")

  bootScreen.appendChild(logo);

  // fade in effect
  setTimeout(() => {
    logo.style.opacity = "1";
  }, 50);

  setTimeout(() => {
    bootScreen.remove();
    app.classList.remove("hidden");
  }, 1500);


  function finishBoot() {
    setTimeout(() => {
      bootScreen.remove();
      app.classList.remove("hidden");
    }, 500);
  }
}

//SWEEP ANIMATION
const DURATION = 8000;

let sweepActive = false;

function triggerSweep() {
  if (sweepActive) return; // prevents overlap

  sweepActive = true;

  document.body.classList.remove("sweep");
  void document.body.offsetWidth;
  document.body.classList.add("sweep");

  setTimeout(() => {
    document.body.classList.remove("sweep");
    sweepActive = false;
  }, DURATION);
}

function scheduleSweep() {
  const min = 3000;
  const max = 12000;

  const delay = Math.random() * (max - min) + min;

  setTimeout(() => {
    triggerSweep();
    scheduleSweep();
  }, delay);
}

scheduleSweep();

//CREW RECORDS
crewRecordsButton.addEventListener("click", () => {

  crewRecordsPanel.classList.remove("hidden");

  crewRecordsOutput.textContent = ">INPUT CREW MEMBER NAME";

  crewRecordsInput.value = "";
  crewRecordsInput.focus();

});

crewRecordsClose.addEventListener("click", () => {

  crewRecordsPanel.classList.add("hidden");

});

//crew records enter key logic
crewRecordsInput.addEventListener("keydown", (event) => {

  if (event.key === "Enter") {
    crewRecordsSubmit.click();
  }

});

function normaliseCrew(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
}

function resolveCrewName(input) {
  const cleaned = normaliseCrew(input);

  if (cleaned.includes("john")) return "john";
  if (cleaned.includes("storm")) return "storm";
  if (cleaned.includes("blossom")) return "blossom";

  // MS://TRI variants → canonical key
  if (
    cleaned.includes("mstri") ||
    cleaned.includes("terry") ||
    cleaned.includes("mstri")
  ) return "mstri";

  if (cleaned.includes("bry1") || cleaned.includes("bry")) return "bry1";

  if (cleaned.includes("cronus") || cleaned.includes("chronos")) return "cronus";
  if (cleaned.includes("potts")) return "potts";
  if (cleaned.includes("captain")) return "captain";

  return cleaned;
}

crewRecordsSubmit.addEventListener("click", handleCrewSubmit);

function handleCrewSubmit() {

  const rawInput = crewRecordsInput.value;

  const resolved = resolveCrewName(rawInput);

  console.log("Crew query:", rawInput, "→", resolved);

  crewRecordsOutput.textContent = "SEARCHING ARCHIVE...";

  setTimeout(() => {
    loadCrewRecord(resolved);
  }, 800);
}

crewRecordsInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleCrewSubmit();
  }
});

function loadCrewRecord(name) {
  const filePath = crewRecords[name];

  if (!filePath) {
    crewRecordsOutput.textContent = "CREW MEMBER NOT FOUND. CHECK SPELLING :)";
    return;
  }

  fetch(filePath)
    .then(res => res.text())
    .then(text => {
      typeIntoElement(crewRecordsOutput, text, 15);
    });
}


function typeIntoElement(element, text, speed = 25) {
  if(typingActive) return

  cancelTyping = false;
  typingActive = true;

  element.textContent = "";

  let i = 0;

  function step() {

     if (cancelTyping) {
     typingActive = false;
     return;
     }


     if (i < text.length) {
       element.textContent += text.charAt(i);

      // Keep the newest text visible
      element.scrollTop = element.scrollHeight;

      i++;
      setTimeout(step, speed);
    } else {
       typingActive = false;
    }
  }

  step();
}

crewRecordsClose.addEventListener("click", () => {

  cancelTyping = true;

  crewRecordsPanel.classList.add("hidden");

  crewRecordsInput.value = "";
  crewRecordsOutput.textContent = "> INPUT CREW MEMBER NAME";

});

// FOLDERS
document.querySelectorAll(".folder").forEach(folder => {
  folder.addEventListener("click", () => {
    const targetId = folder.getAttribute("data-folder");
    const target = document.getElementById(targetId);

    target.classList.toggle("hidden");
  });
});

// FILES
document.querySelectorAll(".file").forEach(file => {
  file.addEventListener("click", () => {

    // 🔐 LOCKED FILES → show loading panel, then password ui
    if (file.classList.contains("locked")) {
      activeFile = file;

      showLoading(() => {
        passwordPanel.classList.remove("hidden");
        passwordInput.value = "";
        passwordInput.focus();
      });

      return;
    }

    //LOADING ANIMATION
    function showLoading(callback) {
      const messages = [
        "ACCESSING NODE...",
        "INITIALISING DECRYPTION ENGINE...",
        "REBUILDING SECTOR MAP...",
        "<span class='warning'>WARNING: DATA CORRUPTION DETECTED</span>",
        "RECOVERING FRAGMENTED PACKETS...",
        "FILE FOUND"
      ];

      let i = 0;

      loadingPanel.classList.remove("hidden");

      function nextLine() {
        if (i < messages.length) {
          loadingText.innerHTML = messages[i];
          i++;
          const min = 100;
          const max = 650;

          const delay = Math.floor(Math.random() * (max - min + 1)) + min;

          setTimeout(nextLine, delay);
        } else {
          setTimeout(() => {
            loadingPanel.classList.add("hidden");
            callback();
          }, 300);
        }
      }

      nextLine();
    }

    showLoading(() => {
      openFile(file);
    });
  });
});

//IF FILE IS OPENED
function openFile(file) {

  const type = file.getAttribute("data-type") || "audio";

  switch (type) {

    case "text": {

      const filePath = file.getAttribute("data-file");

      fetch(filePath)
        .then(res => res.text())
        .then(text => {
          textContent.textContent = text;
          textPanel.classList.remove("hidden");
        });

      break;
    }

    case "audio": {

      const audio = file.getAttribute("data-audio");

      playerContainer.classList.remove("hidden");
      player.src = audio;
      player.play();

      player.scrollIntoView({ behavior: "smooth" });

      break;
    }

    default:
      alert("Unknown file type.");
  }
}

//PASSWORD
passwordSubmit.addEventListener("click", () => {

  if (!activeFile) return;

  const correct = activeFile.getAttribute("data-password");

  if (passwordInput.value === correct) {
    activeFile.classList.remove("locked");
    passwordPanel.classList.add("hidden");
    openFile(activeFile);
  } else {
    alert("ACCESS DENIED");
  }
});

passwordCancel.addEventListener("click", () => {
  passwordPanel.classList.add("hidden");
  activeFile = null;
});

// CLOSE BUTTON FOR AUDIO
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    player.pause();
    player.currentTime = 0;
    playerContainer.classList.add("hidden");
  });
}

//CLOSE BUTTON FOR TEXT
textClose.addEventListener("click", () => {
  textPanel.classList.add("hidden");
});

runBootSequence();