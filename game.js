// KABOOM SETUP 
kaboom({
  width: 560,
  height: 940,
  background: [0, 0, 0],
  stretch: true,
  letterbox: true,
  global: true,   // so kaboom funcs are global
  debug: true,    // optional
});

setGravity(1600);

// track current level for retry
let currentLevel = "water";

// LOAD IMAGES
loadSprite("waterbg", "lvl1imgs/waterbg.png");
loadSprite("waterbg2", "lvl1imgs/waterbg2.jpg");
loadSprite("waterbg3", "lvl1imgs/waterbg3.jpg");
loadSprite("bubbles", "lvl1imgs/bubbles.png");

loadSprite("ball", "ball.png");
loadSprite("earthBg", "lvl2imgs/Earthbg.jpg");
loadSprite("bg2", "lvl2imgs/bg2.jpg");
loadSprite("log", "lvl2imgs/log.png");
loadSprite("brokenLog", "lvl2imgs/brokenLog.png");
loadSprite("portal", "portal.png");

loadSprite("airbg", "lvl3imgs/Sky.png");
loadSprite("airbg2", "lvl3imgs/Sky2.jpg");
loadSprite("airbg3", "lvl3imgs/Skybg3.png");
loadSprite("cloud", "lvl3imgs/Cloud.png");
loadSprite("gust", "lvl3imgs/gust.png");

const levelBadge = document.getElementById("levelBadge");
const retryBadge = document.getElementById("retryBadge");

// ---------- BADGE HELPERS ----------
function showLevelBadge(imgFile, altText) {
  if (!levelBadge) return;
  if (imgFile) levelBadge.src = imgFile;
  if (altText) levelBadge.alt = altText;
  levelBadge.style.display = "block";
}

function hideLevelBadge() {
  if (!levelBadge) return;
  levelBadge.style.display = "none";
}

function showRetryBadge(imgFile, altText) {
  if (!retryBadge) return;
  if (imgFile) retryBadge.src = imgFile;
  if (altText) retryBadge.alt = altText;
  retryBadge.style.display = "block";
}

function hideRetryBadge() {
  if (!retryBadge) return;
  retryBadge.style.display = "none";
}

// ONE retry handler only – restart the current level
if (retryBadge) {
  retryBadge.addEventListener("click", () => {
    hideRetryBadge();
    // you can hide the level badge too if you want:
    // hideLevelBadge();
    go(currentLevel);
  });
}

