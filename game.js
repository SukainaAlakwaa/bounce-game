// KABOOM SETUP 
kaboom({
  width: 560,
  height: 940,
  background: [0, 0, 0],
  stretch: true,
  letterbox: true,
  global: true,   // ⬅️ add this
  debug: true,    // ⬅️ optional, but helps show errors
});

setGravity(1600);

// track current level for retry
let currentLevel = "water";

// LOAD IMAGES
loadSprite("waterbg", "waterbg.png");
loadSprite("bubbles", "lvl1imgs/bubbles.png");
loadSprite("ball", "ball.png");
loadSprite("earthBg", "lvl2imgs/Earthbg.jpg");
loadSprite("bg2", "lvl2imgs/bg2.jpg");
loadSprite("log", "lvl2imgs/log.png");
loadSprite("brokenLog", "lvl2imgs/brokenLog.png");
loadSprite("portal", "portal.png");

const levelBadge = document.getElementById("levelBadge");
const retryBadge = document.getElementById("retryBadge");

// ONE retry handler only
if (retryBadge) {
  retryBadge.addEventListener("click", () => {
    hideRetryBadge();
    hideLevelBadge();
    go(currentLevel);   // restart the level you're currently in
  });
}

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

// =======================
// SCENE: WATER LEVEL (LEVEL 1)
// =======================
scene("water", () => {

  currentLevel = "water";   // important for retry

  showLevelBadge("Level1.png", "Level 1");
  showRetryBadge("retry.png", "retry");

  // BACKGROUND SETUP
  const BG_WIDTH = 1080;
  const BG_HEIGHT = 1920;

  const BG_SCALE = Math.max(
    width() / BG_WIDTH,
    height() / BG_HEIGHT
  ) * 1.05;

  const centerX = width() / 2;
  const centerY = height() / 2;

  // water background (stacked for taller map)
  add([
    sprite("waterbg"),
    pos(centerX, centerY),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ]);

  add([
    sprite("waterbg"),
    pos(centerX, centerY - BG_HEIGHT * BG_SCALE),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ]);

  add([
    sprite("waterbg"),
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

  // BUBBLE PLATFORMS
 function addBubblePlatform(x, y) {
  const bubble = add([
    sprite("bubbles"),
    pos(x, y),
    scale(0.6),          // a bit bigger than the ball
    anchor("center"),
    area(),
    body({ isStatic: true }),
    z(2),                // draw in FRONT of the ball
    "bubblePlat",
    {
      popTimer: 0,
      popped: false,
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

  // BUBBLE LAYOUT
  addBubblePlatform(width() / 2, 750);
  addBubblePlatform(width() / 2 - 120, 550);
  addBubblePlatform(width() / 2 + 130, 350);
  addBubblePlatform(width() / 2, 150);

  // PLAYER
  const player = add([
  sprite("ball"),
  pos(width() / 2, GROUND_Y),
  scale(0.45),      // a bit bigger
  anchor("center"), // center it so it sits inside the bubble
  area(),
  body(),
  z(1),             // behind the bubble (bubble is z(2))
  "player",
]);


  const MOVE_SPEED = 260;
  const JUMP_FORCE = 600;
  const MAX_JUMPS = 2;
  let jumpsLeft = MAX_JUMPS;

  // controls
  onKeyDown("left", () => {
    player.move(-MOVE_SPEED, 0);
  });

  onKeyDown("right", () => {
    player.move(MOVE_SPEED, 0);
  });

  onKeyPress("space", () => {
    if (jumpsLeft > 0) {
      let force = jumpsLeft === MAX_JUMPS ? JUMP_FORCE : JUMP_FORCE * 1.2;
      player.jump(force);
      jumpsLeft--;
    }
  });

  // RESET JUMPS + LIMITS
  player.onUpdate(() => {
    if (player.isGrounded()) {
      jumpsLeft = MAX_JUMPS;
      player.pos.y += 4;
    }

    if (player.pos.x < 20) player.pos.x = 20;
    if (player.pos.x > width() - 20) player.pos.x = width() - 20;

    if (player.pos.y > height() + 100) {
      go("water");   // restart Level 1 if you fall
    }
  });

  // BUBBLE POP LOGIC
  player.onCollideUpdate("bubblePlat", (b) => {
    if (b.popped) return;

    if (player.isGrounded()) {
      b.popTimer += dt();
    } else {
      b.popTimer = 0;
      b.scale = vec2(0.5);
    }

    // squish / wiggle before popping
    if (b.popTimer >= 0.8 && b.popTimer < 1.3) {
      b.scale = vec2(wave(0.45, 0.55, time() * 20));
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
      b.scale = vec2(0.5);
    }
  });

  // PORTAL COLLISION → go to EARTH
  player.onCollide("portal", () => {
    go("earth");
  });

  // CAMERA FOLLOW
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
    height() / BG_HEIGHT
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
      }
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

    if (player.pos.y > height() + 100) {
      go("earth");
    }
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

  // portal → air level (placeholder)
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

// Air level
scene("airLevel", () => {
  hideLevelBadge();
  hideRetryBadge();

  add([
    text("🔥 Level 3 Coming Soon", { size: 48 }),
    pos(30, 200),
    color(255, 255, 255),
  ]);
});

// START GAME: WATER FIRST
go("water");
