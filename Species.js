
class Species {

  constructor(p) {
    this.players = [];
    this.bestFitness = 0;
    this.champ = null;
    this.averageFitness = 0;
    this.staleness = 0; //how many generations the species has gone without an improvement
    this.rep = null;

    //--------------------------------------------
    //coefficients for testing compatibility
    this.excessCoeff = 1;
    this.weightDiffCoeff = 0.5;
    this.compatibilityThreshold = 3;
    if (p) {
      this.players.push(p);
      //since it is the only one in the species it is by default the best
      this.bestFitness = p.fitness;
      this.rep = p.brain.clone();
      this.champ = p.cloneForReplay();
    }
  }

  //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //returns whether the parameter genome is in this species
  sameSpecies(g) {
    let compatibility;
    let excessAndDisjoint = this.getExcessDisjoint(g, this.rep);
    let averageWeightDiff = this.averageWeightDiff(g, this.rep);
    let largeGenomeNormaliser = g.genes.length - 20;
    if (largeGenomeNormaliser < 1) largeGenomeNormaliser = 1;
    compatibility = (this.excessCoeff * excessAndDisjoint / largeGenomeNormaliser) + (this.weightDiffCoeff * averageWeightDiff);
    return (this.compatibilityThreshold > compatibility);
  }

  //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //add a player to the species
  addToSpecies(p) {
    this.players.push(p);
  }

  //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //returns the number of excess and disjoint genes between the 2 input genomes
  //i.e. returns the number of genes which dont match
  getExcessDisjoint(brain1, brain2) {
    let matching = 0.0;
    for (let i = 0; i < brain1.genes.length; i++) {
      for (let j = 0; j < brain2.genes.length; j++) {
        if (brain1.genes[i].innovationNo === brain2.genes[j].innovationNo) {
          matching++;
          break;
        }
      }
    }
    return (brain1.genes.length + brain2.genes.length - 2 * (matching));
    }
    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //returns the avereage weight difference between matching genes in the input genomes
  averageWeightDiff(brain1, brain2) {
      if (brain1.genes.length === 0 || brain2.genes.length === 0) {
        return 0;
      }
      let matching = 0;
      let totalDiff = 0;
      for (let i = 0; i < brain1.genes.length; i++) {
        for (let j = 0; j < brain2.genes.length; j++) {
          if (brain1.genes[i].innovationNo === brain2.genes[j].innovationNo) {
            matching++;
            if (typeof abs === 'function') {
              totalDiff += abs(brain1.genes[i].weight - brain2.genes[j].weight);
            } else {
              totalDiff += Math.abs(brain1.genes[i].weight - brain2.genes[j].weight);
            }
            break;
          }
        }
      }
      if (matching === 0) {
        return 100;
      }
      return totalDiff / matching;
    }
    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //sorts the species by fitness
  sortSpecies() {

    let temp = [];
    //selection sort
    for (let i = 0; i < this.players.length; i++) {
      let max = 0;
      let maxIndex = 0;
      for (let j = 0; j < this.players.length; j++) {
        if (this.players[j].fitness > max) {
          max = this.players[j].fitness;
          maxIndex = j;
        }
      }
      temp.push(this.players[maxIndex]);
      this.players.splice(maxIndex, 1);
      i--;
    }
    if (typeof arrayCopy === 'function') {
      arrayCopy(temp, this.players);
    } else {
      this.players = temp.slice();
    }
    if (this.players.length === 0) {
      this.staleness = 200;
      return;
    }
    if (this.players[0].fitness > this.bestFitness) {
      this.staleness = 0;
      this.bestFitness = this.players[0].fitness;
      this.rep = this.players[0].brain.clone();
      this.champ = this.players[0].cloneForReplay();
    } else {
      this.staleness++;
    }
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //simple stuff
  setAverage() {
      let sum = 0;
      for (let i = 0; i < this.players.length; i++) {
        sum += this.players[i].fitness;
      }
      this.averageFitness = sum / this.players.length;
    }
    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  //gets baby from the this.players in this species
  giveMeBaby(innovationHistory) {
    let baby;
    if (typeof random === 'function' && random(1) < 0.25) {
      baby = this.selectPlayer().clone();
    } else {
      let parent1 = this.selectPlayer();
      let parent2 = this.selectPlayer();
      if (parent1.fitness < parent2.fitness) {
        baby = parent2.crossover(parent1);
      } else {
        baby = parent1.crossover(parent2);
      }
    }
    if (baby.brain && typeof baby.brain.mutate === 'function') {
      baby.brain.mutate(innovationHistory);
    }
    return baby;
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //selects a player based on it fitness
  selectPlayer() {
      let fitnessSum = 0;
      for (let i = 0; i < this.players.length; i++) {
        fitnessSum += this.players[i].fitness;
      }
      let rand = (typeof random === 'function') ? random(fitnessSum) : Math.random() * fitnessSum;
      let runningSum = 0;
      for (let i = 0; i < this.players.length; i++) {
        runningSum += this.players[i].fitness;
        if (runningSum > rand) {
          return this.players[i];
        }
      }
      return this.players[0];
    }
    //------------------------------------------------------------------------------------------------------------------------------------------
    //kills off bottom half of the species
  cull() {
      if (this.players.length > 2) {
        for (let i = Math.floor(this.players.length / 2); i < this.players.length; i++) {
          this.players.splice(i, 1);
          i--;
        }
      }
    }
    //------------------------------------------------------------------------------------------------------------------------------------------
    //in order to protect unique this.players, the fitnesses of each player is divided by the number of this.players in the species that that player belongs to
  fitnessSharing() {
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].fitness /= this.players.length;
    }
}

// Export for use in other modules (ES6)
export default Species;
  }
}
