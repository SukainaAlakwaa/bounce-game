//KABOOM SETUP 
kaboom({
  width: 560,
  height: 940,
  background: [0, 0, 0],
});

setGravity(1600);

//LOAD IMAGES
loadSprite("ball", "ball.png");
loadSprite("earthBg", "lvl2imgs/Earthbg.jpg");
loadSprite("bg2", "lvl2imgs/bg2.jpg");
loadSprite("log", "lvl2imgs/log.png");
loadSprite("brokenLog", "lvl2imgs/brokenLog.png");
loadSprite("portal", "portal.png");

const levelBadge = document.getElementById("levelBadge");
const retryBadge = document.getElementById("retryBadge");

//Make the Retry image actually restart the level
if (retryBadge) {
  retryBadge.addEventListener("click", () => {
    hideRetryBadge();
    hideLevelBadge();
    go("earth");   // restart your current level
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

//SCENE: EARTH LEVEL
scene("earth", () => {

  // show Level 1 badge when this scene starts
  showLevelBadge("lvl2imgs/Level2.png", "Level 2");
  showRetryBadge("retry.png", "retry");

  //BACKGROUND SETUP
  const BG_WIDTH = 1080;
  const BG_HEIGHT = 1920;

  const BG_SCALE = Math.max(
    width() / BG_WIDTH,
    height() / BG_HEIGHT
  ) * 1.05;

  const centerX = width() / 2;
  const centerY = height() / 2;

  // bottom background
  add([
    sprite("earthBg"),
    pos(centerX, centerY),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ]);

  // upper background (taller map)
  add([
    sprite("bg2"),
    pos(centerX, centerY - BG_HEIGHT * BG_SCALE),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ]);

  // third background
  add([
    sprite("bg2"),
    pos(centerX, centerY - BG_HEIGHT * BG_SCALE * 2),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ]);


  //GROUND
  const GROUND_Y = 900;

  add([
    rect(width(), 20),
    pos(0, GROUND_Y),
    area(),
    body({ isStatic: true }),
    opacity(0),
    "ground",
  ]);

  //PLATFORMS
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
        range: range,
        speed: speed,
        dir: 1,   // 1 = right, -1 = left
      }
    ]);

    plat.onUpdate(() => {
      plat.move(plat.speed * plat.dir, 0);

      // bounce left/right
      if (plat.pos.x > plat.startX + plat.range) plat.dir = -1;
      if (plat.pos.x < plat.startX - plat.range) plat.dir = 1;
    });

    return plat;
  }

  //PORTAL AT THE TOP
  const portal = add([
    sprite("portal"),
    pos(width() / 2, -900),
    scale(0.9),
    anchor("center"),
    area(),
    "portal",
  ]);

  //PLATFORMS
  addPlatform(width() / 2, 750);
  addBrokenPlatform(width() / 2 - 140, 520);

  // moving one
  addMovingPlatform(width() / 2 + 140, 290, 150, 120);

  addBrokenPlatform(width() / 2, 60);
  addPlatform(width() / 2 - 120, -170);

  // another moving one
  addMovingPlatform(width() / 2 + 120, -400, 180, 150);

  addBrokenPlatform(width() / 2, -630);

  //PLAYER
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

  // controls
  onKeyDown("left", () => {
    player.move(-MOVE_SPEED, 0);
  });

  onKeyDown("right", () => {
    player.move(MOVE_SPEED, 0);
  });

  // double jump
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
      go("earth");
    }
  });

  // BROKEN PLATFORM LOGIC
  player.onCollideUpdate("broken", (log) => {
    if (player.isGrounded()) {
      log.breakTimer += dt();
    } else {
      log.breakTimer = 0;
    }

    // shake between 0.7s and 1s
    if (log.breakTimer >= 0.7 && log.breakTimer < 1) {
      log.angle = wave(-5, 5, time() * 20);
    }

    // break at 1s
    if (log.breakTimer >= 1) {
      destroy(log);
      shake(5);
    }
  });

  //PORTAL COLLISION (NEXT LEVEL)
  player.onCollide("portal", () => {
    go("airLevel");
  });

  //CAMERA FOLLOW
  onUpdate(() => {
    let targetY = player.pos.y - 250;

    const minCamY = -2000;
    const maxCamY = height() / 2;

    targetY = clamp(targetY, minCamY, maxCamY);

    camPos(centerX, targetY);
  });
});

//Airlevel
scene("airLevel", () => {
  // level finished → hide badge for now
  hideLevelBadge();
  hideRetryBadge();

  add([
    text("🔥 Level 2 Coming Soon", { size: 48 }),
    pos(30, 200),
    color(255, 255, 255),
  ]);
});

// START GAME
go("earth");
