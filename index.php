<?php
// Include PHP data arrays if needed
include_once 'game_data.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nepali Racer</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
   <div id="loadingscreen" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:#000;display:flex;align-items:center;justify-content:center;z-index:9999;color:#fff;font-size:2em;">
     Loading...
   </div>
   <!-- Preload main menu preview for vehicle, stage, and character -->
   <div id="mainmenuPreview" style="display:none;">
     <div class="menu-section">
       <h2 style="font-size:1.2em;margin-bottom:8px;">Vehicle</h2>
       <div id="mainmenuVehicle" style="display:flex;align-items:center;gap:12px;justify-content:center;margin-bottom:8px;">
         <img src="Pics/car.png" alt="Car" id="mainVehicleImg" style="width:48px;height:28px;object-fit:contain;">
         <span id="mainVehicleName">Car</span>
         <button id="selectVehicle" style="padding:4px 12px;font-size:0.95em;">Change</button>
       </div>
     </div>
     <div class="menu-section">
       <h2 style="font-size:1.2em;margin-bottom:8px;">Stage</h2>
       <div id="mainmenuStage" style="display:flex;align-items:center;gap:12px;justify-content:center;margin-bottom:8px;">
         <img src="Pics/sky.png" alt="Sky" id="mainStageImg" style="width:60px;height:36px;object-fit:cover;border-radius:6px;">
         <span id="mainStageName">Sky</span>
         <button id="selectStage" style="padding:4px 12px;font-size:0.95em;">Change</button>
       </div>
     </div>
     <div class="menu-section">
       <h2 style="font-size:1.2em;margin-bottom:8px;">Character</h2>
       <div id="mainmenuCharacter" style="display:flex;align-items:center;gap:12px;justify-content:center;margin-bottom:8px;cursor:pointer;">
         <span id="mainCharacterName">Chhetri</span>
         <button id="selectCharacter" style="padding:4px 12px;font-size:0.95em;">Change</button>
       </div>
     </div>
   </div>
   <div id="game-container" style="width:1280px; height:720px; position:relative;">
     <canvas id="gamecanvas" width="1280" height="720"></canvas>
   </div>
   <div id="mainmenu" style="display:none;">
    <h1>Nepali Racer</h1>
    <!-- Insert preview sections before Start Game -->
    <div id="mainmenuPreviewContainer"></div>
  <button id="startgame">Start Game</button>
  <script type="module">
  document.getElementById('startgame').addEventListener('click', function() {
    // Hide main menu
    document.getElementById('mainmenu').style.display = 'none';
    // Hide other modals if any
    document.getElementById('vehicleSelect').style.display = 'none';
    document.getElementById('stageSelect').style.display = 'none';
    document.getElementById('ethnicModal').style.display = 'none';
    // Start the game by calling the startGame function
    if (typeof startGame === 'function') {
      startGame();
    }
  });

  // Dynamically render vehicle and stage cards
  import VEHICLE_LIST from './VehicleList.js';
  import STAGE_LIST from './Stage.js';

  function createVehicleCard(vehicle) {
    const card = document.createElement('div');
    card.className = 'vehicle-card';
    card.setAttribute('data-vehicle', vehicle.name.toLowerCase().replace(/\s+/g, '-'));
    card.innerHTML = `
      <img src="Pics/${vehicle.name.toLowerCase().replace(/\s+/g, '')}.png" alt="${vehicle.name}" style="width:80px;height:48px;object-fit:contain;" onerror="this.onerror=null;this.src='Pics/car.png';">
      <div>${vehicle.name}</div>
    `;
    return card;
  }

  function createStageCard(stage) {
    const card = document.createElement('div');
    card.className = 'stage-card';
    card.setAttribute('data-stage', stage.name.toLowerCase().replace(/\s+/g, '-'));
    card.innerHTML = `
      <img src="Pics/${stage.name.toLowerCase().replace(/\s+/g, '')}.png" alt="${stage.name}" style="width:100px;height:60px;object-fit:cover;border-radius:8px;" onerror="this.onerror=null;this.src='Pics/sky.png';">
      <div>${stage.name}</div>
    `;
    return card;
  }

  function renderVehicleList() {
    const vehicleListContainer = document.getElementById('vehicleList');
    vehicleListContainer.innerHTML = '';
    VEHICLE_LIST.forEach(vehicle => {
      const card = createVehicleCard(vehicle);
      vehicleListContainer.appendChild(card);
    });
  }

  function renderStageList() {
    const stageListContainer = document.getElementById('stageList');
    stageListContainer.innerHTML = '';
    STAGE_LIST.forEach(stage => {
      const card = createStageCard(stage);
      stageListContainer.appendChild(card);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderVehicleList();
    renderStageList();

    // Add event listeners for dynamically created cards
    document.getElementById('vehicleList').addEventListener('click', (e) => {
      const card = e.target.closest('.vehicle-card');
      if (!card) return;
      document.querySelectorAll('.vehicle-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedVehicle = card.getAttribute('data-vehicle');
    });

    document.getElementById('stageList').addEventListener('click', (e) => {
      const card = e.target.closest('.stage-card');
      if (!card) return;
      document.querySelectorAll('.stage-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedStage = card.getAttribute('data-stage');
    });
  });
  </script>
    <button id="exit">Exit</button>
   </div>
   <div id="gameover" style="display:none;">
    <h1>Game Over</h1>
    <p>Your Score: <span id="finalscore"></span></p>
    <button id="restart">Restart</button>
    <button id="mainmenuBtn">Main Menu</button>
   </div>
   <!-- Ethnic Group Selection Modal -->
   <div id="ethnicModal" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);z-index:2000;align-items:center;justify-content:center;">
     <div style="background:#fff;padding:32px 24px;border-radius:12px;max-width:400px;width:90%;margin:auto;text-align:center;">
       <h2>Select Your Ethnic Group</h2>
       <select id="ethnicSelect" style="width:100%;padding:8px;font-size:1.1em;">
         <option value="">-- Choose Ethnic Group --</option>
         <option>Chhetri</option>
         <option>Bahun</option>
         <option>Magar</option>
         <option>Tharu</option>
         <option>Tamang</option>
         <option>Newar</option>
         <option>Rai</option>
         <option>Gurung</option>
         <option>Limbu</option>
         <option>Thakuri</option>
         <!-- Add all 126 ethnic groups here -->
       </select>
       <button id="ethnicConfirm" style="margin-top:16px;padding:8px 24px;font-size:1.1em;">Confirm</button>
       <button id="ethnicBack" style="margin-top:8px;padding:6px 18px;font-size:1em;">Back</button>
     </div>
   </div>
   <!-- Vehicle Selection -->
   <div id="vehicleSelect" style="display:none;text-align:center;margin:32px 0;">
     <h2>Select Your Vehicle</h2>
     <div id="vehicleList" style="display:flex;overflow-x:auto;gap:24px;justify-content:center;padding:16px 0;">
       <!-- Vehicle cards will be dynamically inserted here -->
     </div>
     <button id="vehicleConfirm" style="margin-top:12px;padding:8px 24px;font-size:1.1em;">Select Vehicle</button>
     <button id="vehicleBack" style="margin-top:8px;padding:6px 18px;font-size:1em;">Back</button>
   </div>
   <!-- Stage Selection -->
   <div id="stageSelect" style="display:none;text-align:center;margin:32px 0;">
     <h2>Select Stage</h2>
     <div id="stageList" style="display:flex;overflow-x:auto;gap:24px;justify-content:center;padding:16px 0;">
       <!-- Stage cards will be dynamically inserted here -->
     </div>
     <button id="stageConfirm" style="margin-top:12px;padding:8px 24px;font-size:1.1em;">Select Stage</button>
     <button id="stageBack" style="margin-top:8px;padding:6px 18px;font-size:1em;">Back</button>
   </div>
   <script src="script.js"></script>
   <script>
window.onload = function() {
  // Hide loading screen after window load
  document.getElementById('loadingscreen').style.display = 'none';
  // Only show ethnic group modal on first load, then show main menu after confirm
  document.getElementById('mainmenu').style.display = 'none';
  document.getElementById('vehicleSelect').style.display = 'none';
  document.getElementById('stageSelect').style.display = 'none';
  document.getElementById('ethnicModal').style.display = 'flex';
};

document.addEventListener('DOMContentLoaded', function() {
  // Insert preview sections into main menu before showing
  var preview = document.getElementById('mainmenuPreview').innerHTML;
  document.getElementById('mainmenuPreviewContainer').innerHTML = preview;

  // Now that preview is injected, assign event listeners for clickable sections
  document.getElementById('mainmenuVehicle').onclick = function() {
    document.getElementById('mainmenu').style.display = 'none';
    document.getElementById('vehicleSelect').style.display = 'block';
  };
  document.getElementById('mainmenuStage').onclick = function() {
    document.getElementById('mainmenu').style.display = 'none';
    document.getElementById('stageSelect').style.display = 'block';
  };
  document.getElementById('mainmenuCharacter').onclick = function() {
    document.getElementById('mainmenu').style.display = 'none';
    document.getElementById('ethnicModal').style.display = 'flex';
  };

  // Ethnic group modal confirm
  document.getElementById('ethnicConfirm').onclick = function() {
    var val = document.getElementById('ethnicSelect').value;
    if (!val) { alert('Please select your ethnic group!'); return; }
    document.getElementById('ethnicModal').style.display = 'none';
    document.getElementById('mainmenu').style.display = 'block';
  };
  // Vehicle selection
  let selectedVehicle = 'car';
  let vehicleData = {
    car: { name: 'Car', img: 'Pics/car.png' },
    wheel: { name: 'Wheel', img: 'Pics/wheel.png' }
  };
  document.querySelectorAll('.vehicle-card').forEach(card => {
    card.onclick = function() {
      document.querySelectorAll('.vehicle-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedVehicle = card.getAttribute('data-vehicle');
    };
  });
  document.getElementById('vehicleConfirm').onclick = function() {
    document.getElementById('vehicleSelect').style.display = 'none';
    document.getElementById('mainmenu').style.display = 'block';
    updateMainMenuVehicle(vehicleData[selectedVehicle].name, vehicleData[selectedVehicle].img);
  };
  document.getElementById('selectVehicle').onclick = function() {
    document.getElementById('mainmenu').style.display = 'none';
    document.getElementById('vehicleSelect').style.display = 'block';
  };
  // Stage selection
  let selectedStage = 'sky';
  let stageData = {
    sky: { name: 'Sky', img: 'Pics/sky.png' },
    grass: { name: 'Grass', img: 'Pics/grass.png' }
  };
  document.querySelectorAll('.stage-card').forEach(card => {
    card.onclick = function() {
      document.querySelectorAll('.stage-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedStage = card.getAttribute('data-stage');
    };
  });
  document.getElementById('stageConfirm').onclick = function() {
    document.getElementById('stageSelect').style.display = 'none';
    document.getElementById('mainmenu').style.display = 'block';
    updateMainMenuStage(stageData[selectedStage].name, stageData[selectedStage].img);
  };
  document.getElementById('selectStage').onclick = function() {
    document.getElementById('mainmenu').style.display = 'none';
    document.getElementById('stageSelect').style.display = 'block';
  };
  // Add back buttons to each selection screen
  document.getElementById('ethnicBack').onclick = function() {
    document.getElementById('ethnicModal').style.display = 'none';
    document.getElementById('mainmenu').style.display = 'block';
  };
  document.getElementById('vehicleBack').onclick = function() {
    document.getElementById('vehicleSelect').style.display = 'none';
    document.getElementById('mainmenu').style.display = 'block';
  };
  document.getElementById('stageBack').onclick = function() {
    document.getElementById('stageSelect').style.display = 'none';
    document.getElementById('mainmenu').style.display = 'block';
  };
});
// Update main menu vehicle/stage preview on selection
function updateMainMenuVehicle(name, img) {
  document.getElementById('mainVehicleName').textContent = name;
  document.getElementById('mainVehicleImg').src = img;
}
function updateMainMenuStage(name, img) {
  document.getElementById('mainStageName').textContent = name;
  document.getElementById('mainStageImg').src = img;
}
// --- Simple Playstore-like Game Demo ---
function startGame() {
  var canvas = document.getElementById('gamecanvas');
  var ctx = canvas.getContext('2d');
  var car = { x: 100, y: 300, w: 60, h: 30, speed: 0 };
  var roadY = 340;
  var keys = { left: false, right: false };
  var running = true;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw road
    ctx.fillStyle = '#444';
    ctx.fillRect(0, roadY, canvas.width, 40);
    // Draw car
    ctx.save();
    ctx.fillStyle = '#ff9800';
    ctx.fillRect(car.x, car.y, car.w, car.h);
    ctx.restore();
    // Draw simple UI
    ctx.font = '20px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Tap ← or → to move', 10, 30);
  }
  function update() {
    if (keys.left) car.x -= 5;
    if (keys.right) car.x += 5;
    car.x = Math.max(0, Math.min(canvas.width - car.w, car.x));
  }
  function loop() {
    if (!running) return;
    update();
    draw();
    requestAnimationFrame(loop);
  }
  // Keyboard controls (for desktop)
  window.onkeydown = function(e) {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
  };
  window.onkeyup = function(e) {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
  };
  // Touch controls (for mobile)
  canvas.addEventListener('touchstart', function(e) {
    var touch = e.touches[0];
    if (touch.clientX < canvas.width/2) keys.left = true;
    else keys.right = true;
  });
  canvas.addEventListener('touchend', function(e) {
    keys.left = false;
    keys.right = false;
  });
  loop();
}
// --- Ethnic group, vehicle, and stage selection logic ---
window.addEventListener('DOMContentLoaded', function() {
  // Insert preview sections into main menu before showing
  var preview = document.getElementById('mainmenuPreview').innerHTML;
  document.getElementById('mainmenuPreviewContainer').innerHTML = preview;

  // Now that preview is injected, assign event listeners for clickable sections
  document.getElementById('mainmenuVehicle').onclick = function() {
    document.getElementById('mainmenu').style.display = 'none';
    document.getElementById('vehicleSelect').style.display = 'block';
  };
  document.getElementById('mainmenuStage').onclick = function() {
    document.getElementById('mainmenu').style.display = 'none';
    document.getElementById('stageSelect').style.display = 'block';
  };
  document.getElementById('mainmenuCharacter').onclick = function() {
    document.getElementById('mainmenu').style.display = 'none';
    document.getElementById('ethnicModal').style.display = 'flex';
  };

  // Show ethnic group modal first
  document.getElementById('ethnicModal').style.display = 'flex';
  document.getElementById('mainmenu').style.display = 'none';
  document.getElementById('vehicleSelect').style.display = 'none';
  document.getElementById('stageSelect').style.display = 'none';
  document.getElementById('ethnicConfirm').onclick = function() {
    var val = document.getElementById('ethnicSelect').value;
    if (!val) { alert('Please select your ethnic group!'); return; }
    document.getElementById('ethnicModal').style.display = 'none';
    document.getElementById('vehicleSelect').style.display = 'block';
  };
  // Vehicle selection
  document.querySelectorAll('.vehicle-card').forEach(card => {
    card.onclick = function() {
      document.querySelectorAll('.vehicle-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedVehicle = card.getAttribute('data-vehicle');
    };
  });
  document.getElementById('vehicleConfirm').onclick = function() {
    document.getElementById('vehicleSelect').style.display = 'none';
    document.getElementById('mainmenu').style.display = 'block';
    updateMainMenuVehicle(vehicleData[selectedVehicle].name, vehicleData[selectedVehicle].img);
  };
  document.getElementById('selectVehicle').onclick = function() {
    document.getElementById('mainmenu').style.display = 'none';
    document.getElementById('vehicleSelect').style.display = 'block';
  };
  // Stage selection
  document.querySelectorAll('.stage-card').forEach(card => {
    card.onclick = function() {
      document.querySelectorAll('.stage-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedStage = card.getAttribute('data-stage');
    };
  });
  document.getElementById('stageConfirm').onclick = function() {
    document.getElementById('stageSelect').style.display = 'none';
    document.getElementById('mainmenu').style.display = 'block';
    updateMainMenuStage(stageData[selectedStage].name, stageData[selectedStage].img);
  };
  document.getElementById('selectStage').onclick = function() {
    document.getElementById('mainmenu').style.display = 'none';
    document.getElementById('stageSelect').style.display = 'block';
  };
  /*
  // Move selection screens to open from main menu buttons
  document.getElementById('selectVehicleBtn').onclick = function() {
    document.getElementById('mainmenu').style.display = 'none';
    document.getElementById('vehicleSelect').style.display = 'block';
  };
  document.getElementById('selectStageBtn').onclick = function() {
    document.getElementById('mainmenu').style.display = 'none';
    document.getElementById('stageSelect').style.display = 'block';
  };
  document.getElementById('selectEthnicBtn').onclick = function() {
    document.getElementById('mainmenu').style.display = 'none';
    document.getElementById('ethnicModal').style.display = 'flex';
  };
  // Add back buttons to each selection screen
  document.getElementById('backToMenuBtn').onclick = function() {
    document.getElementById('ethnicModal').style.display = 'none';
    document.getElementById('vehicleSelect').style.display = 'none';
    document.getElementById('stageSelect').style.display = 'none';
    document.getElementById('mainmenu').style.display = 'block';
  };
  */
  // Make mainmenuVehicle, mainmenuStage, and mainmenuCharacter clickable to open their selection modals
  document.getElementById('mainmenuVehicle').onclick = function() {
    document.getElementById('mainmenu').style.display = 'none';
    document.getElementById('vehicleSelect').style.display = 'block';
  };
  document.getElementById('mainmenuStage').onclick = function() {
    document.getElementById('mainmenu').style.display = 'none';
    document.getElementById('stageSelect').style.display = 'block';
  };
  document.getElementById('mainmenuCharacter').onclick = function() {
    document.getElementById('mainmenu').style.display = 'none';
    document.getElementById('ethnicModal').style.display = 'flex';
  };
});
// Add menu navigation for selection buttons
// Show modals from main menu
['selectCharacter','selectVehicle','selectStage'].forEach(function(btnId) {
  document.getElementById(btnId).onclick = function() {
    document.getElementById('mainmenu').style.display = 'none';
    if(btnId==='selectCharacter') document.getElementById('ethnicModal').style.display = 'flex';
    if(btnId==='selectVehicle') document.getElementById('vehicleSelect').style.display = 'block';
    if(btnId==='selectStage') document.getElementById('stageSelect').style.display = 'block';
  };
});
// Add back buttons for each selection screen
['ethnicBack','vehicleBack','stageBack'].forEach(function(btnId) {
  document.getElementById(btnId).onclick = function() {
    document.getElementById('ethnicModal').style.display = 'none';
    document.getElementById('vehicleSelect').style.display = 'none';
    document.getElementById('stageSelect').style.display = 'none';
    document.getElementById('mainmenu').style.display = 'block';
  };
});
// Update main menu vehicle/stage preview on selection
function updateMainMenuVehicle(name, img) {
  document.getElementById('mainVehicleName').textContent = name;
  document.getElementById('mainVehicleImg').src = img;
}
function updateMainMenuStage(name, img) {
  document.getElementById('mainStageName').textContent = name;
  document.getElementById('mainStageImg').src = img;
}
// Vehicle selection logic
let selectedVehicle = 'car';
let vehicleData = {
  car: { name: 'Car', img: 'Pics/car.png' },
  rickshaw: { name: 'Rickshaw', img: 'Pics/rickshaw.png' },
  bike: { name: 'Bike', img: 'Pics/bike.png' }
};
// Stage selection logic
let selectedStage = 'mountain';
let stageData = {
  mountain: { name: 'Mountain', img: 'Pics/mountain.png' },
  highway: { name: 'Highway', img: 'Pics/highway.png' },
  city: { name: 'City', img: 'Pics/city.png' }
};
</script>
</body>
</html>