class Node {
  constructor(no) {
    this.number = no;
    this.inputSum = 0; // current sum i.e. before activation
    this.outputValue = 0; // after activation function is applied
    this.outputConnections = []; // new ArrayList<connectionGene>()
    this.layer = 0;
    this.drawPos = (typeof createVector === 'function') ? createVector() : { x: 0, y: 0 };
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //the node sends its output to the inputs of the nodes its connected to
  engage() {
    if (this.layer !== 0) { // no sigmoid for the inputs and bias
      this.outputValue = this.sigmoid(this.inputSum);
    }
    for (let i = 0; i < this.outputConnections.length; i++) { // for each connection
      if (this.outputConnections[i].enabled) { // only if enabled
        this.outputConnections[i].toNode.inputSum += this.outputConnections[i].weight * this.outputValue;
      }
    }
  }
    //----------------------------------------------------------------------------------------------------------------------------------------
    //not used
  stepFunction(x) {
    return x < 0 ? 0 : 1;
  }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //sigmoid activation function
  sigmoid(x) {
    const exp = (typeof pow === 'function') ? pow(Math.E, -4.9 * x) : Math.exp(-4.9 * x);
    return 1.0 / (1.0 + exp);
  }
    //----------------------------------------------------------------------------------------------------------------------------------------------------------
    //returns whether this node connected to the parameter node
    //used when adding a new connection
  isConnectedTo(node) {
    if (node.layer === this.layer) return false;
    if (node.layer < this.layer) {
      for (let i = 0; i < node.outputConnections.length; i++) {
        if (node.outputConnections[i].toNode === this) return true;
      }
    } else {
      for (let i = 0; i < this.outputConnections.length; i++) {
        if (this.outputConnections[i].toNode === node) return true;
      }
    }
    return false;
  }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //returns a copy of this node
  clone() {
    const clone = new Node(this.number);
    clone.layer = this.layer;
    return clone;
  }
}

// For ES module compatibility
export default Node;
