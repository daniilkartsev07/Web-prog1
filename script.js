document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("graph");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const MIN_R = 2;
  const MAX_R = 5;
  const scale = 120;

  let pointsHistory = JSON.parse(localStorage.getItem("lab1_points")) || [];

  let selectedX = null;
  const xButtons = document.querySelectorAll(".x-btn");
  const xErr = document.getElementById("x-error");

  xButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      xButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedX = parseFloat(btn.dataset.value);
      xErr.style.display = "none";
    });
  });

  function drawArea(r) {
    ctx.clearRect(0, 0, width, height);
    const unit = r > 0 ? scale / r : 0;

    if (r > 0 && unit > 0) {
      ctx.fillStyle = "rgba(59, 130, 246, 0.4)";
      ctx.strokeStyle = "#243bbf";
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, (r / 2) * unit, Math.PI, Math.PI * 1.5, false);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + r * unit, centerY);
      ctx.lineTo(centerX, centerY - (r / 2) * unit);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(
        centerX - (r / 2) * unit,
        centerY,
        (r / 2) * unit,
        r * unit
      );
      ctx.fill();
      ctx.stroke();
    }

    ctx.strokeStyle = "#2d3748";
    ctx.lineWidth = 1.5;
    ctx.fillStyle = "#2d3748";
    ctx.font = "12px monospace";

    ctx.beginPath();
    ctx.moveTo(10, centerY);
    ctx.lineTo(width - 10, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width - 10, centerY);
    ctx.lineTo(width - 16, centerY - 4);
    ctx.lineTo(width - 16, centerY + 4);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX, height - 10);
    ctx.lineTo(centerX, 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, 10);
    ctx.lineTo(centerX - 4, 16);
    ctx.lineTo(centerX + 4, 16);
    ctx.closePath();
    ctx.fill();

    ctx.fillText("x", width - 14, centerY - 8);
    ctx.fillText("y", centerX + 8, 14);

    if (r > 0 && unit > 0) {
      const labels = [
        { x: centerX + r * unit, y: centerY + 14, text: "R" },
        { x: centerX + (r / 2) * unit, y: centerY + 14, text: "R/2" },
        { x: centerX - (r / 2) * unit, y: centerY + 14, text: "-R/2" },
        { x: centerX - r * unit, y: centerY + 14, text: "-R" },
        { x: centerX + 8, y: centerY - r * unit + 4, text: "R" },
        { x: centerX + 8, y: centerY - (r / 2) * unit + 4, text: "R/2" },
        { x: centerX + 8, y: centerY + (r / 2) * unit + 4, text: "-R/2" },
        { x: centerX + 8, y: centerY + r * unit + 4, text: "-R" }
      ];

      ctx.strokeStyle = "#4a5568";
      ctx.lineWidth = 1;

      [centerX - r * unit, centerX - (r / 2) * unit,
       centerX + (r / 2) * unit, centerX + r * unit].forEach(xPx => {
        ctx.beginPath();
        ctx.moveTo(xPx, centerY - 3);
        ctx.lineTo(xPx, centerY + 3);
        ctx.stroke();
      });

      [centerY - r * unit, centerY - (r / 2) * unit,
       centerY + (r / 2) * unit, centerY + r * unit].forEach(yPx => {
        ctx.beginPath();
        ctx.moveTo(centerX - 3, yPx);
        ctx.lineTo(centerX + 3, yPx);
        ctx.stroke();
      });

      labels.forEach(l => ctx.fillText(l.text, l.x, l.y));
    }

    if (r > 0 && unit > 0) {
      pointsHistory.forEach(pt => {
        const px = centerX + pt.x * unit;
        const py = centerY - pt.y * unit;

        ctx.beginPath();
        ctx.arc(px, py, 4, 0, 2 * Math.PI);
        ctx.fillStyle = pt.hit ? "#2f855a" : "#e53e3e";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }
  }

  const rInput = document.getElementById("r-input");

    rInput.addEventListener("input", () => {
  const value = rInput.value.trim().replace(",", ".");
  const r = Number(value);

  if (
    value !== "" &&
    Number.isFinite(r) &&
    r >= MIN_R &&
    r <= MAX_R
  ) {
    drawArea(r);
  } else {
    drawArea(MIN_R);
  }
  });

  function checkHit(x, y, r) {
    const inCircle = (x <= 0 && y >= 0) && (x * x + y * y <= (r / 2) * (r / 2));
    const inTriangle = (x >= 0 && y >= 0) && (x + 2 * y <= r);
    const inRect = (x >= -r / 2 && x <= 0) && (y >= -r && y <= 0);
    return inCircle || inTriangle || inRect;
  }

  function validateForm() {
    let isValid = true;

    if (selectedX === null) {
      xErr.style.display = "block";
      isValid = false;
    } else {
      xErr.style.display = "none";
    }

    const yInput = document.getElementById("y-input").value.trim().replace(",", ".");
    const yNum = parseFloat(yInput);
    const yErr = document.getElementById("y-error");

    if (yInput === "" || isNaN(yNum) || yNum < -5 || yNum > 5) {
      yErr.style.display = "block";
      isValid = false;
    } else {
      yErr.style.display = "none";
    }

    const rInput = document.getElementById("r-input").value.trim().replace(",", ".");
    const rNum = parseFloat(rInput);
    const rErr = document.getElementById("r-error");

    if (rInput === "" || isNaN(rNum) || rNum < MIN_R || rNum > MAX_R) {
      rErr.style.display = "block";
      isValid = false;
    } else {
      rErr.style.display = "none";
    }

    return isValid ? { x: selectedX, y: yNum, r: rNum } : null;
  }

  function renderTable() {
    const tbody = document.getElementById("results-body");
    tbody.innerHTML = "";

    pointsHistory.slice().reverse().forEach(pt => {
      const tr = document.createElement("tr");

      const tdX = document.createElement("td");
      tdX.textContent = pt.x;
      tr.appendChild(tdX);

      const tdY = document.createElement("td");
      tdY.textContent = pt.y;
      tr.appendChild(tdY);

      const tdR = document.createElement("td");
      tdR.textContent = pt.r;
      tr.appendChild(tdR);

      const tdHit = document.createElement("td");
      const hitClass = pt.hit ? "hit-true" : "hit-false";
      const hitText = pt.hit ? "Попадание" : "Промах";
      tdHit.classList.add(hitClass);
      tdHit.textContent = hitText;
      tr.appendChild(tdHit);

      const tdDate = document.createElement("td");
      const dateObj = new Date(pt.timestamp);
      const formattedDate = new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit"
      }).format(dateObj);
      tdDate.textContent = formattedDate;
      tr.appendChild(tdDate);

      const tdTime = document.createElement("td");
      tdTime.textContent = pt.executionTime;
      tr.appendChild(tdTime);

      tbody.appendChild(tr);
    });
  }

  document.getElementById("point-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const data = validateForm();
    if (!data) return;

    const start = performance.now();
    const hit = checkHit(data.x, data.y, data.r);
    const end = performance.now();

    pointsHistory.push({
      x: data.x,
      y: data.y,
      r: data.r,
      hit: hit,
      timestamp: Date.now(),
      executionTime: (end - start).toFixed(3)
    });

    localStorage.setItem("lab1_points", JSON.stringify(pointsHistory));
    renderTable();
    drawArea(data.r);
  });

  document.getElementById("clear-btn").addEventListener("click", () => {
  pointsHistory = [];
  localStorage.removeItem("lab1_points");
  selectedX = null;
  xButtons.forEach(b => b.classList.remove("selected"));

  renderTable();

  const r = Number(rInput.value.trim().replace(",", "."));

  drawArea(
    Number.isFinite(r) && r >= MIN_R && r <= MAX_R
      ? r
      : MIN_R
  );
});

  renderTable();

  const initialR = Number(rInput.value.trim().replace(",", "."));

  drawArea(
  Number.isFinite(initialR) && initialR >= MIN_R && initialR <= MAX_R
    ? initialR
    : MIN_R
);
});

