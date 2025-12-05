// KABOOM SETUP 
kaboom({
  width: 560,
  height: 940,
  background: [0, 0, 0],
  stretch: true,
  letterbox: true,
  global: true,   
  debug: true,
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

loadSprite("firebg", "lvl4imgs/firebg1.jpg")
loadSprite("firebg2", "lvl4imgs/firebg2.jpg")
loadSprite("fireball", "lvl4imgs/fireball.png")
loadSprite("explode", "lvl4imgs/explode.png")
loadSprite("dragon", "lvl4imgs/dragon.png")
loadSprite("brick", "lvl4imgs/brick3.png")

loadSprite("introScreen", "imgs/BOUNCE TO THE SUMMIT.png")
loadSprite("Instructions", "imgs/instructions.png")
loadSprite("lvl1Instructions", "imgs/waterinstructions.png")
loadSprite("lvl2Instructions", "imgs/earthinstructions.png")
loadSprite("lvl3Instructions", "imgs/airinstructions.png")
loadSprite("lvl4Instructions", "imgs/fireinstructions.png")
loadSprite("winningMessage", "imgs/message.png")


const levelBadge = document.getElementById("levelBadge");
const retryBadge = document.getElementById("retryBadge");

// BADGE HELPERS
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
    go(currentLevel);
  });
}

// INTRO SCENE

scene("intro", () => {

  showLevelBadge("lvl1imgs/Level1.png", "Level 1");
  showRetryBadge("retry.png", "retry");
  
  // BACKGROUND SETUP 
  const BG_WIDTH = 1080;
  const BG_HEIGHT = 1920;

  const BG_SCALE = Math.max(
    width() / BG_WIDTH,
    height() / BG_HEIGHT,
  ) * 1.05;

  const centerX = width() / 2;
  const centerY = height() / 2;

  add([
    sprite("introScreen"),
    pos(centerX, centerY),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ])

  // cinematic black bars
  const topBar = add([
    rect(width(), height() / 2),
    pos(0, 0),
    color(0, 0, 0),
    z(5),
  ]);

  const bottomBar = add([
    rect(width(), height() / 2),
    pos(0, height() / 2),
    color(0, 0, 0),
    z(5),
  ]);

  //open like a curtain
  wait(0.5, () => {
    tween(topBar.pos.y, -height(), 1, (val) => topBar.pos.y = val, easings.easeOutCubic);
    tween(bottomBar.pos.y, height() * 2, 1, (val) => bottomBar.pos.y = val, easings.easeOutCubic);
  });

  //start Level 1 instructions
  wait(3, () => {
    go("Instructions");
  });
});

//Instructions

scene("Instructions", () => {

  showLevelBadge("lvl1imgs/Level1.png", "Level 1");
  showRetryBadge("retry.png", "retry");
  
  
  // BACKGROUND SETUP 
  const BG_WIDTH = 1080;
  const BG_HEIGHT = 1920;

  const BG_SCALE = Math.max(
    width() / BG_WIDTH,
    height() / BG_HEIGHT,
  ) * 1.05;

  const centerX = width() / 2;
  const centerY = height() / 2;

  add([
    sprite("Instructions"),
    pos(centerX, centerY),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ])

  // touch to continue
  onClick(() => go("level1instructions"));
});

//level 1 instructions

scene("level1instructions", () => {

  showLevelBadge("lvl1imgs/Level1.png", "Level 1");
  showRetryBadge("retry.png", "retry");
  
  
  // BACKGROUND SETUP 
  const BG_WIDTH = 1080;
  const BG_HEIGHT = 1920;

  const BG_SCALE = Math.max(
    width() / BG_WIDTH,
    height() / BG_HEIGHT,
  ) * 1.05;

  const centerX = width() / 2;
  const centerY = height() / 2;

  add([
    sprite("waterbg"),
    pos(centerX, centerY),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ])

  add([
    sprite("lvl1Instructions"),
    pos(centerX, centerY),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ])

  onClick(() => go("water"));
});