// =======================
// SCENE: WATER LEVEL (LEVEL 1)
// =======================
scene("water", () => {
  currentLevel = "water";

  showLevelBadge("Level1.png", "Level 1");
  showRetryBadge("retry.png", "retry");

  // ---- BACKGROUND SETUP ----
  const BG_WIDTH = 1080;
  const BG_HEIGHT = 1920;

  const BG_SCALE = Math.max(
    width() / BG_WIDTH,
    height() / BG_HEIGHT,
  ) * 1.05;

  const centerX = width() / 2;
  const centerY = height() / 2;

  // repeat the SAME waterbg 3 times to make a tall level
  add([
    sprite("waterbg"),
    pos(centerX, centerY),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ]);

  add([
    sprite("waterbg2"),
    pos(centerX, centerY - BG_HEIGHT * BG_SCALE),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ]);

  add([
    sprite("waterbg3"),
    pos(centerX, centerY - BG_HEIGHT * BG_SCALE * 2),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ]);

  // ---- INVISIBLE GROUND (BALL STANDS ON CORAL) ----
  const GROUND_Y = 860;   // tweak a bit up/down if needed

  add([
    rect(width(), 40),
    pos(0, GROUND_Y),
    area(),
    body({ isStatic: true }),
    opacity(0),            // invisible
    "ground",
  ]);

  // ---- BUBBLE PLATFORMS ----
  function addBubblePlatform(x, y) {
    const baseScale = 0.28;

    const bubble = add([
      sprite("bubbles"),
      pos(x, y),
      scale(baseScale),
      anchor("center"),
      area(),
      body({ isStatic: true }),
      z(1),                 // behind ball
      "bubblePlat",
      {
        popTimer: 0,
        popped: false,
        baseScale,
      },
    ]);

    return bubble;
  }

  // PORTAL AT THE TOP → go to EARTH (level 2)
  add([
    sprite("portal"),
    pos(width() / 2, -900),
    scale(0.9),
    anchor("center"),
    area(),
    "portal",
  ]);

  addBubblePlatform(width() / 2, 700);
  addBubblePlatform(width() / 2 - 140, 520);
  addBubblePlatform(width() / 2 + 140, 340);
  addBubblePlatform(width() / 2, 90);
  addBubblePlatform(width() / 2 - 120, -120);
  addBubblePlatform(width() / 2 + 120, -330);
  addBubblePlatform(width() / 2 - 100, -560);

  ;

  // ---- PLAYER ----
  const player = add([
    sprite("ball"),
    pos(width() / 2, GROUND_Y),
    scale(0.35),
    anchor("bot"),     // feet on the ground / bubbles
    area(),
    body(),
    z(2),              // in front of bubbles
    "player",
  ]);

  const MOVE_SPEED = 260;
  const JUMP_FORCE = 600;
  const MAX_JUMPS = 2;
  let jumpsLeft = MAX_JUMPS;

  onKeyDown("left", () => {
    player.move(-MOVE_SPEED, 0);
  });

  onKeyDown("right", () => {
    player.move(MOVE_SPEED, 0);
  });

  onKeyPress("space", () => {
    if (jumpsLeft > 0) {
      const force = jumpsLeft === MAX_JUMPS ? JUMP_FORCE : JUMP_FORCE * 1.2;
      player.jump(force);
      jumpsLeft--;
    }
  });

  // ---- PLAYER UPDATE (JUMPS + BOUNDS + FALL RESET) ----
  player.onUpdate(() => {
    if (player.isGrounded()) {
      jumpsLeft = MAX_JUMPS;
      player.pos.y += 4;
    }

    if (player.pos.x < 20) player.pos.x = 20;
    if (player.pos.x > width() - 20) player.pos.x = width() - 20;

    if (player.pos.y > height() + 100) {
      go("water");
    }
  });

  // ---- BUBBLE POP LOGIC ----
  player.onCollideUpdate("bubblePlat", (b) => {
    if (b.popped) return;

    if (player.isGrounded()) {
      b.popTimer += dt();
    } else {
      b.popTimer = 0;
      b.scale = vec2(b.baseScale);
    }

    // squish / wiggle before popping
    if (b.popTimer >= 0.8 && b.popTimer < 1.3) {
      const s = wave(b.baseScale * 0.9, b.baseScale * 1.1, time() * 20);
      b.scale = vec2(s);
    }

    // POP after ~1.3s
    if (b.popTimer >= 1.3) {
      b.popped = true;
      destroy(b);
      shake(3);
    }
  });

  player.onCollideEnd("bubblePlat", (b) => {
    if (!b.popped) {
      b.popTimer = 0;
      b.scale = vec2(b.baseScale);
    }
  });

  // ---- PORTAL → EARTH LEVEL ----
  player.onCollide("portal", () => {
    go("earth");
  });

  // ---- CAMERA FOLLOW ----
  onUpdate(() => {
    let targetY = player.pos.y - 250;

    const minCamY = -2000;
    const maxCamY = height() / 2;

    targetY = clamp(targetY, minCamY, maxCamY);
    camPos(centerX, targetY);
  });
});


