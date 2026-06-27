const player = document.getElementById("player");
const playerContainer = document.getElementById("player-container");
const closeBtn = document.getElementById("close-player");

document.querySelectorAll(".file").forEach(file => {
  file.addEventListener("click", () => {

    const audio = file.getAttribute("data-audio");

    // only treat as audio if it exists
    if (audio) {
      player.src = audio;
      playerContainer.classList.remove("hidden");
      player.play();

      playerContainer.scrollIntoView({ behavior: "smooth" });
    }

  });
});

// CLOSE BUTTON LOGIC
closeBtn.addEventListener("click", () => {
  player.pause();
  player.currentTime = 0;
  playerContainer.classList.add("hidden");
});