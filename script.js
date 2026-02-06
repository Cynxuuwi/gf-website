// =======================
// Scroll reveal
// =======================
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// =======================
// Secret note
// =======================
const trigger = document.querySelector(".secret-trigger");
const note = document.querySelector(".secret-note");

if (trigger && note) {
  trigger.addEventListener("click", () => {
    note.hidden = false;
    requestAnimationFrame(() => note.classList.add("visible"));
    trigger.setAttribute("aria-expanded", "true");
  });
}

// =======================
// Auth state (IMPORTANT)
// =======================
const PASSCODE = "081923";

const gate = document.getElementById("gate");
const loader = document.getElementById("loader");
const welcome = document.getElementById("welcome");
const site = document.getElementById("site");

const input = document.querySelector(".gate-input");
const button = document.querySelector(".gate-btn");
const error = document.querySelector(".gate-error");
const errorText = document.querySelector(".gate-error-text");
const card = document.querySelector(".gate-card");
const progress = document.querySelector(".loader-progress");

// If already unlocked this session → skip gate
if (sessionStorage.getItem("unlocked") === "true") {
  gate.style.display = "none";
  site.hidden = false;
  document.body.style.overflow = "auto";
}

// =======================
// Unlock flow
// =======================
function unlock() {
  if (input.value === PASSCODE) {
    sessionStorage.setItem("unlocked", "true");

    // Hide gate
    gate.style.opacity = "0";
    gate.style.pointerEvents = "none";

    // Show loader
    loader.hidden = false;

    if (progress) {
      progress.style.width = "0%";
      setTimeout(() => progress.style.width = "30%", 200);
      setTimeout(() => progress.style.width = "60%", 600);
      setTimeout(() => progress.style.width = "85%", 1000);
      setTimeout(() => progress.style.width = "100%", 1400);
    }

    // Loader → welcome
    setTimeout(() => {
      loader.hidden = true;
      welcome.hidden = false;
    }, 1600);

    // Welcome → site
    setTimeout(() => {
      welcome.hidden = true;
      site.hidden = false;
      document.body.style.overflow = "auto";
    }, 3200);

  } else {
    errorText.textContent = "are you really my baby?";
    error.classList.add("visible");

    card.classList.add("shake");
    input.value = "";

    setTimeout(() => card.classList.remove("shake"), 300);
  }
}

button.addEventListener("click", unlock);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") unlock();
});

// =======================
// Carousel heart pulse
// =======================
const whyCarousel = document.getElementById("whyCarousel");
const carouselHeart = document.querySelector(".carousel-heart");

if (whyCarousel && carouselHeart) {
  whyCarousel.addEventListener("slide.bs.carousel", () => {
    carouselHeart.classList.remove("pulse");
    void carouselHeart.offsetWidth; // restart animation
    carouselHeart.classList.add("pulse");
  });
}

const storyCarousel = document.getElementById('storyCarousel');
const storyHeart = document.querySelector('.story-heart');

if (storyCarousel && storyHeart) {
  storyCarousel.addEventListener('slide.bs.carousel', () => {
    storyHeart.classList.remove('pulse');
    void storyHeart.offsetWidth;
    storyHeart.classList.add('pulse');
  });
}
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollY / docHeight, 1);

    // subtle range only (0% → 12%)
    document.documentElement.style.setProperty(
      '--bg-shift',
      `${progress * 12}%`
    );
  });
}
window.addEventListener("scroll", () => {
  const scroll = Math.min(window.scrollY / 40, 20);
  document.documentElement.style.setProperty(
    "--bg-shift",
    `${scroll}%`
  );
});

// Memory unlock system
const memoryType = localStorage.getItem("memoryType");

if (memoryType) {
  document.querySelectorAll(".memory-card").forEach(card => {
    const type = card.dataset.memory;

    if (type === memoryType || memoryType === "mixed") {
      card.classList.remove("locked");
      card.classList.add("unlocked");
    }
  });
}

const memoryData = {
  calm: {
    title: "Quiet Safety",
    text: "With you, my nervous system finally rests. The world softens, and I remember I don’t have to be on guard.",
    image: "https://via.placeholder.com/600x400?text=our+quiet+moment"
  },
  fun: {
    title: "Pure Joy",
    text: "Laughing with you feels effortless. Like time pauses just to watch us be stupid and happy together.",
    image: "https://via.placeholder.com/600x400?text=us+laughing"
  },
  mixed: {
    title: "Choosing You",
    text: "Not because it’s easy. Not because it’s perfect. But because you are worth choosing — every version of you.",
    image: "https://via.placeholder.com/600x400?text=always+you"
  }
};

