(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const scoreEl = document.getElementById("score");
  const overlay = document.getElementById("overlay");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");

  const W = canvas.width;
  const H = canvas.height;

  const ISO_TILE_W = 82;
  const ISO_TILE_H = 42;
  // World-unit physics tuned for visible parabolic jumps between 2~3.5 tile gaps.
  const GRAVITY = 10;
  const CHARGE_SPEED = 880;
  const MIN_POWER = 320;
  const MAX_POWER = 1020;

  const game = {
    running: false,
    charging: false,
    jumping: false,
    failed: false,
    score: 0,
    chargePower: 0,
    camera: { x: W * 0.5, y: H * 0.64 },
    player: {
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      scaleX: 1,
      scaleY: 1,
      fromId: 0,
      toId: 1,
    },
    blocks: [],
    lastTime: 0,
  };

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function project(x, y, z = 0) {
    return {
      x: (x - y) * (ISO_TILE_W / 2) + game.camera.x,
      y: (x + y) * (ISO_TILE_H / 2) + game.camera.y - z,
    };
  }

  function makeBlock(id, x, y, size, color) {
    return { id, x, y, size, height: 22, color };
  }

  function makeNextBlock(prev) {
    const step = rand(2.1, 3.5);
    const alongX = Math.random() > 0.5;
    const nx = prev.x + (alongX ? step : 0);
    const ny = prev.y + (!alongX ? step : 0);
    const palette = ["#3f4d73", "#394867", "#475a87", "#4f618f"];
    return makeBlock(prev.id + 1, nx, ny, rand(1.25, 1.55), palette[(prev.id + 1) % palette.length]);
  }

  function resetWorld() {
    const first = makeBlock(0, 0, 0, 1.45, "#3f4d73");
    const second = makeBlock(1, 2.7, 0, 1.35, "#4f618f");
    game.blocks = [first, second];

    game.player.x = first.x;
    game.player.y = first.y;
    game.player.z = 0;
    game.player.vx = 0;
    game.player.vy = 0;
    game.player.vz = 0;
    game.player.scaleX = 1;
    game.player.scaleY = 1;
    game.player.fromId = first.id;
    game.player.toId = second.id;

    game.chargePower = 0;
    game.score = 0;
    game.failed = false;
    game.jumping = false;
    game.charging = false;
    scoreEl.textContent = "0";

    const midpoint = {
      x: (first.x + second.x) * 0.5,
      y: (first.y + second.y) * 0.5,
    };
    const p = project(midpoint.x, midpoint.y, 0);
    game.camera.x += W * 0.5 - p.x;
    game.camera.y += H * 0.64 - p.y;
  }

  function currentBlock() {
    return game.blocks.find((b) => b.id === game.player.fromId);
  }

  function targetBlock() {
    return game.blocks.find((b) => b.id === game.player.toId);
  }

  function centerDistance(player, block) {
    const dx = player.x - block.x;
    const dy = player.y - block.y;
    return Math.hypot(dx, dy);
  }

  function isOnBlock(player, block) {
    const half = block.size * 0.5;
    return (
      player.x >= block.x - half &&
      player.x <= block.x + half &&
      player.y >= block.y - half &&
      player.y <= block.y + half
    );
  }

  function addScore(value) {
    game.score += value;
    scoreEl.textContent = String(game.score);
  }

  function startCharge() {
    if (!game.running || game.failed || game.jumping || game.charging) return;
    game.charging = true;
    game.chargePower = 0;
  }

  function releaseJump() {
    if (!game.running || !game.charging || game.failed || game.jumping) return;

    game.charging = false;
    game.jumping = true;

    const from = currentBlock();
    const to = targetBlock();
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;

    const power = Math.max(MIN_POWER, Math.min(MAX_POWER, game.chargePower));

    game.player.vx = ux * power * 0.0036;
    game.player.vy = uy * power * 0.0036;
    game.player.vz = power * 0.01;
    game.player.scaleX = 1;
    game.player.scaleY = 1;
  }

  function fail() {
    game.failed = true;
    game.running = false;
    game.jumping = false;
    game.charging = false;
    overlay.classList.add("show");
    overlay.querySelector("h1").textContent = "游戏结束";
    overlay.querySelector("p").textContent = `最终得分 ${game.score}，点击重新开始。`;
    startBtn.textContent = "再来一局";
  }

  function onLand() {
    const player = game.player;
    const from = currentBlock();
    const to = targetBlock();

    if (isOnBlock(player, to)) {
      const d = centerDistance(player, to);
      const bonusThreshold = to.size * 0.12;
      addScore(d < bonusThreshold ? 2 : 1);
      player.fromId = to.id;

      while (game.blocks.length > 7) game.blocks.shift();

      const newest = game.blocks[game.blocks.length - 1];
      const next = makeNextBlock(newest);
      game.blocks.push(next);
      player.toId = next.id;
      game.jumping = false;
      game.player.vx = 0;
      game.player.vy = 0;
      game.player.vz = 0;
      player.z = 0;
      return;
    }

    if (isOnBlock(player, from)) {
      game.jumping = false;
      game.player.vx = 0;
      game.player.vy = 0;
      game.player.vz = 0;
      player.z = 0;
      return;
    }

    fail();
  }

  function update(dt) {
    if (game.running && !game.failed) {
      if (game.charging) {
        game.chargePower = Math.min(MAX_POWER, game.chargePower + CHARGE_SPEED * dt);
        const t = game.chargePower / MAX_POWER;
        game.player.scaleY = 1 - t * 0.38;
        game.player.scaleX = 1 + t * 0.18;
      }

      if (game.jumping) {
        game.player.x += game.player.vx * dt;
        game.player.y += game.player.vy * dt;
        game.player.vz -= GRAVITY * dt;
        game.player.z += game.player.vz * dt;

        if (game.player.z <= 0 && game.player.vz < 0) {
          game.player.z = 0;
          onLand();
        }
      }
    }

    const from = currentBlock();
    const to = targetBlock();
    if (from && to) {
      const midx = (from.x + to.x) * 0.5;
      const midy = (from.y + to.y) * 0.5;
      const p = project(midx, midy, 0);
      game.camera.x += (W * 0.5 - p.x) * Math.min(1, dt * 3.2);
      game.camera.y += (H * 0.64 - p.y) * Math.min(1, dt * 3.2);
    }
  }

  function drawBlock(block) {
    const half = block.size * 0.5;
    const top = [
      project(block.x - half, block.y - half, 0),
      project(block.x + half, block.y - half, 0),
      project(block.x + half, block.y + half, 0),
      project(block.x - half, block.y + half, 0),
    ];

    const down = top.map((p) => ({ x: p.x, y: p.y + block.height }));

    ctx.fillStyle = "rgba(20, 30, 52, 0.16)";
    ctx.beginPath();
    ctx.moveTo(down[0].x, down[0].y + 8);
    for (let i = 1; i < 4; i++) ctx.lineTo(down[i].x, down[i].y + 8);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = shade(block.color, -16);
    ctx.beginPath();
    ctx.moveTo(top[0].x, top[0].y);
    ctx.lineTo(top[1].x, top[1].y);
    ctx.lineTo(down[1].x, down[1].y);
    ctx.lineTo(down[0].x, down[0].y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = shade(block.color, -8);
    ctx.beginPath();
    ctx.moveTo(top[1].x, top[1].y);
    ctx.lineTo(top[2].x, top[2].y);
    ctx.lineTo(down[2].x, down[2].y);
    ctx.lineTo(down[1].x, down[1].y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = block.color;
    ctx.beginPath();
    ctx.moveTo(top[0].x, top[0].y);
    for (let i = 1; i < 4; i++) ctx.lineTo(top[i].x, top[i].y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.arc((top[0].x + top[2].x) * 0.5, (top[0].y + top[2].y) * 0.5, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawPlayer() {
    const p = project(game.player.x, game.player.y, game.player.z);

    ctx.fillStyle = "rgba(20, 30, 52, 0.25)";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 6, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(game.player.scaleX, game.player.scaleY);

    ctx.fillStyle = "#2c2e35";
    ctx.beginPath();
    ctx.ellipse(0, -26, 12, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f6f7fb";
    ctx.beginPath();
    ctx.roundRect(-10, -18, 20, 28, 9);
    ctx.fill();

    ctx.fillStyle = "#2f66ff";
    ctx.beginPath();
    ctx.roundRect(-10, -2, 20, 12, 7);
    ctx.fill();

    ctx.restore();
  }

  function shade(hex, amount) {
    const c = hex.replace("#", "");
    const n = parseInt(c, 16);
    const r = Math.min(255, Math.max(0, (n >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amount));
    const b = Math.min(255, Math.max(0, (n & 0xff) + amount));
    return `rgb(${r}, ${g}, ${b})`;
  }

  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#f8fbff");
    g.addColorStop(1, "#d8e5ff");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.arc(W * 0.12, H * 0.2, 80, 0, Math.PI * 2);
    ctx.arc(W * 0.82, H * 0.14, 110, 0, Math.PI * 2);
    ctx.arc(W * 0.64, H * 0.28, 56, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw() {
    drawBackground();
    game.blocks.sort((a, b) => a.x + a.y - (b.x + b.y));
    for (const block of game.blocks) drawBlock(block);
    drawPlayer();

    if (game.charging) {
      const charge = Math.round((game.chargePower / MAX_POWER) * 100);
      ctx.fillStyle = "rgba(29, 49, 93, 0.75)";
      ctx.font = "bold 20px PingFang SC, sans-serif";
      ctx.fillText(`蓄力 ${charge}%`, 20, 36);
    }
  }

  function frame(ts) {
    if (!game.lastTime) game.lastTime = ts;
    const dt = Math.min(0.032, (ts - game.lastTime) / 1000);
    game.lastTime = ts;

    update(dt);
    draw();
    requestAnimationFrame(frame);
  }

  function startGame() {
    resetWorld();
    game.running = true;
    overlay.classList.remove("show");
  }

  function onKeyDown(e) {
    if (e.code === "Space") {
      e.preventDefault();
      startCharge();
    }
  }

  function onKeyUp(e) {
    if (e.code === "Space") {
      e.preventDefault();
      releaseJump();
    }
  }

  canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    startCharge();
  });

  window.addEventListener("pointerup", () => {
    releaseJump();
  });

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);

  resetWorld();
  requestAnimationFrame(frame);
})();
