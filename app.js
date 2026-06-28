const passwordPanel = document.getElementById("password-panel");
const passwordInput = document.getElementById("password-input");
const passwordSubmit = document.getElementById("password-submit");
const passwordCancel = document.getElementById("password-cancel");

const textPanel = document.getElementById("text-panel");
const textContent = document.getElementById("text-content");
const textClose = document.getElementById("text-close");

let activeFile = null;

const player = document.getElementById("player");
const playerContainer = document.getElementById("player-container");
const closeBtn = document.getElementById("close-player");

const loadingPanel = document.getElementById("loading-panel");
const loadingText = document.getElementById("loading-text");

//SWEEP ANIMATION
function triggerSweep() {
  document.body.classList.remove("sweep");

  // force reflow so animation can restart
  void document.body.offsetWidth;

  document.body.classList.add("sweep");
}

function triggerSweep() {
  document.body.classList.remove("sweep");

  void document.body.offsetWidth;

  document.body.classList.add("sweep");

  // remove class after animation completes so it can retrigger cleanly
  setTimeout(() => {
    document.body.classList.remove("sweep");
  }, 4000);
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