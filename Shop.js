// Shop and Upgrade System for Nepali Racer
// Handles purchasing vehicles, stages, characters, upgrades, and power-ups

class Shop {
  constructor(gameState) {
    this.gameState = gameState;
    this.currentTab = 'vehicles'; // 'vehicles', 'stages', 'characters', 'upgrades', 'powerups'
    this.selectedIndex = 0;
    
    this.upgradeDescriptions = {
      speed: 'Increases vehicle maximum speed and acceleration',
      suspension: 'Improves vehicle stability on rough terrain', 
      fuel: 'Reduces fuel consumption rate',
      grip: 'Better tire grip for climbing hills'
    };
    
    this.upgradeCosts = {
      speed: [100, 200, 350, 550, 800, 1100, 1450, 1850, 2300, 2800],
      suspension: [120, 240, 400, 600, 850, 1150, 1500, 1900, 2350, 2850],
      fuel: [80, 160, 280, 440, 640, 880, 1160, 1480, 1840, 2240],
      grip: [90, 180, 310, 480, 690, 940, 1230, 1560, 1930, 2340]
    };
    
    this.powerUpPrices = {
      nitro: 50,
      shield: 75,
      magnet: 60,
      fuelBoost: 40
    };
    
    this.init();
  }
  
  init() {
    this.createShopUI();
    this.updateDisplay();
  }
  
  createShopUI() {
    // Create shop container
    this.shopContainer = document.createElement('div');
    this.shopContainer.id = 'shopContainer';
    this.shopContainer.className = 'shop-container';
    this.shopContainer.style.display = 'none';
    document.body.appendChild(this.shopContainer);
    
    // Shop header
    const header = document.createElement('div');
    header.className = 'shop-header';
    header.innerHTML = `
      <h2 id="shopTitle">${translate('shop')}</h2>
      <div class="currency-display">
        <span class="coins">🪙 <span id="shopCoins">${this.gameState.coins}</span></span>
        <span class="diamonds">💎 <span id="shopDiamonds">${this.gameState.diamonds}</span></span>
      </div>
    `;
    this.shopContainer.appendChild(header);
    
    // Tab navigation
    const tabNav = document.createElement('div');
    tabNav.className = 'tab-navigation';
    const tabs = [
      { id: 'vehicles', icon: '🚗', label: translate('vehicles') },
      { id: 'stages', icon: '🏔️', label: translate('stages') },
      { id: 'characters', icon: '👤', label: translate('characters') },
      { id: 'upgrades', icon: '⚙️', label: translate('upgrades') },
      { id: 'powerups', icon: '⚡', label: 'Power-ups' }
    ];
    
    tabs.forEach(tab => {
      const tabButton = document.createElement('button');
      tabButton.className = `tab-button ${tab.id === this.currentTab ? 'active' : ''}`;
      tabButton.innerHTML = `${tab.icon}<br>${tab.label}`;
      tabButton.onclick = () => this.switchTab(tab.id);
      tabNav.appendChild(tabButton);
    });
    this.shopContainer.appendChild(tabNav);
    
    // Content area
    this.contentArea = document.createElement('div');
    this.contentArea.className = 'shop-content';
    this.shopContainer.appendChild(this.contentArea);
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => this.hide();
    this.shopContainer.appendChild(closeButton);
  }
  
