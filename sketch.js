import Population from './Population.js';

const Vec2 = Box2D.Common.Math.b2Vec2;
const b2BodyDef = Box2D.Dynamics.b2BodyDef;
const b2Body = Box2D.Dynamics.b2Body;
const b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
const b2Fixture = Box2D.Dynamics.b2Fixture;
const b2World = Box2D.Dynamics.b2World;
const b2MassData = Box2D.Collision.Shapes.b2MassData;
const b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
const b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
const b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef;

const b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
const b2StaticBody = Box2D.Dynamics.b2Body.b2_staticBody;
const b2DynamicBody = Box2D.Dynamics.b2Body.b2_dynamicBody;
const b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint;
const b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

const b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint;

const b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;

const b2FilterData = Box2D.Dynamics.b2FilterData;

const b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint;
const b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;

const b2WeldJoint = Box2D.Dynamics.Joints.b2WeldJoint;
const b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;

//------------------------------------------GLOBALS
const SCALE = 30;
let groundBody;
let wheels = [];
let groundTemplate;

let pause = false;

let panX = 0;
let targetPanX = 0;
let maxPanSpeed = 100;
let panSpeed = 50;
let panAcc = 10;
let panY = 0;

let leftDown = false;
let rightDown = false;
const listener = new Box2D.Dynamics.b2ContactListener();

// Game State and Power-up Systems
let gameState;
let powerUpManager;

let carSprite;
let headSprite;
let cbHead = false;
let wheelSprite;
let shownGround = false;

let spawningY = 0;

//collisionCatagories i.e what it is


const WHEEL_CATEGORY = 0x0001;
const CHASSIS_CATEGORY = 0x0002;
const GRASS_CATEGORY = 0x0004;
const DIRT_CATEGORY = 0x0008;
const PERSON_CATEGORY = 0x0010;

//collision Masks ie. what it collides with
const WHEEL_MASK = (GRASS_CATEGORY);
const CHASSIS_MASK = (DIRT_CATEGORY);
const GRASS_MASK = (WHEEL_CATEGORY | PERSON_CATEGORY);
const DIRT_MASK = (CHASSIS_CATEGORY);
const PERSON_MASK = (GRASS_CATEGORY);

let resetCounter = 120;
let reset = false;

let p;
let p2;
let nextPanX = 0;


let nextConnectionNo = 1000;
let population;
let speed = 60;


let showBest = false; //true if only show the best of the previous generation
let runBest = false; //true if replaying the best ever game
let humanPlaying = false; //true if the user is playing

let fightMode = false; //true when the player is fighting the best every player
let humanPlayer;


let showBrain = false;

let showBestEachGen = false;
let upToGen = 0;
let genPlayerTemp; //player

let showNothing = false;

let currentBestPlayer;
let spawnHeight = 0;
//--------------

let playersInEachWorld = [];


let grassSprites = [];

// let ground;
// let world;

let otherWorld; // for human, gen replay, species, best
let worlds = [];
let grounds = [];
let numberOfWorlds = 50;
let playersPerWorld = 15;


let skySprite;
let darknessSprite;
let difficulty = 50;

