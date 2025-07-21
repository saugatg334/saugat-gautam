class ConnectionHistory {
  constructor(from, to, inno, innovationNos) {
    this.fromNode = from;
    this.toNode = to;
    this.innovationNumber = inno;
    this.innovationNumbers = [];
    arrayCopy(innovationNos, this.innovationNumbers); //copy (from, to)
  }

  // Returns whether the genome matches the original genome and the connection is between the same nodes
  matches(genome, from, to) {
    if (genome.genes.length === this.innovationNumbers.length) { //if the number of connections are different then the genomes aren't the same
      if (from.number === this.fromNode && to.number === this.toNode) {
        //next check if all the innovation numbers match from the genome
        for (var i = 0; i < genome.genes.length; i++) {
          if (!this.innovationNumbers.includes(genome.genes[i].innovationNo)) {
            return false;
          }
        }
        //if reached this far then the innovationNumbers match the genes innovation numbers and the connection is between the same nodes
        //so it does match
        return true;
      }
    }
    return false;
  }
}
// If using modules, uncomment the following line:
// export default ConnectionHistory;
