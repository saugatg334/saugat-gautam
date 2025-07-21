
export default class Population {

  constructor() {
    this.players = [];
    this.bestPlayer = null;
    this.bestScore = 0;
    this.globalBestScore = 0;
    this.gen = 1;
    this.innovationHistory = [];
    this.genPlayers = [];
    this.species = [];
    this.massExtinctionEvent = false;
    this.newStage = false;
    this.gensSinceNewWorld = 0;
    this.batchNo = 0;
    this.worldsPerBatch = 5;
    // Safety: check if Player is defined
    if (typeof Player !== 'undefined' && typeof numberOfWorlds !== 'undefined' && typeof playersPerWorld !== 'undefined') {
      for (let i = 0; i < numberOfWorlds; i++) {
        for (let j = 0; j < playersPerWorld; j++) {
          const player = new Player();
          if (player.brain && typeof player.brain.fullyConnect === 'function') {
            player.brain.fullyConnect(this.innovationHistory);
            player.brain.generateNetwork && player.brain.generateNetwork();
          }
          if (typeof player.addToWorld === 'function') player.addToWorld();
          if (player.car) player.car.number = i;
          this.players.push(player);
        }
      }
    } else {
      console.warn('Player, numberOfWorlds, or playersPerWorld is not defined.');
    }
  }
    //------------------------------------------------------------------------------------------------------------------------------------------
    //update all the players which are alive
  updateAlive() {
    let aliveCount = 0;
    for (let i = 0; i < this.players.length; i++) {
      if (this.playerInBatch(this.players[i])) {
        if (!this.players[i].dead) {
          aliveCount++;
          this.players[i].look && this.players[i].look();
          this.players[i].think && this.players[i].think();
          this.players[i].update && this.players[i].update();
          if (typeof showNothing !== 'undefined' && typeof showBest !== 'undefined' && !showNothing && (!showBest || i === 0)) {
            this.players[i].show && this.players[i].show();
          }
          if (this.players[i].score > this.globalBestScore) {
            this.globalBestScore = this.players[i].score;
          }
        }
      }
    }


    if (aliveCount == 0) {
      this.batchNo++;

    }
  }


  playerInBatch(player) {
    for (var i = this.batchNo * this.worldsPerBatch; i < min((this.batchNo + 1) * this.worldsPerBatch, worlds.length); i++) {
      if (player.world == worlds[i]) {
        return true;
      }
    }

    return false;


  }

  stepWorldsInBatch() {
    if (typeof worlds !== 'undefined') {
      for (let i = this.batchNo * this.worldsPerBatch; i < Math.min((this.batchNo + 1) * this.worldsPerBatch, worlds.length); i++) {
        worlds[i].Step(1 / 30, 10, 10);
      }
    }

  }

  //------------------------------------------------------------------------------------------------------------------------------------------
  //returns true if all the players are dead      sad
  batchDead() {
    for (let i = this.batchNo * this.playersPerBatch; i < Math.min((this.batchNo + 1) * this.playersPerBatch, this.players.length); i++) {
      if (!this.players[i].dead) {
        return false;
      }
    }
    return true;
  }

  //------------------------------------------------------------------------------------------------------------------------------------------
  //returns true if all the players are dead      sad
  done() {
      for (let i = 0; i < this.players.length; i++) {
        if (!this.players[i].dead) {
          return false;
        }
      }
      if (typeof clearWorlds === 'function') clearWorlds();
      return true;
    }
    //------------------------------------------------------------------------------------------------------------------------------------------
    //sets the best player globally and for thisthis.gen
  setBestPlayer() {
    let tempBest = this.species[0].players[0];
    tempBest.gen = this.gen;


    //if best thisthis.gen is better than the global best score then set the global best as the best thisthis.gen

    if (tempBest.score >= this.bestScore) {
      this.genPlayers.push(tempBest.cloneForReplay());
      if (typeof console !== 'undefined') {
        console.log("old best: " + this.bestScore);
        console.log("new best: " + tempBest.score);
      }
      this.bestScore = tempBest.score;
      this.bestPlayer = tempBest.cloneForReplay();
    }
  }