listener.BeginContact = function(contact) {
  let world = contact.GetFixtureA().GetBody().GetWorld();
  if (reset) {
    return;
  }
  let userDataA = contact.GetFixtureA().GetBody().GetUserData();
  let userDataB = contact.GetFixtureB().GetBody().GetUserData();

  if (userDataA && userDataB) {
    if (userDataA.id == "head") {
      if (userDataB.id == "ground") {

        if (contact.GetFixtureA().GetBody().GetJointList() == null) {
          return;
        }
        let car = contact.GetFixtureA().GetBody().GetJointList().other.GetJointList().other.GetUserData(); //i think that is the grossest code i have ever written
        if (car) {
          world.DestroyJoint(car.distJoint);
          world.DestroyJoint(car.person.distJoint);
          world.DestroyJoint(car.revJoint);
          world.DestroyJoint(car.person.headJoint);
          car.player.kindaDead = true;
        }
      }
    }

    if (userDataB.id == "head") {
      if (userDataA.id == "ground") {

        if (contact.GetFixtureB().GetBody().GetJointList() == null) {
          return;
        }
        let car = contact.GetFixtureB().GetBody().GetJointList().other.GetJointList().other.GetUserData(); //i think that is the grossest code i have ever written
        if (car) {
          world.DestroyJoint(car.distJoint);
          world.DestroyJoint(car.person.distJoint);
          world.DestroyJoint(car.revJoint);
          world.DestroyJoint(car.person.headJoint);
          car.player.kindaDead = true;
        }
      }
    }

    if (userDataA.id == "wheel") {
      if (userDataB.id == "ground") {
        createDiv("oi fuck");

        let userDataA = contact.GetFixtureA().GetBody().GetUserData();
        if (userDataA) {
          userDataA.onGround = true;
        }
      }
    }

    if (userDataB.id == "wheel") {
      if (userDataA.id == "ground") {

        let userDataB = contact.GetFixtureB().GetBody().GetUserData();
        if (userDataB) {
          userDataB.onGround = true;
        }

      }
    }
  }
}

//
// listener2.BeginContact = function(contact) {
//
//
// }
listener.EndContact = function(contact) {
  let userDataA = contact.GetFixtureA().GetBody().GetUserData();
  let userDataB = contact.GetFixtureB().GetBody().GetUserData();

  if (userDataA && userDataB) {
    if (userDataA.id == "wheel") {
      if (userDataB.id == "ground") {
        userDataA.onGround = false;
      }
    }

    if (userDataB.id == "wheel") {
      if (userDataA.id == "ground") {
        userDataB.onGround = false;
      }
    }
  }
}


//--------------------------------------------------------------------------------------------------------------------------------------------------
function loadImageWithFallback(path, fallbackPath) {
  return new Promise((resolve) => {
    let img = loadImage(path, 
      () => resolve(img), 
      () => resolve(loadImage(fallbackPath))
    );
  });
}

async function preload() {
  CBHeadSprite = await loadImageWithFallback("Pics/CBHead3.png", "Pics/placeholder_jeep.svg");
  headSprite = await loadImageWithFallback("Pics/headLarge.png", "Pics/placeholder_jeep.svg");
  skySprite = await loadImageWithFallback("Pics/sky.png", "Pics/placeholder_jeep.svg");
  darknessSprite = await loadImageWithFallback("Pics/darkness.png", "Pics/placeholder_jeep.svg");

  carSprite = await loadImageWithFallback("Pics/car.png", "Pics/placeholder_jeep.svg");
  wheelSprite = await loadImageWithFallback("Pics/wheel2.png", "Pics/placeholder_jeep.svg");
  grassSprites.push(await loadImageWithFallback("Pics/grass.png", "Pics/placeholder_jeep.svg"));
  grassSprites.push(await loadImageWithFallback("Pics/grass2.png", "Pics/placeholder_jeep.svg"));
  grassSprites.push(await loadImageWithFallback("Pics/grass3.png", "Pics/placeholder_jeep.svg"));
  grassSprites.push(await loadImageWithFallback("Pics/grass4.png", "Pics/placeholder_jeep.svg"));
  grassSprites.push(await loadImageWithFallback("Pics/grass5.png", "Pics/placeholder_jeep.svg"));
  grassSprites.push(await loadImageWithFallback("Pics/grass5.png", "Pics/placeholder_jeep.svg"));
}

