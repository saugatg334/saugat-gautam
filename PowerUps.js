// Power-up System for Nepali Racer
// Handles collectible power-ups during gameplay

class PowerUp {
  constructor(x, y, type, world) {
    this.world = world;
    this.type = type;
    this.x = x;
    this.y = y;
    this.collected = false;
    this.id = "powerup";
    this.width = 30;
    this.height = 30;
    this.animationOffset = Math.random() * Math.PI * 2;
    
    // Power-up properties
    this.properties = this.getPowerUpProperties(type);
    
    // Create physics body
    this.createBody();
  }
  
  getPowerUpProperties(type) {
    const properties = {
      fuel: {
        color: '#00FF00',
        emoji: '⛽',
        value: 25,
        description: 'Fuel Boost +25%'
      },
      coin: {
        color: '#FFD700',
        emoji: '🪙',
        value: 10,
        description: 'Coins +10'
      },
      diamond: {
        color: '#00FFFF',
        emoji: '💎',
        value: 1,
        description: 'Diamond +1'
      },
      nitro: {
        color: '#FF4500',
        emoji: '🔥',
        value: 5000, // 5 seconds
        description: 'Nitro Boost'
      },
      shield: {
        color: '#4169E1',
        emoji: '🛡️',
        value: 8000, // 8 seconds
        description: 'Shield Protection'
      },
      magnet: {
        color: '#FF1493',
        emoji: '🧲',
        value: 6000, // 6 seconds
        description: 'Coin Magnet'
      },
      star: {
        color: '#FFFF00',
        emoji: '⭐',
        value: 50,
        description: 'Score Bonus +50'
      }
    };
    return properties[type] || properties.coin;
  }
  
  createBody() {
    if (typeof b2BodyDef === 'undefined') return;
    
    const bodyDef = new b2BodyDef();
    bodyDef.type = b2StaticBody;
    bodyDef.position.x = this.x / SCALE;
    bodyDef.position.y = this.y / SCALE;
    
    const fixDef = new b2FixtureDef();
    fixDef.isSensor = true; // Makes it a trigger/sensor
    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(this.width / 2 / SCALE, this.height / 2 / SCALE);
    
    this.body = this.world.CreateBody(bodyDef);
    this.body.CreateFixture(fixDef);
    this.body.SetUserData(this);
  }
  
  show() {
    if (this.collected) return;
    
    push();
    
    // Floating animation
    const floatOffset = Math.sin(frameCount * 0.1 + this.animationOffset) * 5;
    const x = this.x - panX;
    const y = this.y - panY + floatOffset;
    
    translate(x, y);
    
    // Glow effect
    drawingContext.shadowColor = this.properties.color;
    drawingContext.shadowBlur = 15;
    
    // Background circle
    fill(this.properties.color);
    stroke(255);
    strokeWeight(2);
    ellipse(0, 0, this.width, this.height);
    
    // Reset shadow
    drawingContext.shadowBlur = 0;
    
    // Emoji/Icon
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(255);
    text(this.properties.emoji, 0, 0);
    
    pop();
  }
  
  collect(gameState, player) {
    if (this.collected) return false;
    
    this.collected = true;
    
    // Apply power-up effect
    switch(this.type) {
      case 'fuel':
        gameState.addFuel(this.properties.value);
        break;
      case 'coin':
        gameState.addCoins(this.properties.value);
        break;
      case 'diamond':
        gameState.addDiamonds(this.properties.value);
        break;
      case 'nitro':
        gameState.usePowerUp('nitro', this.properties.value);
        break;
      case 'shield':
        gameState.usePowerUp('shield', this.properties.value);
        break;
      case 'magnet':
        gameState.usePowerUp('magnet', this.properties.value);
        break;
      case 'star':
        if (player) player.score += this.properties.value;
        break;
    }
    
    // Remove from physics world
    if (this.body && this.world) {
      this.world.DestroyBody(this.body);
      this.body = null;
    }
    
    return true;
  }
  
  // Check collision with player
  checkCollision(playerCar) {
    if (this.collected || !playerCar) return false;
    
    const carX = playerCar.chassisBody.GetPosition().x * SCALE;
    const carY = playerCar.chassisBody.GetPosition().y * SCALE;
    
    const distance = Math.sqrt(
      Math.pow(carX - this.x, 2) + Math.pow(carY - this.y, 2)
    );
    
    return distance < (this.width + 50) / 2; // Slightly larger collision area
  }
}

class PowerUpManager {
  constructor(world) {
    this.world = world;
    this.powerUps = [];
    this.spawnDistance = 0;
    this.lastSpawnX = 0;
  }
  
  update(gameState, player) {
    // Update existing power-ups
    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      const powerUp = this.powerUps[i];
      
      // Check collision
      if (player && player.car && powerUp.checkCollision(player.car)) {
        powerUp.collect(gameState, player);
        this.powerUps.splice(i, 1);
        continue;
      }
      
      // Remove if too far behind
      if (powerUp.x < panX - 200) {
        if (powerUp.body && this.world) {
          this.world.DestroyBody(powerUp.body);
        }
        this.powerUps.splice(i, 1);
      }
    }
    
    // Spawn new power-ups
    this.spawnPowerUps();
  }
  
  spawnPowerUps() {
    const currentX = panX + 800; // Spawn ahead of view
    
    if (currentX - this.lastSpawnX > 300) { // Spawn every 300 pixels
      this.lastSpawnX = currentX;
      
      // Random spawn chance
      if (Math.random() < 0.4) { // 40% chance
        const type = this.getRandomPowerUpType();
        const x = currentX + Math.random() * 200 - 100;
        const y = this.getGroundHeight(x) - 50; // Above ground
        
        this.powerUps.push(new PowerUp(x, y, type, this.world));
      }
    }
  }
  
  getRandomPowerUpType() {
    const types = [
      { type: 'coin', weight: 40 },
      { type: 'fuel', weight: 25 },
      { type: 'nitro', weight: 15 },
      { type: 'star', weight: 10 },
      { type: 'shield', weight: 5 },
      { type: 'magnet', weight: 3 },
      { type: 'diamond', weight: 2 }
    ];
    
    const totalWeight = types.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of types) {
      random -= item.weight;
      if (random <= 0) {
        return item.type;
      }
    }
    
    return 'coin'; // Fallback
  }
  
  getGroundHeight(x) {
    // Get ground height at position x
    if (typeof groundTemplate !== 'undefined' && groundTemplate.getPositions) {
      const positions = groundTemplate.getPositions(x / SCALE, 1, 1);
      return positions[0] * SCALE;
    }
    return 400; // Fallback height
  }
  
  show() {
    this.powerUps.forEach(powerUp => powerUp.show());
  }
  
  reset() {
    // Clean up all power-ups
    this.powerUps.forEach(powerUp => {
      if (powerUp.body && this.world) {
        this.world.DestroyBody(powerUp.body);
      }
    });
    this.powerUps = [];
    this.lastSpawnX = 0;
  }
}

// Export for global use
window.PowerUp = PowerUp;
window.PowerUpManager = PowerUpManager;
export { PowerUp, PowerUpManager };