// =======================
// SCENE: EARTH LEVEL (LEVEL 2)
// =======================
scene("earth", () => {
  currentLevel = "earth";

  showLevelBadge("lvl2imgs/Level2.png", "Level 2");
  showRetryBadge("retry.png", "retry");

  const BG_WIDTH = 1080;
  const BG_HEIGHT = 1920;

  const BG_SCALE = Math.max(
    width() / BG_WIDTH,
    height() / BG_HEIGHT,
  ) * 1.05;

  const centerX = width() / 2;
  const centerY = height() / 2;

  // backgrounds
  add([
    sprite("earthBg"),
    pos(centerX, centerY),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ]);

  add([
    sprite("bg2"),
    pos(centerX, centerY - BG_HEIGHT * BG_SCALE),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ]);

  add([
    sprite("bg2"),
    pos(centerX, centerY - BG_HEIGHT * BG_SCALE * 2),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ]);

  const GROUND_Y = 900;

  // ground
  add([
    rect(width(), 20),
    pos(0, GROUND_Y),
    area(),
    body({ isStatic: true }),
    opacity(0),
    "ground",
  ]);

  // platforms
  function addPlatform(x, y) {
    return add([
      sprite("log"),
      pos(x, y),
      scale(0.45),
      anchor("center"),
      area(),
      body({ isStatic: true }),
      "platform",
    ]);
  }

  function addBrokenPlatform(x, y) {
    const log = add([
      sprite("brokenLog"),
      pos(x, y),
      scale(0.45),
      anchor("center"),
      area(),
      body({ isStatic: true }),
      "broken",
    ]);

    log.breakTimer = 0;
    return log;
  }

  function addMovingPlatform(x, y, range = 120, speed = 100) {
    const plat = add([
      sprite("log"),
      pos(x, y),
      scale(0.45),
      anchor("center"),
      area(),
      body({ isStatic: true }),
      "moving",
      {
        startX: x,
        range,
        speed,
        dir: 1,
      },
    ]);

    plat.onUpdate(() => {
      plat.move(plat.speed * plat.dir, 0);
      if (plat.pos.x > plat.startX + plat.range) plat.dir = -1;
      if (plat.pos.x < plat.startX - plat.range) plat.dir = 1;
    });

    return plat;
  }

  // portal at top
  add([
    sprite("portal"),
    pos(width() / 2, -900),
    scale(0.9),
    anchor("center"),
    area(),
    "portal",
  ]);

  // layout
  addPlatform(width() / 2, 750);
  addBrokenPlatform(width() / 2 - 140, 520);
  addMovingPlatform(width() / 2 + 140, 290, 150, 120);
  addBrokenPlatform(width() / 2, 60);
  addPlatform(width() / 2 - 120, -170);
  addMovingPlatform(width() / 2 + 120, -400, 180, 150);
  addBrokenPlatform(width() / 2, -630);

  // player
  const player = add([
    sprite("ball"),
    pos(width() / 2, GROUND_Y),
    scale(0.4),
    anchor("bot"),
    area(),
    body(),
    "player",
  ]);

  const MOVE_SPEED = 260;
  const JUMP_FORCE = 600;
  const MAX_JUMPS = 2;
  let jumpsLeft = MAX_JUMPS;

  onKeyDown("left", () => player.move(-MOVE_SPEED, 0));
  onKeyDown("right", () => player.move(MOVE_SPEED, 0));

  onKeyPress("space", () => {
    if (jumpsLeft > 0) {
      let force = jumpsLeft === MAX_JUMPS ? JUMP_FORCE : JUMP_FORCE * 1.2;
      player.jump(force);
      jumpsLeft--;
    }
  });

  player.onUpdate(() => {
    if (player.isGrounded()) {
      jumpsLeft = MAX_JUMPS;
      player.pos.y += 4;
    }

    if (player.pos.x < 20) player.pos.x = 20;
    if (player.pos.x > width() - 20) player.pos.x = width() - 20;
  });

  // broken log logic
  player.onCollideUpdate("broken", (log) => {
    if (player.isGrounded()) {
      log.breakTimer += dt();
    } else {
      log.breakTimer = 0;
    }

    if (log.breakTimer >= 0.7 && log.breakTimer < 1) {
      log.angle = wave(-5, 5, time() * 20);
    }

    if (log.breakTimer >= 1) {
      destroy(log);
      shake(5);
    }
  });

  // portal → air level
  player.onCollide("portal", () => {
    go("airLevel");
  });

  onUpdate(() => {
    let targetY = player.pos.y - 250;

    const minCamY = -2000;
    const maxCamY = height() / 2;

    targetY = clamp(targetY, minCamY, maxCamY);

    camPos(centerX, targetY);
  });
});

