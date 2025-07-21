
class Player {

  constructor() {
    this.fitness = 0;
    this.vision = [];
    this.decision = [];
    this.unadjustedFitness = 0;
    this.lifespan = 0;
    this.bestScore = 0;
    this.dead = false;
    this.score = 0;
    this.gen = 0;
    this.genomeInputs = 13;
    this.genomeOutputs = 4;
    if (typeof Genome !== 'undefined') {
      this.brain = new Genome(this.genomeInputs, this.genomeOutputs);
    } else {
      this.brain = null;
      console.warn('Genome class is not defined.');
    }
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  show() {
    // Implement rendering logic here if needed
  }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------
  move() {
    // Implement movement logic here if needed
  }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------
  update() {
    // Implement update logic here if needed
  }
    //----------------------------------------------------------------------------------------------------------------------------------------------------------

  look() {
    // Implement vision logic here if needed
  }



  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  //gets the output of the this.brain then converts them to actions
  think() {
    let max = 0;
    let maxIndex = 0;
    if (this.brain && typeof this.brain.feedForward === 'function') {
      this.decision = this.brain.feedForward(this.vision);
    } else {
      this.decision = [];
    }
    for (let i = 0; i < this.decision.length; i++) {
      if (this.decision[i] > max) {
        max = this.decision[i];
        maxIndex = i;
      }
    }
    // Implement action logic based on decision here if needed
  }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    //returns a clone of this player with the same brian
  clone() {
    const clone = new Player();
    if (this.brain && typeof this.brain.clone === 'function') {
      clone.brain = this.brain.clone();
      clone.brain.generateNetwork && clone.brain.generateNetwork();
    }
    clone.fitness = this.fitness;
    clone.gen = this.gen;
    clone.bestScore = this.score;
    return clone;
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //since there is some randomness in games sometimes when we want to replay the game we need to remove that randomness
  //this fuction does that

  cloneForReplay() {
    const clone = new Player();
    if (this.brain && typeof this.brain.clone === 'function') {
      clone.brain = this.brain.clone();
      clone.brain.generateNetwork && clone.brain.generateNetwork();
    }
    clone.fitness = this.fitness;
    clone.gen = this.gen;
    clone.bestScore = this.score;
    return clone;
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  //fot Genetic algorithm
  calculateFitness() {
    // Implement fitness calculation logic here if needed
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  crossover(parent2) {
    const child = new Player();
    if (this.brain && typeof this.brain.crossover === 'function' && parent2.brain) {
      child.brain = this.brain.crossover(parent2.brain);
      child.brain.generateNetwork && child.brain.generateNetwork();
    }
    return child;
  }
// Export for use in other modules (ES6)
export default Player;
}
