class Person {
  constructor(x, y, personWidth, personHeight, world) {
    this.world = world;
    this.x = x;
    this.y = y;
    this.height = personHeight;
    this.width = personWidth;
    this.torso = typeof Torso === 'function' ? new Torso(x, y - (personHeight / 2), personHeight, personWidth, this.world) : null;
    this.head = typeof Head === 'function' ? new Head(x, y - (personHeight + personWidth * 1), personWidth * 1, this.world) : null;
    if (typeof b2RevoluteJointDef === 'function' && typeof Vec2 === 'function' && typeof SCALE !== 'undefined' && this.head && this.torso) {
      var revJointDef = new b2RevoluteJointDef();
      var jointPos = new Vec2(x / SCALE, (y - personHeight) / SCALE);
      revJointDef.Initialize(this.head.body, this.torso.body, jointPos);
      this.headJoint = this.world.CreateJoint(revJointDef);
    }
    if (typeof b2DistanceJointDef === 'function' && typeof Vec2 === 'function' && typeof SCALE !== 'undefined' && this.head && this.torso) {
      var distJointDef = new b2DistanceJointDef();
      var anchorTorso = new Vec2(x / SCALE, y / SCALE);
      var anchorHead = new Vec2(x / SCALE, this.head.startingPosition.y / SCALE);
      distJointDef.Initialize(this.head.body, this.torso.body, anchorHead, anchorTorso);
      this.distJoint = this.world.CreateJoint(distJointDef);
    }
  }

  show() {
    if (this.head && this.head.show) this.head.show();
    if (this.torso && this.torso.show) this.torso.show();
  }
}


class Head {
  constructor(x, y, r, world) {
    this.world = world;
    this.startingPosition = (typeof createVector === 'function') ? createVector(x, y) : { x, y };
    this.radius = r;
    this.body = null;
    this.id = 'head';
    this.isCB = false;
    this.makeBody();
  }

  makeBody() {
    if (typeof b2BodyDef !== 'function' || typeof b2DynamicBody === 'undefined' || typeof SCALE === 'undefined') return;
    let bodyDef = new b2BodyDef();
    bodyDef.type = b2DynamicBody;
    bodyDef.position.x = this.startingPosition.x / SCALE;
    bodyDef.position.y = this.startingPosition.y / SCALE;
    bodyDef.angle = 0;
    let fixDef = new b2FixtureDef();
    fixDef.density = 0.001;
    fixDef.friction = 0.01;
    fixDef.restitution = 0.01;
    fixDef.shape = new b2CircleShape(this.radius / SCALE);
    this.body = this.world.CreateBody(bodyDef);
    this.body.SetUserData(this);
    if (typeof b2FilterData === 'function' && typeof PERSON_CATEGORY !== 'undefined' && typeof PERSON_MASK !== 'undefined') {
      var filtData = new b2FilterData();
      filtData.categoryBits = PERSON_CATEGORY;
      filtData.maskBits = PERSON_MASK;
      this.body.CreateFixture(fixDef).SetFilterData(filtData);
    } else {
      this.body.CreateFixture(fixDef);
    }
  }

  show() {
    if (!this.body) return;
    let x = this.body.GetPosition().x * (typeof SCALE !== 'undefined' ? SCALE : 1);
    let y = this.body.GetPosition().y * (typeof SCALE !== 'undefined' ? SCALE : 1);
    let angle = this.body.GetAngle();
    if (typeof push === 'function') push();
    if (typeof translate === 'function') translate(x - (typeof panX !== 'undefined' ? panX : 0), y - (typeof panY !== 'undefined' ? panY : 0));
    if (typeof rotate === 'function') rotate(angle);
    if (typeof image === 'function') {
      if (typeof cbHead !== 'undefined' && cbHead) {
        image(typeof CBHeadSprite !== 'undefined' ? CBHeadSprite : null, -this.radius - 7, -this.radius - 15, this.radius * 3, this.radius * 3);
      } else {
        image(typeof headSprite !== 'undefined' ? headSprite : null, -this.radius - 8, -this.radius - 15, this.radius * 3, this.radius * 3);
      }
    }
    if (typeof pop === 'function') pop();
  }
}


class Torso {
  constructor(centerX, centerY, height, width, world) {
    this.id = 'torso';
    this.world = world;
    this.width = width;
    this.height = height;
    this.startingPosition = (typeof createVector === 'function') ? createVector(centerX, centerY) : { x: centerX, y: centerY };
    this.body = null;
    this.colour = (typeof color === 'function') ? color(0, 0, 0) : '#000';
    this.makeBody();
  }

  makeBody() {
    if (typeof b2BodyDef !== 'function' || typeof b2DynamicBody === 'undefined' || typeof SCALE === 'undefined') return;
    let bodyDef = new b2BodyDef();
    bodyDef.type = b2DynamicBody;
    bodyDef.position.x = this.startingPosition.x / SCALE;
    bodyDef.position.y = this.startingPosition.y / SCALE;
    bodyDef.angle = 0;
    let fixDef = new b2FixtureDef();
    fixDef.density = 0.002;
    fixDef.friction = 0.01;
    fixDef.restitution = 0.01;
    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(this.width / 2 / SCALE, this.height / 2 / SCALE);
    this.body = this.world.CreateBody(bodyDef);
    this.body.SetUserData(this);
    if (typeof b2FilterData === 'function' && typeof PERSON_CATEGORY !== 'undefined' && typeof PERSON_MASK !== 'undefined') {
      var filtData = new b2FilterData();
      filtData.categoryBits = PERSON_CATEGORY;
      filtData.maskBits = PERSON_MASK;
      this.body.CreateFixture(fixDef).SetFilterData(filtData);
    } else {
      this.body.CreateFixture(fixDef);
    }
  }

  show() {
    if (!this.body) return;
    let x = this.body.GetPosition().x * (typeof SCALE !== 'undefined' ? SCALE : 1);
    let y = this.body.GetPosition().y * (typeof SCALE !== 'undefined' ? SCALE : 1);
    let angle = this.body.GetAngle();
    if (typeof push === 'function') push();
    if (typeof translate === 'function') translate(x - (typeof panX !== 'undefined' ? panX : 0), y - (typeof panY !== 'undefined' ? panY : 0));
    if (typeof rotate === 'function') rotate(angle);
    if (typeof fill === 'function') fill(this.colour);
    if (typeof stroke === 'function') stroke(0);
    if (typeof strokeWeight === 'function') strokeWeight(1);
    if (typeof rectMode === 'function') rectMode(CENTER);
    if (typeof rect === 'function') rect(0, 0, this.width, this.height);
    if (typeof pop === 'function') pop();
  }
}

// For ES module compatibility
export { Person, Head, Torso };
