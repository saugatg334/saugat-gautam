
class World {
  constructor() {
    this.world = new b2World(new Vec2(0, 10), true);
    this.playersInWorld = 0;
  }
}

// Export for use in other modules (ES6)
export default World;