document.querySelectorAll(".memory-card.unlocked").forEach(card => {
  card.addEventListener("click", () => {
    const type = card.dataset.memory;
    const data = memoryData[type];

    if (!data) return;

    document.getElementById("memoryTitle").textContent = data.title;
    document.getElementById("memoryText").textContent = data.text;
    document.getElementById("memoryImage").src = data.image;

    const modal = new bootstrap.Modal(document.getElementById("memoryModal"));
    modal.show();
  });
});

const toast = document.getElementById("memoryToast");

if (memoryType && !sessionStorage.getItem("memoryToastShown")) {
  setTimeout(() => {
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }, 800);

  sessionStorage.setItem("memoryToastShown", "true");
}

// Memory / Moment modal wiring
const memoryModal = document.getElementById("memoryModal");

if (memoryModal) {
  memoryModal.addEventListener("show.bs.modal", event => {
    const trigger = event.relatedTarget;

    const image = trigger.dataset.image;
    const title = trigger.dataset.title;
    const text = trigger.dataset.text;

    const modalImage = document.getElementById("modalImage");
    const modalTitle = document.getElementById("modalTitle");
    const modalText = document.getElementById("modalText");

    modalImage.src = image;
    modalTitle.textContent = title;
    modalText.textContent = text;
  });
}

// =======================
// Song player (Our Theme Song)
// =======================
const song = document.getElementById("songAudio");
const songBtn = document.getElementById("songBtn");
const progressSlider = document.getElementById("progress");
const volumeSlider = document.getElementById("volume");

if (song && songBtn && progressSlider && volumeSlider) {
  // Initial volume
  song.volume = volumeSlider.value;

  // Play / Pause
  songBtn.addEventListener("click", () => {
    if (song.paused) {
      song.play();
      songBtn.textContent = "❚❚ pause";
      songBtn.classList.add("playing");
    } else {
      song.pause();
      songBtn.textContent = "▶ play";
      songBtn.classList.remove("playing");
    }
  });

  // Update progress as song plays
  song.addEventListener("timeupdate", () => {
    if (!isNaN(song.duration)) {
      progressSlider.max = Math.floor(song.duration);
      progressSlider.value = Math.floor(song.currentTime);
    }
  });

  // Scrub song
  progressSlider.addEventListener("input", () => {
    song.currentTime = progressSlider.value;
  });

  // Volume control
  volumeSlider.addEventListener("input", () => {
    song.volume = volumeSlider.value;
  });

  // Reset button when song ends
  song.addEventListener("ended", () => {
    songBtn.textContent = "▶ play";
    songBtn.classList.remove("playing");
    progressSlider.value = 0;
  });
}

// =======================
// Final message reacts to quiz mood
// =======================
const closingSub = document.getElementById("closingSub");
const mood = localStorage.getItem("memoryType");

if (closingSub && mood) {
  if (mood === "calm") {
    closingSub.textContent = "You’re my safe place.";
  }

  if (mood === "fun") {
    closingSub.textContent = "Life’s better laughing with you.";
  }

  if (mood === "mixed") {
    closingSub.textContent = "Every version of us feels right.";
  }
}
// =======================
// Together since counter
// =======================
const startDate = new Date("2023-08-19T00:00:00"); 
// ⬆️ if you want exact time, change 00:00:00 to the real time

function updateTogetherCounter() {
  const now = new Date();
  let diff = Math.floor((now - startDate) / 1000);

  if (diff < 0) return;

  const days = Math.floor(diff / (3600 * 24));
  diff %= 3600 * 24;

  const hours = Math.floor(diff / 3600);
  diff %= 3600;

  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;

  const d = document.getElementById("days");
  const h = document.getElementById("hours");
  const m = document.getElementById("minutes");
  const s = document.getElementById("seconds");

  if (d) d.textContent = days;
  if (h) h.textContent = hours;
  if (m) m.textContent = minutes;
  if (s) s.textContent = seconds;
}

// update immediately + every second
updateTogetherCounter();
setInterval(updateTogetherCounter, 1000);