// =======================
// SCENE: AIR LEVEL (LEVEL 3)
// =======================
scene("airLevel", () => {
  currentLevel = "airLevel";

  showLevelBadge("lvl3imgs/lvl3.png", "Level 3");
  showRetryBadge("retry.png", "Retry");

  const BG_WIDTH = 1080;
  const BG_HEIGHT = 1920;

  const BG_SCALE = Math.max(
    width() / BG_WIDTH,
    height() / BG_HEIGHT,
  ) * 1.05;

  const centerX = width() / 2;
  const centerY = height() / 2;

  // SKY BACKGROUNDS
  add([
    sprite("airbg"),
    pos(centerX, centerY),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ]);

  add([
    sprite("airbg2"),
    pos(centerX, centerY - BG_HEIGHT * BG_SCALE),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ]);

  add([
    sprite("airbg3"),
    pos(centerX, centerY - BG_HEIGHT * BG_SCALE * 2),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ]);

  // GROUND
  const GROUND_Y = 900;

  add([
    rect(width(), 20),
    pos(0, GROUND_Y),
    area(),
    body({ isStatic: true }),
    opacity(0),
    "ground",
  ]);

  // CLOUD PLATFORMS
  function addCloud(x, y) {
    return add([
      sprite("cloud"),
      pos(x, y),
      scale(0.6),
      anchor("center"),
      area(),
      body({ isStatic: true }),
      "cloud",
    ]);
  }

  function addMovingCloud(x, y, range = 140, speed = 120) {
    const plat = add([
      sprite("cloud"),
      pos(x, y),
      scale(0.6),
      anchor("center"),
      area(),
      body({ isStatic: true }),
      "cloud",
      "movingCloud",
      {
        startX: x,
        range,
        speed,
        dir: 1,
      },
    ]);

    plat.onUpdate(() => {
      plat.move(plat.speed * plat.dir, 0);

      if (plat.pos.x > plat.startX + plat.range) plat.dir = -1;
      if (plat.pos.x < plat.startX - plat.range) plat.dir = 1;
    });

    return plat;
  }

  // PORTAL AT TOP
  const portal = add([
    sprite("portal"),
    pos(width() / 2, -950),
    scale(0.9),
    anchor("center"),
    area(),
    "portal",
  ]);

  portal.onUpdate(() => {
    portal.angle += dt() * 40;
  });

  // PLACE CLOUDS 
  addCloud(width() / 2, 720);
  addMovingCloud(width() / 2 - 140, 520, 170, 130);
  addCloud(width() / 2 + 120, 320);
  addCloud(width() / 2 - 100, 120);
  addMovingCloud(width() / 2 + 130, -120, 200, 160);
  addMovingCloud(width() / 2, -360);
  addCloud(width() / 2 - 130, -600);

  // PLAYER 
  const player = add([
    sprite("ball"),
    pos(width() / 2, GROUND_Y),
    scale(0.4),
    anchor("bot"),
    area(),
    body(),
    "player",
  ]);

  const MOVE_SPEED = 260;
  const JUMP_FORCE = 620;
  const MAX_JUMPS = 2;
  let jumpsLeft = MAX_JUMPS;

  onKeyDown("left", () => {
    player.move(-MOVE_SPEED, 0);
  });

  onKeyDown("right", () => {
    player.move(MOVE_SPEED, 0);
  });

  onKeyPress("space", () => {
    if (jumpsLeft > 0) {
      const force = jumpsLeft === MAX_JUMPS ? JUMP_FORCE : JUMP_FORCE * 1.25;
      player.jump(force);
      jumpsLeft--;
    }
  });

  player.onUpdate(() => {
    if (player.isGrounded()) {
      jumpsLeft = MAX_JUMPS;
      player.pos.y += 4;
    }

    if (player.pos.x < 20) player.pos.x = 20;
    if (player.pos.x > width() - 20) player.pos.x = width() - 20;

    // fell off → restart air level
    if (player.pos.y > height() + 100) {
      go("airLevel");
    }
  });

  // WIND GUSTS
  function spawnWindBurst(y, dir = 1, force = 900, speed = 260) {
    const startX = dir === 1 ? -120 : width() + 120;

    const wind = add([
      sprite("gust"),
      pos(startX, y),
      scale(0.35),
      anchor("center"),
      area(),
      "wind",
      {
        dir,
        force: force * dir,
        speed,
      },
    ]);

    wind.onUpdate(() => {
      wind.move(wind.speed * wind.dir, 0);
      wind.pos.y += wave(-0.4, 0.4, time() * 4);

      if (wind.dir === 1 && wind.pos.x > width() + 180) destroy(wind);
      if (wind.dir === -1 && wind.pos.x < -180) destroy(wind);
    });

    return wind;
  }

  // when the ball TOUCHES the gust push sideways
  player.onCollide("wind", (w) => {
    player.move(w.force, 0);
  });

  // TRIGGERS: more gusts at different heights 
  const gustTriggers = [
    { y: 760, dir: 1,  fired: false },
    { y: 660, dir: -1, fired: false },
    { y: 560, dir: 1,  fired: false },
    { y: 460, dir: -1, fired: false },
    { y: 360, dir: 1,  fired: false },
    { y: 240, dir: -1, fired: false },
    { y: 120, dir: 1,  fired: false },
    { y:   0, dir: -1, fired: false },
    { y: -160, dir: 1,  fired: false },
    { y: -320, dir: -1, fired: false },
    { y: -480, dir: 1,  fired: false },
    { y: -640, dir: -1, fired: false },
  ];

  // Clouds disappear (only when standing on them)
  player.onCollideUpdate("cloud", (cloud) => {
    if (player.isGrounded()) {
      if (cloud.breakTimer === undefined) cloud.breakTimer = 0;
      cloud.breakTimer += dt();

      if (cloud.breakTimer >= 1 && cloud.breakTimer < 2) {
        cloud.angle = wave(-5, 5, time() * 20);
      }

      if (cloud.breakTimer >= 3) {
        destroy(cloud);
        shake(4);
      }
    } else {
      cloud.breakTimer = 0;
      cloud.angle = 0;
    }
  });

  onUpdate(() => {
    // camera follow
    let targetY = player.pos.y - 250;
    const minCamY = -2200;
    const maxCamY = height() / 2;

    targetY = clamp(targetY, minCamY, maxCamY);
    camPos(centerX, targetY);

    // fire gusts when player reaches certain heights
    for (const g of gustTriggers) {
      if (!g.fired && player.pos.y <= g.y) {
        g.fired = true;
        spawnWindBurst(g.y, g.dir);
      }
    }
  });

  // portal → win screen
  player.onCollide("portal", () => {
    go("win");
  });
});

// WIN SCREEN
scene("win", () => {
  hideRetryBadge();
  hideLevelBadge();

  add([
    text("Level 4!!", { size: 36 }),
    pos(40, 200),
    color(255, 255, 255),
  ]);
});

// START GAME: WATER FIRST
go("water");
