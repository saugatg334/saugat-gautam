// Game State Management System for Nepali Racer
// Handles fuel, coins, diamonds, power-ups, upgrades, and player progression

class GameState {
  constructor() {
    this.coins = parseInt(localStorage.getItem('nepaliRacer_coins')) || 0;
    this.diamonds = parseInt(localStorage.getItem('nepaliRacer_diamonds')) || 0;
    this.fuel = 100; // Current fuel level (0-100)
    this.maxFuel = 100; // Maximum fuel capacity
    this.fuelEfficiency = 1.0; // Fuel consumption rate multiplier
    
    // Power-ups
    this.activePowerUps = new Map();
    this.powerUpInventory = {
      nitro: parseInt(localStorage.getItem('nepaliRacer_nitro')) || 0,
      shield: parseInt(localStorage.getItem('nepaliRacer_shield')) || 0,
      magnet: parseInt(localStorage.getItem('nepaliRacer_magnet')) || 0,
      fuelBoost: parseInt(localStorage.getItem('nepaliRacer_fuelBoost')) || 0
    };
    
    // Upgrades
    this.upgrades = {
      speed: parseInt(localStorage.getItem('nepaliRacer_speedUpgrade')) || 0,
      suspension: parseInt(localStorage.getItem('nepaliRacer_suspensionUpgrade')) || 0,
      fuel: parseInt(localStorage.getItem('nepaliRacer_fuelUpgrade')) || 0,
      grip: parseInt(localStorage.getItem('nepaliRacer_gripUpgrade')) || 0
    };
    
    // Unlocked content
    this.unlockedVehicles = JSON.parse(localStorage.getItem('nepaliRacer_unlockedVehicles')) || [0, 1, 5, 6, 12, 36, 40]; // First few unlocked
    this.unlockedStages = JSON.parse(localStorage.getItem('nepaliRacer_unlockedStages')) || [0]; // First stage unlocked
    this.unlockedCharacters = JSON.parse(localStorage.getItem('nepaliRacer_unlockedCharacters')) || [0]; // First character unlocked
    
    // Selected items
    this.selectedVehicle = parseInt(localStorage.getItem('nepaliRacer_selectedVehicle')) || 0;
    this.selectedStage = parseInt(localStorage.getItem('nepaliRacer_selectedStage')) || 0;
    this.selectedCharacter = parseInt(localStorage.getItem('nepaliRacer_selectedCharacter')) || 0;
    
    // Game statistics
    this.totalDistance = parseInt(localStorage.getItem('nepaliRacer_totalDistance')) || 0;
    this.bestScore = parseInt(localStorage.getItem('nepaliRacer_bestScore')) || 0;
    this.gamesPlayed = parseInt(localStorage.getItem('nepaliRacer_gamesPlayed')) || 0;
    
    // Language setting
    this.language = localStorage.getItem('nepaliRacer_language') || 'english';
    
    // Audio settings
    this.musicEnabled = localStorage.getItem('nepaliRacer_musicEnabled') !== 'false';
    this.soundEnabled = localStorage.getItem('nepaliRacer_soundEnabled') !== 'false';
  }
  
  // Fuel Management
  consumeFuel(distance, vehicleEfficiency = 1.0) {
    const consumption = (distance / 100) * this.fuelEfficiency * (2.0 - vehicleEfficiency / 10);
    this.fuel = Math.max(0, this.fuel - consumption);
    return this.fuel > 0;
  }
  
  addFuel(amount) {
    this.fuel = Math.min(this.maxFuel, this.fuel + amount);
  }
  
  refillFuel() {
    this.fuel = this.maxFuel;
  }
  
  // Currency Management  
  addCoins(amount) {
    this.coins += amount;
    localStorage.setItem('nepaliRacer_coins', this.coins.toString());
  }
  
  spendCoins(amount) {
    if (this.coins >= amount) {
      this.coins -= amount;
      localStorage.setItem('nepaliRacer_coins', this.coins.toString());
      return true;
    }
    return false;
  }
  
  addDiamonds(amount) {
    this.diamonds += amount;
    localStorage.setItem('nepaliRacer_diamonds', this.diamonds.toString());
  }
  
  spendDiamonds(amount) {
    if (this.diamonds >= amount) {
      this.diamonds -= amount;
      localStorage.setItem('nepaliRacer_diamonds', this.diamonds.toString());
      return true;
    }
    return false;
  }
  
  // Power-up Management
  addPowerUp(type, quantity = 1) {
    if (this.powerUpInventory.hasOwnProperty(type)) {
      this.powerUpInventory[type] += quantity;
      localStorage.setItem(`nepaliRacer_${type}`, this.powerUpInventory[type].toString());
    }
  }
  
  usePowerUp(type, duration = 5000) {
    if (this.powerUpInventory[type] > 0) {
      this.powerUpInventory[type]--;
      localStorage.setItem(`nepaliRacer_${type}`, this.powerUpInventory[type].toString());
      
      this.activePowerUps.set(type, {
        endTime: Date.now() + duration,
        duration: duration
      });
      return true;
    }
    return false;
  }
  
