// Menu system for vehicle, character, and stage selection with loading section

import { VEHICLE_LIST } from './VehicleList.js';
import { PLAYER_LIST } from './Player.js';
import { STAGE_LIST } from './Stage.js';

class Menu {
  constructor() {
    this.selectedVehicleIndex = 0;
    this.selectedPlayerIndex = 0;
    this.selectedStageIndex = 0;
    this.loading = false;
    this.coins = 0; // Player's coins for unlocking vehicles and stages
    this.diamonds = 0; // Player's diamonds for unlocking characters

    this.initUI();
  }

  initUI() {
    // Create container for menu
    this.menuContainer = document.createElement('div');
    this.menuContainer.id = 'menuContainer';
    document.body.appendChild(this.menuContainer);

    // Loading section
    this.loadingSection = document.createElement('div');
    this.loadingSection.id = 'loadingSection';
    this.loadingSection.textContent = 'Loading... Please wait.';
    this.menuContainer.appendChild(this.loadingSection);

    // Vehicle selection
    this.vehicleSelect = document.createElement('select');
    this.vehicleSelect.id = 'vehicleSelect';
    this.menuContainer.appendChild(this.createLabel('Select Vehicle:', this.vehicleSelect));
    this.populateSelect(this.vehicleSelect, VEHICLE_LIST, this.selectedVehicleIndex);
    this.vehicleSelect.value = this.selectedVehicleIndex;
    this.vehicleSelect.addEventListener('change', (e) => {
      this.selectedVehicleIndex = Number(e.target.value) || 0;
      this.updateUnlockStatus();
    });

    // Player selection
    this.playerSelect = document.createElement('select');
    this.playerSelect.id = 'playerSelect';
    this.menuContainer.appendChild(this.createLabel('Select Character:', this.playerSelect));
    this.populateSelect(this.playerSelect, PLAYER_LIST, this.selectedPlayerIndex);
    this.playerSelect.value = this.selectedPlayerIndex;
    this.playerSelect.addEventListener('change', (e) => {
      this.selectedPlayerIndex = Number(e.target.value) || 0;
      this.updateUnlockStatus();
    });

    // Stage selection
    this.stageSelect = document.createElement('select');
    this.stageSelect.id = 'stageSelect';
    this.menuContainer.appendChild(this.createLabel('Select Stage:', this.stageSelect));
    this.populateSelect(this.stageSelect, STAGE_LIST, this.selectedStageIndex);
    this.stageSelect.value = this.selectedStageIndex;
    this.stageSelect.addEventListener('change', (e) => {
      this.selectedStageIndex = Number(e.target.value) || 0;
      this.updateUnlockStatus();
    });

    // Unlock info display
    this.unlockInfo = document.createElement('div');
    this.unlockInfo.id = 'unlockInfo';
    this.menuContainer.appendChild(this.unlockInfo);

    // Start button
    this.startButton = document.createElement('button');
    this.startButton.textContent = 'Start Game';
    this.startButton.addEventListener('click', () => this.startGame());
    this.menuContainer.appendChild(this.startButton);

    this.showLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      this.showLoading(false);
      this.updateUnlockStatus();
    }, 2000);
  }

  createLabel(text, forElement) {
    const label = document.createElement('label');
    label.textContent = text;
    label.htmlFor = forElement.id;
    return label;
  }

  populateSelect(selectElem, list) {
    selectElem.innerHTML = '';
    list.forEach((item, index) => {
      const option = document.createElement('option');
      option.value = index;
      let costText = '';
      if (list === PLAYER_LIST) {
        costText = item.unlockCost ? ` (Unlock: ${item.unlockCost} diamonds)` : '';
        option.disabled = item.unlockCost > this.diamonds;
      } else {
        costText = item.unlockCost ? ` (Unlock: ${item.unlockCost} coins)` : '';
        option.disabled = item.unlockCost > this.coins;
      }
      option.textContent = item.name + costText;
      if (item.status === 'Locked' || item.status === 'Bonus Locked' || item.status === 'Hidden Bonus') {
        option.disabled = true;
      }
      selectElem.appendChild(option);
    });
  }

  updateUnlockStatus() {
    const vehicle = VEHICLE_LIST[this.selectedVehicleIndex];
    const player = PLAYER_LIST[this.selectedPlayerIndex];
    const stage = STAGE_LIST[this.selectedStageIndex];

    let unlockMessages = [];

    if (vehicle.unlockCost && vehicle.unlockCost > this.coins) {
      unlockMessages.push(`Vehicle "${vehicle.name}" is locked. Requires ${vehicle.unlockCost} coins.`);
    }
    if (player.unlockCost && player.unlockCost > this.diamonds) {
      unlockMessages.push(`Character "${player.name}" is locked. Requires ${player.unlockCost} diamonds.`);
    }
    if (stage.unlockCost && stage.unlockCost > this.coins) {
      unlockMessages.push(`Stage "${stage.name}" is locked. Requires ${stage.unlockCost} coins.`);
    }

    this.unlockInfo.textContent = unlockMessages.join(' ') || 'All selections unlocked.';

    // Optionally, update select disabled state
    this.populateSelect(this.vehicleSelect, VEHICLE_LIST, this.selectedVehicleIndex);
    this.vehicleSelect.value = this.selectedVehicleIndex;
    this.populateSelect(this.playerSelect, PLAYER_LIST, this.selectedPlayerIndex);
    this.playerSelect.value = this.selectedPlayerIndex;
    this.populateSelect(this.stageSelect, STAGE_LIST, this.selectedStageIndex);
    this.stageSelect.value = this.selectedStageIndex;
  }

  startGame() {
    const vehicle = VEHICLE_LIST[this.selectedVehicleIndex];
    const player = PLAYER_LIST[this.selectedPlayerIndex];
    const stage = STAGE_LIST[this.selectedStageIndex];

    if ((vehicle.unlockCost && vehicle.unlockCost > this.coins) ||
        (player.unlockCost && player.unlockCost > this.diamonds) ||
        (stage.unlockCost && stage.unlockCost > this.coins)) {
      alert('Please unlock all selections before starting the game.');
      return;
    }

    this.menuContainer.style.display = 'none';
    // Trigger game start event or callback here
    console.log(`Game started with Vehicle: ${vehicle.name}, Character: ${player.name}, Stage: ${stage.name}`);
  }

  showLoading(show) {
    this.loadingSection.style.display = show ? 'block' : 'none';
  }
}

export default Menu;