// SCENE: WATER LEVEL (LEVEL 1)
scene("water", () => {
  currentLevel = "water";

  showLevelBadge("lvl1imgs/Level1.png", "Level 1");
  showRetryBadge("retry.png", "retry");

  // BACKGROUND SETUP 
  const BG_WIDTH = 1080;
  const BG_HEIGHT = 1920;

  const BG_SCALE = Math.max(
    width() / BG_WIDTH,
    height() / BG_HEIGHT,
  ) * 1.05;

  const centerX = width() / 2;
  const centerY = height() / 2;

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

  // GROUND 
  const GROUND_Y = 860;
  add([
    rect(width(), 40),
    pos(0, GROUND_Y),
    area(),
    body({ isStatic: true }),
    opacity(0),
    "ground",
  ]);

  // BUBBLE PLATFORMS
  function addBubblePlatform(x, y) {
    const baseScale = 0.28;

    const bubble = add([
      sprite("bubbles"),
      pos(x, y),
      scale(baseScale),
      anchor("center"),
      area(
        {
        offset: vec2(0, 10)
      }
      ),
      body({ isStatic: true }),
      z(1), 
      "bubblePlat",
      {
        popTimer: 0,
        popped: false,
        baseScale,
      },
    ]);

    return bubble;
  }

  // PORTAL AT THE TOP go to EARTH
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

  // PLAYER
  const player = add([
    sprite("ball"),
    pos(width() / 2, GROUND_Y),
    scale(0.35),
    anchor("bot"),
    area(),
    body(),
    z(2), 
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

  // PLAYER UPDATE
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

  //BUBBLE POP LOGIC
  player.onCollideUpdate("bubblePlat", (b) => {
    if (b.popped) return;

    if (player.isGrounded()) {
      b.popTimer += dt();
    } else {
      b.popTimer = 0;
      b.scale = vec2(b.baseScale);
    }

    //wiggle before popping
    if (b.popTimer >= 0.8 && b.popTimer < 1.3) {
      const s = wave(b.baseScale * 0.9, b.baseScale * 1.1, time() * 20);
      b.scale = vec2(s);
    }

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

  player.onCollide("portal", () => {
    go("level2instructions");
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

//level 2 instructions

scene("level2instructions", () => {

  showLevelBadge("lvl1imgs/Level2.png", "Level 2");
  showRetryBadge("retry.png", "retry");
  
  
  // BACKGROUND SETUP 
  const BG_WIDTH = 1080;
  const BG_HEIGHT = 1920;

  const BG_SCALE = Math.max(
    width() / BG_WIDTH,
    height() / BG_HEIGHT,
  ) * 1.05;

  const centerX = width() / 2;
  const centerY = height() / 2;

  add([
    sprite("earthBg"),
    pos(centerX, centerY),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ])

  add([
    sprite("lvl2Instructions"),
    pos(centerX, centerY),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ])

  onClick(() => go("earth"));
});



// SCENE: EARTH LEVEL (LEVEL 2)
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
      area(
        {
        offset: vec2(0, 10) 
      }
      ),
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
      area({
        offset: vec2(0, 10)
      }),
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
      area(
        {
        offset: vec2(0, 10)
      }
      ),
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
    go("level3instructions");
  });

  onUpdate(() => {
    let targetY = player.pos.y - 250;

    const minCamY = -2000;
    const maxCamY = height() / 2;

    targetY = clamp(targetY, minCamY, maxCamY);

    camPos(centerX, targetY);
  });
});

//level 3 instructions

scene("level3instructions", () => {

  showLevelBadge("lvl1imgs/Level3.png", "Level 3");
  showRetryBadge("retry.png", "retry");
  
  
  // BACKGROUND SETUP 
  const BG_WIDTH = 1080;
  const BG_HEIGHT = 1920;

  const BG_SCALE = Math.max(
    width() / BG_WIDTH,
    height() / BG_HEIGHT,
  ) * 1.05;

  const centerX = width() / 2;
  const centerY = height() / 2;

  add([
    sprite("airbg"),
    pos(centerX, centerY),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ])

  add([
    sprite("lvl3Instructions"),
    pos(centerX, centerY),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ])

  onClick(() => go("airLevel"));
});


// SCENE: AIR LEVEL (LEVEL 3)
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
      area(
        {
        offset: vec2(0, 10) // push it slightly DOWN so top is flat
      }
      ),
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
      area({
        offset: vec2(0, 10) // push it slightly DOWN so top is flat
      }),
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

  // portal → fire level
  player.onCollide("portal", () => {
    go("level4instructions");
  });
});


//level 4 instructions

scene("level4instructions", () => {

  showLevelBadge("lvl1imgs/Level4.png", "Level 4");
  showRetryBadge("retry.png", "retry");
  
  
  // BACKGROUND SETUP 
  const BG_WIDTH = 1080;
  const BG_HEIGHT = 1920;

  const BG_SCALE = Math.max(
    width() / BG_WIDTH,
    height() / BG_HEIGHT,
  ) * 1.05;

  const centerX = width() / 2;
  const centerY = height() / 2;

  add([
    sprite("firebg"),
    pos(centerX, centerY),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ])

  add([
    sprite("lvl4Instructions"),
    pos(centerX, centerY),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ])

  onClick(() => go("fireLevel"));
});



// SCENE: FIRE LEVEL (LEVEL 4)
scene("fireLevel", () => {
  currentLevel = "fireLevel";

  showLevelBadge("lvl4imgs/lvl4.png", "Level 4");
  showRetryBadge("retry.png", "Retry");

  const BG_WIDTH = 1080;
  const BG_HEIGHT = 1920;

  const BG_SCALE = Math.max(
    width() / BG_WIDTH,
    height() / BG_HEIGHT,
  ) * 1.05;

  const centerX = width() / 2;
  const centerY = height() / 2;

  //FIRE BACKGROUNDS 
  add([
    sprite("firebg"),
    pos(centerX, centerY),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ]);

  add([
    sprite("firebg2"),
    pos(centerX, centerY - BG_HEIGHT * BG_SCALE),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ]);

  add([
    sprite("firebg2"),
    pos(centerX, centerY - BG_HEIGHT * BG_SCALE * 2),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ]);

  // INVISIBLE GROUND
  const GROUND_Y = 900;

  add([
    rect(width(), 20),
    pos(0, GROUND_Y),
    area(),
    body({ isStatic: true }),
    opacity(0),
    "ground",
  ]);

  // BRICK PLATFORMS
  function addBrick(x, y) {
    return add([
      sprite("brick"),
      pos(x, y),
      scale(0.6),
      anchor("center"),
      area({
        width: 80,
        height: 40,
        offset: vec2(-40, -10),
      }),
      body({ isStatic: true }),
      "brick",
    ]);
  }

  function addMovingBrick(x, y, range = 140, speed = 120) {
    const plat = add([
      sprite("brick"),
      pos(x, y),
      scale(0.6),
      anchor("center"),
      area({
        width: 80,
        height: 40,
        offset: vec2(-40, -10),
      }),
      body({ isStatic: true }),
      "brick",
      "movingBrick",
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

  // PLACE BRICKS
  addBrick(width() / 2, 720);
  addMovingBrick(width() / 2 - 140, 520, 170, 130);
  addBrick(width() / 2 + 120, 320);
  addBrick(width() / 2 - 100, 120);
  addMovingBrick(width() / 2 + 130, -120, 200, 160);
  addBrick(width() / 2, -360);
  addBrick(width() / 2 - 130, -600);

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

    if (player.pos.y > height() + 100) {
      go("fireLevel");
    }
  });

  // DRAGON

  const dragonX = width() - 70;
  const dragonStartY = height() + 120;

  const dragon = add([
    sprite("dragon"),
    pos(dragonX, dragonStartY),
    anchor("center"),
    scale(0.9),
    z(-1),
    "dragon",
  ]);

  let dragonAppeared = false;
  let shootTimer = 0;

  // shoot a fireball from dragon's mouth
  function shootFireball() {
    if (!dragon.exists()) return;

    const startX = dragon.pos.x - 85;
    const startY = dragon.pos.y - 70;

    const fire = add([
      sprite("fireball"),
      pos(startX, startY),
      anchor("center"),
      scale(0.4),
      area({
        width: 18,
        height: 18,
        offset: vec2(-9, -9),
      }),
      "fire",
      {
        dir: -1, 
        speed: 110,  
      },
    ]);

    fire.onUpdate(() => {
      fire.move(fire.speed * fire.dir, 0);
      fire.pos.y += wave(-0.2, 0.2, time() * 4);

      if (fire.pos.x < -180) destroy(fire);
    });
  }

  player.onCollide("fire", (f) => {
    if (!f.exists()) return;

    destroy(f);
    destroy(player);

    const boom = add([
      sprite("explode"),
      pos(player.pos),
      anchor("center"),
      scale(0.7),
    ]);

    shake(4);

    wait(0.5, () => {
      if (boom.exists()) destroy(boom);
      go("fireLevel");
    });
  });


  player.onCollideUpdate("brick", (brick) => {
    if (player.isGrounded()) {
      if (brick.breakTimer === undefined) brick.breakTimer = 0;
      brick.breakTimer += dt();

      if (brick.breakTimer >= 1 && brick.breakTimer < 2) {
        brick.angle = wave(-5, 5, time() * 20);
      }

      if (brick.breakTimer >= 3) {
        destroy(brick);
        shake(4);
      }
    } else {
      brick.breakTimer = 0;
      brick.angle = 0;
    }
  });

  //CAMERA
  onUpdate(() => {
    // camera follow
    let targetY = player.pos.y - 250;
    const minCamY = -2200;
    const maxCamY = height() / 2;

    targetY = clamp(targetY, minCamY, maxCamY);
    camPos(centerX, targetY);

    // DRAGON POPS UP FROM BOTTOM FIRST
    if (!dragonAppeared) {
      dragon.pos.y -= 80 * dt(); // speed of rising up
      if (dragon.pos.y <= player.pos.y) {
        dragonAppeared = true;
      }
    } else {
      // then it follows player smoothly
      const targetDragonY = player.pos.y;
      dragon.pos.y += (targetDragonY - dragon.pos.y) * dt() * 2;

      // tiny wiggle animation
      dragon.angle = wave(-4, 4, time() * 2);
    }

    // SHOOT EVERY 3 SECONDS
    shootTimer += dt();
    if (shootTimer >= 3) { 
      shootTimer = 0;
      shootFireball();
    }
  });

  // portal → win screen
  player.onCollide("portal", () => {
    go("outro");
  });
});


// OUTRO SCENE

scene("outro", () => {
  
  // BACKGROUND SETUP 
  const BG_WIDTH = 1080;
  const BG_HEIGHT = 1920;

  const BG_SCALE = Math.max(
    width() / BG_WIDTH,
    height() / BG_HEIGHT,
  ) * 1.05;

  const centerX = width() / 2;
  const centerY = height() / 2;

  add([
    sprite("winningMessage"),
    pos(centerX, centerY),
    anchor("center"),
    scale(BG_SCALE),
    z(-2),
  ])

  // cinematic black bars
  const topBar = add([
    rect(width(), height() / 2),
    pos(0, 0),
    color(0, 0, 0),
    z(5),
  ]);

  const bottomBar = add([
    rect(width(), height() / 2),
    pos(0, height() / 2),
    color(0, 0, 0),
    z(5),
  ]);

  //open like a curtain
  wait(0.5, () => {
    tween(topBar.pos.y, -height(), 1, (val) => topBar.pos.y = val, easings.easeOutCubic);
    tween(bottomBar.pos.y, height() * 2, 1, (val) => bottomBar.pos.y = val, easings.easeOutCubic);
  });
});

// START GAME: WATER FIRST
go("outro");
