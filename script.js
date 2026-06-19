// Хуудас солих үндсэн функц
function navigateToPage(fromPageId, toPageId) {
  document.getElementById(fromPageId).classList.remove("active");
  document.getElementById(toPageId).classList.add("active");

  if (toPageId === "page4") {
    initConfetti();
  }
}

const noBtn = document.getElementById("noBtn");
const container = document.querySelector(".container");

const funnyMessages = [
  "Чи яаж чадаж байна аа? 😱",
  "Mаяглаад байгаарай 😤",
  "Үгүй ээ, заавал 'Тийм' дээр даруулнаа өөр сонголт байхгүй! 😂",
  "Миний урилгаас зугтаж чадна гэж бодоо юу? 😜",
];
let messageIndex = 0;

function moveNoButton() {
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const btnWidth = noBtn.offsetWidth;
  const btnHeight = noBtn.offsetHeight;

  const maxX = containerWidth - btnWidth - 25;
  const maxY = containerHeight - btnHeight - 25;

  const randomX = Math.max(25, Math.random() * maxX);
  const randomY = Math.max(25, Math.random() * maxY);

  noBtn.style.position = "absolute";
  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("mouseover", moveNoButton);

noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoButton();
});

noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  alert(funnyMessages[messageIndex]);
  messageIndex = (messageIndex + 1) % funnyMessages.length;
  moveNoButton();
});
const yesBtn = document.getElementById("yesBtn");
const nextToStep3 = document.getElementById("nextToStep3");

yesBtn.addEventListener("click", () => {
  navigateToPage("page1", "page2");

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("datePicker").setAttribute("min", today);
});

nextToStep3.addEventListener("click", () => {
  const date = document.getElementById("datePicker").value;
  const time = document.getElementById("timePicker").value;

  if (!date || !time) {
    alert("Өдөр болон цагаа сонгоорой зусаг минь 📅💖");
    return;
  }
  navigateToPage("page2", "dateForm");
});

const form = document.getElementById("dateForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const date = document.getElementById("datePicker").value;
  const time = document.getElementById("timePicker").value;

  document.getElementById("hiddenDate").value = date;
  document.getElementById("hiddenTime").value = time;

  const checkedActivities = [];
  const checkboxes = document.querySelectorAll(
    'input[name="Хөтөлбөр"]:checked',
  );

  checkboxes.forEach((cb) => {
    checkedActivities.push(cb.value);
  });

  if (checkedActivities.length === 0) {
    alert("Ядаж нэг хөтөлбөр сонгоорой хөөрхөн өө 🥰");
    return;
  }

  const summaryTextDiv = document.getElementById("summaryText");
  summaryTextDiv.innerHTML = `
        <strong>📅 Огноо:</strong> ${date}<br>
        <strong>⏰ Цаг:</strong> ${time}<br>
        <strong>✨ Хийх зүйлс:</strong> ${checkedActivities.join(", ")}
    `;

  fetch(form.action, {
    method: form.method,
    body: new FormData(form),
    headers: { Accept: "application/json" },
  })
    .then((response) => {
      navigateToPage("dateForm", "page4");
    })
    .catch((error) => {
      э;
      navigateToPage("dateForm", "page4");
    });
});

function initConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  const page4 = document.getElementById("page4");

  function resizeCanvas() {
    canvas.width = page4.clientWidth;
    canvas.height = page4.clientHeight;
  }
  resizeCanvas();

  const colors = [
    "#ff758c",
    "#ff7eb3",
    "#ffbe0b",
    "#fb5607",
    "#ff006e",
    "#8338ec",
    "#3a86ff",
    "#06d6a0",
    "#2a9d8f",
  ];
  let particles = [];

  class ConfettiParticle {
    constructor(x, y, isExplosion = false) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 7 + 4;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 6 - 3;

      if (isExplosion) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 3;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;
      } else {
        // ДЭЭРЭЭС СҮҮДЭРЛЭЖ УНАХ ХУРД
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 1.5 + 1.5;
      }
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      this.speedY += 0.04;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 1.6);
      ctx.restore();
    }
  }

  for (let i = 0; i < 40; i++) {
    particles.push(
      new ConfettiParticle(
        Math.random() * canvas.width,
        Math.random() * (canvas.height / 2) - 20,
        false,
      ),
    );
  }

  const fallInterval = setInterval(() => {
    if (!document.getElementById("page4").classList.contains("active")) {
      clearInterval(fallInterval);
      return;
    }
    if (particles.length < 130) {
      particles.push(
        new ConfettiParticle(Math.random() * canvas.width, -10, false),
      );
    }
  }, 120);

  page4.addEventListener("click", (e) => {
    const rect = page4.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    for (let i = 0; i < 35; i++) {
      particles.push(new ConfettiParticle(clickX, clickY, true));
    }
  });

  function animate() {
    if (!page4.classList.contains("active")) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
      particle.update();
      particle.draw();

      if (
        particle.y > canvas.height + 10 ||
        particle.x < -20 ||
        particle.x > canvas.width + 20
      ) {
        particles.splice(index, 1);
      }
    });

    requestAnimationFrame(animate);
  }
  animate();
}