  switchTab(tabId) {
    this.currentTab = tabId;
    this.selectedIndex = 0;
    
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tab-button:nth-child(${['vehicles', 'stages', 'characters', 'upgrades', 'powerups'].indexOf(tabId) + 1})`).classList.add('active');
    
    this.updateDisplay();
  }
  
  updateDisplay() {
    this.updateCurrency();
    
    switch(this.currentTab) {
      case 'vehicles':
        this.displayVehicles();
        break;
      case 'stages':
        this.displayStages();
        break;
      case 'characters':
        this.displayCharacters();
        break;
      case 'upgrades':
        this.displayUpgrades();
        break;
      case 'powerups':
        this.displayPowerUps();
        break;
    }
  }
  
  updateCurrency() {
    const coinsElement = document.getElementById('shopCoins');
    const diamondsElement = document.getElementById('shopDiamonds');
    if (coinsElement) coinsElement.textContent = this.gameState.coins;
    if (diamondsElement) diamondsElement.textContent = this.gameState.diamonds;
  }
  
  displayVehicles() {
    if (typeof VEHICLE_LIST === 'undefined') return;
    
    let html = '<div class="items-grid">';
    
    VEHICLE_LIST.forEach((vehicle, index) => {
      const isOwned = this.gameState.unlockedVehicles.includes(index);
      const isSelected = this.gameState.selectedVehicle === index;
      const canAfford = vehicle.unlockCost <= this.gameState.coins;
      
      html += `
        <div class="item-card ${isSelected ? 'selected' : ''} ${isOwned ? 'owned' : ''}">
          <div class="item-icon">🚗</div>
          <div class="item-name">${vehicle.name}</div>
          <div class="item-type">${translate(vehicle.type.toLowerCase().replace(/ /g, ''))}</div>
          <div class="item-stats">
            <span>Speed: ${vehicle.speed}/10</span>
            <span>Grip: ${vehicle.grip}/10</span>
            <span>Fuel: ${vehicle.fuelEfficiency}/10</span>
          </div>
          <div class="item-action">
            ${isOwned ? (isSelected ? translate('owned') : `<button onclick="shop.selectVehicle(${index})">${translate('select')}</button>`) : 
              `<button onclick="shop.buyVehicle(${index})" ${!canAfford ? 'disabled' : ''}>🪙 ${vehicle.unlockCost}</button>`}
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    this.contentArea.innerHTML = html;
  }
  