  isPowerUpActive(type) {
    const powerUp = this.activePowerUps.get(type);
    if (powerUp && Date.now() < powerUp.endTime) {
      return true;
    } else if (powerUp) {
      this.activePowerUps.delete(type);
      return false;
    }
    return false;
  }
  
  getPowerUpTimeLeft(type) {
    const powerUp = this.activePowerUps.get(type);
    if (powerUp && Date.now() < powerUp.endTime) {
      return powerUp.endTime - Date.now();
    }
    return 0;
  }
  
  // Upgrade Management
  upgradeComponent(component, cost) {
    if (this.spendCoins(cost) && this.upgrades[component] < 10) {
      this.upgrades[component]++;
      localStorage.setItem(`nepaliRacer_${component}Upgrade`, this.upgrades[component].toString());
      return true;
    }
    return false;
  }
  
  getUpgradeMultiplier(component) {
    return 1 + (this.upgrades[component] * 0.1); // 10% boost per upgrade level
  }
  
  // Unlock Management
  unlockVehicle(index) {
    if (!this.unlockedVehicles.includes(index)) {
      this.unlockedVehicles.push(index);
      localStorage.setItem('nepaliRacer_unlockedVehicles', JSON.stringify(this.unlockedVehicles));
      return true;
    }
    return false;
  }
  
  unlockStage(index) {
    if (!this.unlockedStages.includes(index)) {
      this.unlockedStages.push(index);
      localStorage.setItem('nepaliRacer_unlockedStages', JSON.stringify(this.unlockedStages));
      return true;
    }
    return false;
  }
  
  unlockCharacter(index) {
    if (!this.unlockedCharacters.includes(index)) {
      this.unlockedCharacters.push(index);
      localStorage.setItem('nepaliRacer_unlockedCharacters', JSON.stringify(this.unlockedCharacters));
      return true;
    }
    return false;
  }
  
  // Selection Management
  setSelected(type, index) {
    if (type === 'vehicle' && this.unlockedVehicles.includes(index)) {
      this.selectedVehicle = index;
      localStorage.setItem('nepaliRacer_selectedVehicle', index.toString());
      return true;
    } else if (type === 'stage' && this.unlockedStages.includes(index)) {
      this.selectedStage = index;
      localStorage.setItem('nepaliRacer_selectedStage', index.toString());
      return true;
    } else if (type === 'character' && this.unlockedCharacters.includes(index)) {
      this.selectedCharacter = index;
      localStorage.setItem('nepaliRacer_selectedCharacter', index.toString());
      return true;
    }
    return false;
  }
  
  // Game completion rewards
  completeGame(score, distance) {
    this.gamesPlayed++;
    this.totalDistance += distance;
    
    if (score > this.bestScore) {
      this.bestScore = score;
      localStorage.setItem('nepaliRacer_bestScore', this.bestScore.toString());
    }
    
    // Calculate rewards based on performance
    const coinsEarned = Math.floor(score / 10) + Math.floor(distance / 50);
    const diamondsEarned = Math.floor(score / 100);
    
    this.addCoins(coinsEarned);
    if (diamondsEarned > 0) {
      this.addDiamonds(diamondsEarned);
    }
    
    // Chance for power-ups based on performance
    if (score > 100) {
      if (Math.random() < 0.3) this.addPowerUp('nitro', 1);
      if (Math.random() < 0.2) this.addPowerUp('shield', 1);
      if (Math.random() < 0.1) this.addPowerUp('magnet', 1);
    }
    
    localStorage.setItem('nepaliRacer_gamesPlayed', this.gamesPlayed.toString());
    localStorage.setItem('nepaliRacer_totalDistance', this.totalDistance.toString());
    
    return { coins: coinsEarned, diamonds: diamondsEarned };
  }
  
  // Settings Management
  setLanguage(lang) {
    this.language = lang;
    localStorage.setItem('nepaliRacer_language', lang);
  }
  
  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    localStorage.setItem('nepaliRacer_musicEnabled', this.musicEnabled.toString());
    return this.musicEnabled;
  }
  
  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('nepaliRacer_soundEnabled', this.soundEnabled.toString());
    return this.soundEnabled;
  }
  
  // Reset game data
  resetProgress() {
    const keys = [
      'nepaliRacer_coins', 'nepaliRacer_diamonds', 'nepaliRacer_nitro', 'nepaliRacer_shield',
      'nepaliRacer_magnet', 'nepaliRacer_fuelBoost', 'nepaliRacer_speedUpgrade',
      'nepaliRacer_suspensionUpgrade', 'nepaliRacer_fuelUpgrade', 'nepaliRacer_gripUpgrade',
      'nepaliRacer_unlockedVehicles', 'nepaliRacer_unlockedStages', 'nepaliRacer_unlockedCharacters',
      'nepaliRacer_selectedVehicle', 'nepaliRacer_selectedStage', 'nepaliRacer_selectedCharacter',
      'nepaliRacer_totalDistance', 'nepaliRacer_bestScore', 'nepaliRacer_gamesPlayed'
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
    location.reload(); // Refresh to reset state
  }
}

// Export for global use
window.GameState = GameState;
export default GameState;