  //------------------------------------------------------------------------------------------------------------------------------------------------
  //this function is called when all the players in the this.players are dead and a newthis.generation needs to be made
  naturalSelection() {
    // if (this.gen % 2 == 0 && playersPerWorld < 15) {
    //   playersPerWorld += 1;
    // }
    this.batchNo = 0;
    var previousBest = this.players[0];
    this.speciate(); //seperate the this.players varo this.species
    this.calculateFitness(); //calculate the fitness of each player
    this.sortSpecies(); //sort the this.species to be ranked in fitness order, best first
    if (this.massExtinctionEvent) {
      this.massExtinction();
      this.massExtinctionEvent = false;
    }
    this.cullSpecies(); //kill off the bottom half of each this.species
    this.setBestPlayer(); //save the best player of thisthis.gen
    this.killStaleSpecies(); //remove this.species which haven't improved in the last 15(ish)this.generations
    this.killBadSpecies(); //kill this.species which are so bad that they cant reproduce

    if (typeof grounds !== 'undefined' && (this.gensSinceNewWorld >= 0 || this.bestScore > (grounds[0].distance - 350) / 10)) {
      this.gensSinceNewWorld = 0;
      if (typeof console !== 'undefined') {
        console.log(this.gensSinceNewWorld);
        console.log(this.bestScore);
        console.log(grounds[0].distance);
      }
      if (typeof newWorlds === 'function') newWorlds();
    }

    // console.log("generation  " + this.gen + "  Number of mutations  " + this.innovationHistory.length + "  species:   " + this.species.length + "  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");


    var averageSum = this.getAvgFitnessSum();
    var children = []; //new ArrayList<Player>();//the nextthis.generation
    // console.log("Species:");
    for (let j = 0; j < this.species.length; j++) { //for each this.species

      // // console.log("best unadjusted fitness:" + this.species[j].bestFitness);
      // for (var i = 0; i < this.species[j].players.length; i++) {
      //   console.log("player " + i + " fitness: " + this.species[j].players[i].fitness + " score " + this.species[j].players[i].score + ' ');
      // }
      // console.log();
      children.push(this.species[j].champ.clone()); //add champion without any mutation

      let NoOfChildren = Math.floor(this.species[j].averageFitness / averageSum * this.players.length) - 1; //the number of children this this.species is allowed, note -1 is because the champ is already added
      for (let i = 0; i < NoOfChildren; i++) { //get the calculated amount of children from this this.species
        children.push(this.species[j].giveMeBaby(this.innovationHistory));
      }
    }
    if (children.length < this.players.length) {
      children.push(previousBest.clone());
    }
    // while (children.length < this.players.length) { //if not enough babies (due to flooring the number of children to get a whole var)
    //   children.push(this.species[0].giveMeBaby(this.innovationHistory)); //get babies from the best this.species
    // }
    if (typeof playersPerWorld !== 'undefined' && typeof numberOfWorlds !== 'undefined') {
      while (children.length < playersPerWorld * numberOfWorlds) {
        children.push(this.species[0].giveMeBaby(this.innovationHistory));
      }
    }
    this.players = [];
    if (typeof arrayCopy === 'function') {
      arrayCopy(children, this.players);
    } else {
      this.players = children.slice();
    }
    this.gen += 1;
    this.gensSinceNewWorld++;
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].brain && this.players[i].brain.generateNetwork && this.players[i].brain.generateNetwork();
      if (this.players[i].car) this.players[i].car.number = i;
    }
    if (typeof console !== 'undefined') {
      console.log("LOOOK HERE THERE ARE " + this.players.length + " Players in this gen");
    }

  }

  //------------------------------------------------------------------------------------------------------------------------------------------
  //seperate this.players into this.species based on how similar they are to the leaders of each this.species in the previousthis.gen
  speciate() {
    for (let s of this.species) {
      s.players = [];
    }
    for (let i = 0; i < this.players.length; i++) {
      let speciesFound = false;
      for (let s of this.species) {
        if (s.sameSpecies(this.players[i].brain)) {
          s.addToSpecies(this.players[i]);
          speciesFound = true;
          break;
        }
      }
      if (!speciesFound && typeof Species !== 'undefined') {
        this.species.push(new Species(this.players[i]));
      }
    }
    }
    //------------------------------------------------------------------------------------------------------------------------------------------
    //calculates the fitness of all of the players
  calculateFitness() {
    for (let i = 1; i < this.players.length; i++) {
      this.players[i].calculateFitness && this.players[i].calculateFitness();
    }
    }
    //------------------------------------------------------------------------------------------------------------------------------------------
    //sorts the players within a this.species and the this.species by their fitnesses
  sortSpecies() {
      //sort the players within a this.species
    for (let s of this.species) {
      s.sortSpecies && s.sortSpecies();
    }

      //sort the this.species by the fitness of its best player
      //using selection sort like a loser
    let temp = [];
    for (let i = 0; i < this.species.length; i++) {
      let max = 0;
      let maxIndex = 0;
      for (let j = 0; j < this.species.length; j++) {
        if (this.species[j].bestFitness > max) {
          max = this.species[j].bestFitness;
          maxIndex = j;
        }
      }
      temp.push(this.species[maxIndex]);
      this.species.splice(maxIndex, 1);
      i--;
    }
    this.species = [];
    if (typeof arrayCopy === 'function') {
      arrayCopy(temp, this.species);
    } else {
      this.species = temp.slice();
    }

    }
    //------------------------------------------------------------------------------------------------------------------------------------------
    //kills all this.species which haven't improved in 15this.generations
  killStaleSpecies() {
    for (let i = 2; i < this.species.length; i++) {
      if (this.species[i].staleness >= 15) {
        this.species.splice(i, 1);
        i--;
      }
    }
    }
    //------------------------------------------------------------------------------------------------------------------------------------------
    //if a this.species sucks so much that it wont even be allocated 1 child for the nextthis.generation then kill it now
  killBadSpecies() {
    let averageSum = this.getAvgFitnessSum();
    for (let i = 1; i < this.species.length; i++) {
      if (this.species[i].averageFitness / averageSum * this.players.length < 1) {
        this.species.splice(i, 1);
        i--;
      }
    }
    }
    //------------------------------------------------------------------------------------------------------------------------------------------
    //returns the sum of each this.species average fitness
  getAvgFitnessSum() {
    let averageSum = 0;
    for (let s of this.species) {
      averageSum += s.averageFitness;
    }
    return averageSum;
  }

  //------------------------------------------------------------------------------------------------------------------------------------------
  //kill the bottom half of each this.species
  cullSpecies() {
    for (let s of this.species) {
      s.cull && s.cull();
      s.fitnessSharing && s.fitnessSharing();
      s.setAverage && s.setAverage();
    }
  }


  massExtinction() {
    for (let i = 5; i < this.species.length; i++) {
      this.species.splice(i, 1);
      i--;
    }
  }
}