  displayStages() {
    if (typeof STAGE_LIST === 'undefined') return;
    
    let html = '<div class="items-grid">';
    
    STAGE_LIST.forEach((stage, index) => {
      const isOwned = this.gameState.unlockedStages.includes(index);
      const isSelected = this.gameState.selectedStage === index;
      const canAfford = stage.unlockCost <= this.gameState.coins;
      
      html += `
        <div class="item-card ${isSelected ? 'selected' : ''} ${isOwned ? 'owned' : ''}">
          <div class="item-icon">🏔️</div>
          <div class="item-name">${stage.name}</div>
          <div class="item-type">${translate(stage.type.toLowerCase().replace(/ /g, ''))}</div>
          <div class="item-stats">
            <span>${translate('levels')}: ${stage.levels}</span>
          </div>
          <div class="item-action">
            ${isOwned ? (isSelected ? translate('owned') : `<button onclick="shop.selectStage(${index})">${translate('select')}</button>`) : 
              `<button onclick="shop.buyStage(${index})" ${!canAfford ? 'disabled' : ''}>🪙 ${stage.unlockCost}</button>`}
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    this.contentArea.innerHTML = html;
  }
  
  displayCharacters() {
    if (typeof PLAYER_LIST === 'undefined') return;
    
    let html = '<div class="items-grid">';
    
    PLAYER_LIST.forEach((character, index) => {
      const isOwned = this.gameState.unlockedCharacters.includes(index);
      const isSelected = this.gameState.selectedCharacter === index;
      const canAfford = character.unlockCost <= this.gameState.diamonds;
      
      html += `
        <div class="item-card ${isSelected ? 'selected' : ''} ${isOwned ? 'owned' : ''}">
          <div class="item-icon">${character.avatar}</div>
          <div class="item-name">${character.name}</div>
          <div class="item-stats">
            <span style="color: ${character.color}">●</span>
          </div>
          <div class="item-action">
            ${isOwned ? (isSelected ? translate('owned') : `<button onclick="shop.selectCharacter(${index})">${translate('select')}</button>`) : 
              `<button onclick="shop.buyCharacter(${index})" ${!canAfford ? 'disabled' : ''}>💎 ${character.unlockCost}</button>`}
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    this.contentArea.innerHTML = html;
  }
  
  displayUpgrades() {
    let html = '<div class="upgrades-list">';
    
    Object.keys(this.gameState.upgrades).forEach(upgrade => {
      const currentLevel = this.gameState.upgrades[upgrade];
      const isMaxLevel = currentLevel >= 10;
      const cost = isMaxLevel ? 0 : this.upgradeCosts[upgrade][currentLevel];
      const canAfford = this.gameState.coins >= cost;
      
      html += `
        <div class="upgrade-card">
          <div class="upgrade-info">
            <div class="upgrade-name">${translate(upgrade + 'Upgrade')}</div>
            <div class="upgrade-description">${this.upgradeDescriptions[upgrade]}</div>
            <div class="upgrade-level">${translate('level')}: ${currentLevel}/10</div>
            <div class="upgrade-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${(currentLevel / 10) * 100}%"></div>
              </div>
            </div>
          </div>
          <div class="upgrade-action">
            ${isMaxLevel ? `<span class="max-level">${translate('maxLevel')}</span>` : 
              `<button onclick="shop.buyUpgrade('${upgrade}')" ${!canAfford ? 'disabled' : ''}>🪙 ${cost}</button>`}
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    this.contentArea.innerHTML = html;
  }
  
  displayPowerUps() {
    let html = '<div class="powerups-list">';
    
    Object.keys(this.powerUpPrices).forEach(powerUp => {
      const quantity = this.gameState.powerUpInventory[powerUp] || 0;
      const price = this.powerUpPrices[powerUp];
      const canAfford = this.gameState.coins >= price;
      
      const icons = {
        nitro: '🔥',
        shield: '🛡️',
        magnet: '🧲',
        fuelBoost: '⛽'
      };
      
      html += `
        <div class="powerup-card">
          <div class="powerup-icon">${icons[powerUp]}</div>
          <div class="powerup-info">
            <div class="powerup-name">${translate(powerUp)}</div>
            <div class="powerup-quantity">Owned: ${quantity}</div>
          </div>
          <div class="powerup-action">
            <button onclick="shop.buyPowerUp('${powerUp}')" ${!canAfford ? 'disabled' : ''}>🪙 ${price}</button>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    this.contentArea.innerHTML = html;
  }
  
  // Purchase functions
  buyVehicle(index) {
    if (typeof VEHICLE_LIST === 'undefined') return;
    
    const vehicle = VEHICLE_LIST[index];
    if (this.gameState.spendCoins(vehicle.unlockCost)) {
      this.gameState.unlockVehicle(index);
      this.showNotification(translate('purchaseSuccessful') + ': ' + vehicle.name);
      this.updateDisplay();
    } else {
      this.showNotification(translate('notEnoughCoins'));
    }
  }
  
  buyStage(index) {
    if (typeof STAGE_LIST === 'undefined') return;
    
    const stage = STAGE_LIST[index];
    if (this.gameState.spendCoins(stage.unlockCost)) {
      this.gameState.unlockStage(index);
      this.showNotification(translate('purchaseSuccessful') + ': ' + stage.name);
      this.updateDisplay();
    } else {
      this.showNotification(translate('notEnoughCoins'));
    }
  }
  
  buyCharacter(index) {
    if (typeof PLAYER_LIST === 'undefined') return;
    
    const character = PLAYER_LIST[index];
    if (this.gameState.spendDiamonds(character.unlockCost)) {
      this.gameState.unlockCharacter(index);
      this.showNotification(translate('purchaseSuccessful') + ': ' + character.name);
      this.updateDisplay();
    } else {
      this.showNotification(translate('notEnoughDiamonds'));
    }
  }
  
  buyUpgrade(upgrade) {
    const currentLevel = this.gameState.upgrades[upgrade];
    if (currentLevel >= 10) return;
    
    const cost = this.upgradeCosts[upgrade][currentLevel];
    if (this.gameState.upgradeComponent(upgrade, cost)) {
      this.showNotification(translate('upgradeSuccessful') + ': ' + translate(upgrade + 'Upgrade'));
      this.updateDisplay();
    } else {
      this.showNotification(translate('notEnoughCoins'));
    }
  }
  
  buyPowerUp(powerUp) {
    const price = this.powerUpPrices[powerUp];
    if (this.gameState.spendCoins(price)) {
      this.gameState.addPowerUp(powerUp, 1);
      this.showNotification(translate('purchaseSuccessful') + ': ' + translate(powerUp));
      this.updateDisplay();
    } else {
      this.showNotification(translate('notEnoughCoins'));
    }
  }
  
  // Selection functions
  selectVehicle(index) {
    this.gameState.setSelected('vehicle', index);
    this.updateDisplay();
  }
  
  selectStage(index) {
    this.gameState.setSelected('stage', index);
    this.updateDisplay();
  }
  
  selectCharacter(index) {
    this.gameState.setSelected('character', index);
    this.updateDisplay();
  }
  
  showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'shop-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  }
  
  show() {
    this.shopContainer.style.display = 'block';
    this.updateDisplay();
  }
  
  hide() {
    this.shopContainer.style.display = 'none';
  }
  
  isVisible() {
    return this.shopContainer.style.display !== 'none';
  }
}

// Export for global use
window.Shop = Shop;
export default Shop;