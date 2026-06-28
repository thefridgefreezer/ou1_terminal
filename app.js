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

    // 🔐 LOCKED FILES → show password UI
    if (file.classList.contains("locked")) {
      activeFile = file;
      passwordPanel.classList.remove("hidden");
      passwordInput.value = "";
      passwordInput.focus();
      return;
    }

    openFile(file);
  });
});

//IF FILE IS OPEN
function openFile(file) {

  const type = file.getAttribute("data-type") || "audio";

  // 📄 TEXT FILE
if (type === "text") {
  const filePath = file.getAttribute("data-file");

  fetch(filePath)
    .then(res => res.text())
    .then(text => {
      textContent.textContent = text;
      textPanel.classList.remove("hidden");
    });

  return;
}

  // 🎧 AUDIO FILE
  const audio = file.getAttribute("data-audio");

  playerContainer.classList.remove("hidden");
  player.src = audio;
  player.play();

  player.scrollIntoView({ behavior: "smooth" });
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