function setup() {
  window.canvas = createCanvas(1280, 720);
  canvas.parent("game-container");
  frameRate(30); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<FRAME RATE

  // Initialize game state and power-up systems
  gameState = new GameState();
  
  groundTemplate = new Ground();
  groundTemplate.randomizeGround();

  while (groundTemplate.isTooSteep()) {
    groundTemplate = new Ground();
    groundTemplate.randomizeGround();
  }

  for (var i = 0; i < numberOfWorlds; i++) {
    let tempWorld = new b2World(new Vec2(0, 10), true);
    let tempGround = new Ground(tempWorld);
    tempGround.cloneFrom(groundTemplate);
    tempGround.setBodies(tempWorld);
    tempWorld.SetContactListener(listener);
    // tempWorld.SetContactListener(listener2);

    grounds.push(tempGround);
    worlds.push(tempWorld);
    playersInEachWorld.push(0);
  }

  otherWorld = new b2World(new Vec2(0, 10), true);
  let tempGround = new Ground(otherWorld);
  tempGround.cloneFrom(groundTemplate);
  tempGround.setBodies(otherWorld);
  otherWorld.SetContactListener(listener);

  // Initialize power-up manager for the first world
  powerUpManager = new PowerUpManager(worlds[0]);

  population = new Population();
  humanPlayer = new Player(true);
  currentBestPlayer = population.players[0];
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
function draw() {

  if (pause) {
    return;
  }
  shownGround = false;
  drawToScreen();
  nextPanX = -100;


  // world.Step(1 / 30, 10, 10);

  if (showBestEachGen) { //show the best of each gen
    if (!genPlayerTemp.dead) { //if current gen player is not dead then update it
      otherWorld.Step(1 / 30, 10, 10);
      genPlayerTemp.look();
      genPlayerTemp.think();
      genPlayerTemp.update();
      genPlayerTemp.show();
      
      // Update power-ups
      if (powerUpManager) powerUpManager.update(gameState, genPlayerTemp);
    } else { //if dead move on to the next generation
      upToGen++;
      if (upToGen >= population.genPlayers.length) { //if at the end then return to the start and stop doing it
        upToGen = 0;
        showBestEachGen = false;
      } else { //if not at the end then get the next generation
        genPlayerTemp = population.genPlayers[upToGen].cloneForReplay();
        genPlayerTemp.addToWorld();
      }
    }
  } else
  if (humanPlaying) { //if the user is controling the ship[
    if (!humanPlayer.dead) { //if the player isnt dead then move and show the player based on input
      otherWorld.Step(1 / 30, 10, 10);

      humanPlayer.update();
      humanPlayer.show();
      humanPlayer.look();
      
      // Update fuel consumption for human player
      if (gameState && humanPlayer.car) {
        const distance = humanPlayer.car.maxDistance - 349;
        const vehicleData = VEHICLE_LIST ? VEHICLE_LIST[gameState.selectedVehicle] : null;
        const fuelEfficiency = vehicleData ? vehicleData.fuelEfficiency : 7;
        
        if (distance > 0) {
          gameState.consumeFuel(distance / 100, fuelEfficiency);
          
          // End game if out of fuel
          if (gameState.fuel <= 0) {
            humanPlayer.dead = true;
          }
        }
      }

      // Update power-ups
      if (powerUpManager) powerUpManager.update(gameState, humanPlayer);

    } else { //once done return to ai
      humanPlaying = false;
      
      // Complete game and award rewards
      if (gameState && humanPlayer) {
        const rewards = gameState.completeGame(humanPlayer.score, humanPlayer.car ? humanPlayer.car.maxDistance : 0);
        console.log(`Game completed! Coins earned: ${rewards.coins}, Diamonds earned: ${rewards.diamonds}`);
      }
    }
  } else
  if (runBest) { // if replaying the best ever game
    if (!population.bestPlayer.dead) { //if best player is not dead
      otherWorld.Step(1 / 30, 10, 10);

      population.bestPlayer.look();
      population.bestPlayer.think();
      population.bestPlayer.update();
      population.bestPlayer.show();
      
      // Update power-ups
      if (powerUpManager) powerUpManager.update(gameState, population.bestPlayer);
    } else { //once dead
      runBest = false; //stop replaying it
      population.bestPlayer = population.bestPlayer.cloneForReplay(); //reset the best player so it can play again
    }
  } else if (fightMode) {
    if (!population.bestPlayer.dead || !humanPlayer.dead) {
      otherWorld.Step(1 / 30, 10, 10);
      humanPlayer.update();
      humanPlayer.show();
      population.bestPlayer.look();
      population.bestPlayer.think();
      population.bestPlayer.update();
      population.bestPlayer.show();
      
      // Update power-ups
      if (powerUpManager) powerUpManager.update(gameState, humanPlayer);
    } else {
      fightMode = false;
      population.bestPlayer = population.bestPlayer.cloneForReplay();
    }
  } else { //if just evolving normally
    if (!population.done()) { //if any players are alive then update them
      // for (var w of worlds) {
      //   w.Step(1 / 30, 10, 10);
      // }
      population.stepWorldsInBatch();
      population.updateAlive();
      
      // Update power-ups for AI mode
      if (powerUpManager) powerUpManager.update(gameState, currentBestPlayer);
    } else { //all dead
      //genetic algorithm
      // grounds[0].show()
      population.naturalSelection();
      currentBestPlayer = population.players[0];
      panX = 0;
      nextPanX = 0;
      targetX = 0;
      
      // Reset power-up manager for new generation
      if (powerUpManager) powerUpManager.reset();
    }
  }

  targetPanX = nextPanX;
  let tempMult = 1;
  if (abs(targetPanX - panX) > 20 * panSpeed) {
    tempMult = 5; //floor(abs(targetPanX - panX) / 60);
    console.log(tempMult);
  }
  if (abs(targetPanX - panX) < panSpeed * tempMult) {
    panX = targetPanX;

  } else if (targetPanX - panX < 0) {
    panX -= panSpeed * tempMult;

  } else {
    panX += panSpeed * tempMult;
  }

  if (!shownGround) {
    grounds[0].show();
  }
  
  // Show power-ups
  if (powerUpManager) {
    powerUpManager.show();
  }
  
  if (panX < 0) {
    image(darknessSprite, -panX, 400);

  } else {
    image(darknessSprite, 0, 400);

  }

}


//---------------------------------------------------------------------------------------------------------------------------------------------------------
//draws the display screen
function drawToScreen() {
  if (!showNothing) {
    // Clear background with sky image
    background(120, 200, 255);
    image(skySprite, 0, 0);

    // Draw HUD overlay for vehicle, stage, fuel, coin, diamond
    drawHUD();

    //pretty stuff
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace

    drawBrain();
    writeInfo();
  }
}

function drawHUD() {
  fill(255);
  stroke(0);
  strokeWeight(2);
  textSize(20);
  textAlign(LEFT, TOP);

  // Example positions
  let x = 20;
  let y = 20;
  let spacing = 30;

  // Draw background box for HUD
  fill(0, 150);
  noStroke();
  rect(x - 10, y - 10, 220, spacing * 5 + 20, 10);

  // Draw text with stroke for readability
  stroke(0);
  strokeWeight(2);
  fill(255);

  // Vehicle info
  text("Vehicle: " + (selectedVehicle || "Unknown"), x, y);

  // Stage info
  text("Stage: " + (selectedStage || "Unknown"), x, y + spacing);

  // Fuel (example static value)
  text("Fuel: 100%", x, y + spacing * 2);

  // Coin (example static value)
  text("Coins: 0", x, y + spacing * 3);

  // Diamond (example static value)
  text("Diamonds: 0", x, y + spacing * 4);
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function drawBrain() { //show the brain of whatever genome is currently showing
  var startX = 600; //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
  var startY = 10;
  var w = 600;
  var h = 300;

  if (runBest) {
    population.bestPlayer.brain.drawGenome(startX, startY, w, h);
  } else
  if (humanPlaying) {
    showBrain = false;
  } else if (showBestEachGen) {
    genPlayerTemp.brain.drawGenome(startX, startY, w, h);
  } else if (!fightMode) {
    currentBestPlayer.brain.drawGenome(startX, startY, w, h);
  }
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//writes info about the current player
function writeInfo() {
  fill(255);
  stroke(255);
  strokeWeight(1);
  textAlign(LEFT);
  textSize(30);
  if (showBestEachGen) {
    text("Score: " + genPlayerTemp.score, 50, 50); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    text("Gen: " + (genPlayerTemp.gen + 1), 50, 100);
  } else
  if (humanPlaying) {
    text("Score: " + humanPlayer.score, 100, 50); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    humanPlayer.look();
    // text("vision[0]: " + humanPlayer.vision[0], 100, 100);
    // text("vision[1]: " + humanPlayer.vision[1], 100, 150);
    // text("vision[2]: " + humanPlayer.vision[2], 100, 200);
    //
    // text("vision[3]: " + humanPlayer.vision[3], 100, 250);
    // text("vision[4]: " + humanPlayer.vision[4], 100, 300);
    // text("vision[5]: " + humanPlayer.vision[5], 100, 350);
    // text("vision[6]: " + humanPlayer.vision[6], 700, 100);
    // text("vision[7]: " + humanPlayer.vision[7], 700, 150);
    // text("vision[8]: " + humanPlayer.vision[8], 700, 200);
    // text("vision[9]: " + humanPlayer.vision[9], 700, 250);
    // text("vision[10]: " + humanPlayer.vision[10], 700, 300);
  } else
  if (runBest) {
    text("Score: " + population.bestPlayer.score, 650, 50); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    text("Gen: " + population.gen, 1150, 50);
  } else {
    if (showBest) {
      text("Score: " + population.players[0].score, 50, 50); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
      text("Gen: " + population.gen, 50, 100);
      // text("Species: " + population.species.length, 50, 150);
      // text("Global Best Score: " + population.globalBestScore, 50, 200);
    } else if (fightMode) {
      text("Your Score: " + humanPlayer.score, 100, 50);
      text("Enemy Score: " + population.bestPlayer.score, 850, 50);
    } else {
      text("Score: " + currentBestPlayer.score, 50, 50); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
      text("Gen: " + population.gen, 300, 50);

      // text("Species: " + population.species.length, 50, 150);
      // text("Global Best Score: " + population.globalBestScore, 50, 200);
      // text("Species: " + population.species.length, 50, canvas.height / 2 + 300);
      // text("Global Best Score: /" + max(population.bestScore, currentBestPlayer.score), 50, canvas.height / 2 + 200);
    }
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------------

function keyPressed() {
  switch (key) {
    case ' ':
      //toggle showBest
      showBest = !showBest;
      break;
      // case '+': //speed up frame rate
      //   speed += 10;
      //   frameRate(speed);
      //   prvarln(speed);
      //   break;
      // case '-': //slow down frame rate
      //   if(speed > 10) {
      //     speed -= 10;
      //     frameRate(speed);
      //     prvarln(speed);
      //   }
      //   break;
    case 'F':
      if (population.gen != 1) {

        fightMode = !fightMode;
        population.bestPlayer = population.bestPlayer.cloneForReplay();
        humanPlayer = humanPlayer.cloneForReplay();

        if (fightMode) {
          humanPlayer.addToWorld();
          population.bestPlayer.addToWorld();

        }
      }
      break;
    case 'B': //run the best
      if (population.gen != 1) {
        runBest = !runBest;
        population.bestPlayer = population.bestPlayer.cloneForReplay();
        if (runBest) {
          population.bestPlayer.addToWorld();
        }
      }
      break;
    case 'G': //show generations
      if (population.gen != 1) {
        showBestEachGen = !showBestEachGen;
        if (!showBestEachGen) {
          genPlayerTemp.removePlayerFromWorld();
        }
        upToGen = 0;
        genPlayerTemp = population.genPlayers[upToGen].cloneForReplay();
        if (showBestEachGen) {
          genPlayerTemp.addToWorld();

        }
      }
      break;
    case 'N': //show absolutely nothing in order to speed up computation
      showNothing = !showNothing;
      break;
    case 'P': //play
      humanPlaying = !humanPlaying;
      if (humanPlaying) {
        humanPlayer = humanPlayer.cloneForReplay();
        humanPlayer.addToWorld();
      }

      break;


    case 'S':
      pause = !pause;
      break;
  }
  //any of the arrow keys
  switch (keyCode) {
    case UP_ARROW: //the only time up/ down / left is used is to control the player
      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
      break;
    case DOWN_ARROW:
      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
      break;
    case LEFT_ARROW:
      leftDown = true;
      humanPlayer.car.motorOn(false);
      break;
    case RIGHT_ARROW: //right is used to move through the generations
      if (showBestEachGen) { //if showing the best player each generation then move on to the next generation
        upToGen++;
        if (upToGen >= population.genPlayers.length) { //if reached the current generation then exit out of the showing generations mode
          showBestEachGen = false;
        } else {
          genPlayerTemp = population.genPlayers[upToGen].cloneForReplay();
          genPlayerTemp.addToWorld();

        }
      } else if (humanPlaying || fightMode) { //if the user is playing then move player right
        rightDown = true;
        humanPlayer.car.motorOn(true);
        break;
        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
      }
      break;
  }
}

function keyReleased() {
  if (humanPlaying || fightMode) {
    switch (keyCode) {
      case RIGHT_ARROW:
        rightDown = false;
        if (leftDown) {
          humanPlayer.car.motorOn(false);
        } else {
          humanPlayer.car.motorOff();
        }
        break;
      case LEFT_ARROW:
        leftDown = false;
        if (rightDown) {
          humanPlayer.car.motorOn(true);
        } else {
          humanPlayer.car.motorOff();
        }
        break;
    }
  }
}

function clearWorlds() {
  for (var i = 0; i < playersInEachWorld.length; i++) {
    playersInEachWorld[i] = 0;
  }
}

function getFreeWorld() {
  for (var i = 0; i < playersInEachWorld.length; i++) {
    if (playersInEachWorld[i] < playersPerWorld) {
      playersInEachWorld[i]++;
      return (worlds[i]);
    }
  }

  return (worlds[0]);
}

function newWorlds() {
  console.log("New WOrld");
  console.log(groundTemplate.vectors);
  groundTemplate = new Ground();
  groundTemplate.randomizeGround();


  while (groundTemplate.isTooSteep()) {
    groundTemplate = new Ground();
    groundTemplate.randomizeGround();
  }
  console.log(groundTemplate.vectors);

  grounds = [];
  worlds = [];
  playersInEachWorld = [];
  for (var i = 0; i < numberOfWorlds; i++) {
    let tempWorld = new b2World(new Vec2(0, 10), true);
    let tempGround = new Ground(tempWorld);
    tempGround.cloneFrom(groundTemplate);
    tempGround.setBodies(tempWorld);
    tempWorld.SetContactListener(listener);
    // tempWorld.SetContactListener(listener2);

    grounds.push(tempGround);
    worlds.push(tempWorld);
    playersInEachWorld.push(0);
  }

  otherWorld = new b2World(new Vec2(0, 10), true);
  let tempGround = new Ground(otherWorld);
  tempGround.cloneFrom(groundTemplate);
  tempGround.setBodies(otherWorld);
  otherWorld.SetContactListener(listener);

  population.bestScore = 0; //the score of the best ever player
  population.globalBestScore = 0;


  //
  // ground = new Ground(world);
  // ground.cloneFrom(groundTemplate);
  // ground.setBodies(world); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
  // world.SetContactListener(listener);
}
