
var particlesNum = 700;
    gForce = 0;
    len = 0;
    magnetPB = false;
    magnetNB = false;
    weakB = false;
    strongB = false;
    gravityB = false;
    magnetPDone = false;
    magnetNDone = false;
    strongDone = false;
    instructions = false;
    weights = [];
    strongPar = [];
    gravity = new GravityBehavior2D (new Vec2D(0, 0));
    collision = [];
    none = [];
    alphaT = 0;

let physics;
let physics2;
let magnet ;
let strong;
let mousePos;
let instructionsText = 'Lucida Console';

function setup() {
  createCanvas(windowWidth, windowHeight);

  physics = new VerletPhysics2D();
  physics.setDrag(0.001);
  physics.setWorldBounds(new Rect(0, 0, windowWidth, windowHeight));
  physics.addBehavior(gravity);

  physics2 = new VerletPhysics2D();
  physics2.setDrag(0);
  physics2.setWorldBounds(new Rect(0, 0, windowWidth, windowHeight));
  physics2.addBehavior(gravity);

  for (let i=0; i<particlesNum; i++) {
    weights[i] = random(7, 15);
    strongPar [i]  = false;
    var p = new VerletParticle2D(new Vec2D (random(0, windowWidth), random(0, windowHeight)), weights[i]);
    collision[i] = new AttractionBehavior2D(p, p.getWeight(), -0.5, 0.05);
    physics.addBehavior(collision[i]);
    //physics.addBehavior(new AttractionBehavior2D(p, p.getWeight()*2, 0.01, 0.01));
    physics.addParticle(p);
  }
  for (let i=0; i<particlesNum; i++) {
    var p = physics.particles[i];
    var q = new VerletParticle2D(new Vec2D (random(0, windowWidth), random(0, windowHeight)));
    //physics2.addBehavior(collision[i]);
    physics2.addParticle(q);
    var s = new VerletSpring2D(q, p, 0, 1);
    physics.addSpring(s);
  }
  mousePos = new Vec2D (mouseX, mouseY);
}

function draw() {
  background(0, 0, 0);
  noStroke();
  gravityFunc();
  magnetism();
  strongNuclear();
  weakNuclear();
  
  for (let i=0; i<particlesNum; i++) {
    var p = physics.particles[i];
    var q = physics2.particles[i];
    if (dist(p.x, p.y, q.x, q.y) > 1){
      fill(128);
      ellipse(q.x, q.y, weights[i], weights[i]);
    }
    fill(255);
    ellipse(p.x, p.y, weights[i], weights[i]);
  }
  if (magnetPB){
    fill(255,0,0);
    ellipse(mouseX, mouseY, 5,5);
  }
  if (magnetNB){
    fill(0,0,255);
    ellipse(mouseX, mouseY, 5,5);
  }
  if (strongB){
    stroke(255);
    fill(0,0);
    ellipse(mouseX, mouseY, 100,100);
  }
  noStroke();
  textSize(12);
  textFont(instructionsText);
  let info = 'PRESS "I" FOR INSTRUCTIONS';
  let infoWidth = textWidth(info);
  rectMode(CENTER);
  fill (255,128);
  rect(windowWidth/2, windowHeight - 50, infoWidth + 20, 20,5,5);

  fill(0);
  
  textAlign(CENTER, CENTER);
  text(info, windowWidth/2, windowHeight - 50);

  rectMode(CORNER);
  fill(0,alphaT);
  rect(0,0,windowWidth, windowHeight);
  fill(255,alphaT);
  textSize(32);
  textStyle(BOLD);
  text('INSTRUCTIONS', windowWidth/2, windowHeight/2 - 60);
  textStyle(NORMAL);
  textSize(16);
  text('PRESS THE KEYS:', windowWidth/2, windowHeight/2 - 24);
  text('1 - NEGATIVE    MAGNETISM', windowWidth/2, windowHeight/2+4);
  text('2 - POSITIVE    MAGNETISM', windowWidth/2, windowHeight/2+18);
  text('3 - STRONG        NUCLEAR', windowWidth/2, windowHeight/2+32);
  text('4 - ACTIVATE WEAK NUCLEAR', windowWidth/2, windowHeight/2+46);
  text('5 - ACTIVATE      GRAVITY', windowWidth/2, windowHeight/2+60);
  text('I - TO EXIT', windowWidth/2, windowHeight - 100)
  
  if (instructions){
    alphaT += 5;
    if (alphaT > 255){
      alphaT = 255;
    }
    else{
      physics.update();
    }
  }
  else {
    physics.update();
    alphaT -= 5;
    if (alphaT < 0){
      alphaT = 0;
    }
  }
}

function magnetism() {
  mousePos.set(mouseX, mouseY);
  if (!magnetPB && magnetPDone) {
    physics.removeBehavior(magnet);
    magnetPDone = false;
  }
  if (!magnetNB && magnetNDone) {
    physics.removeBehavior(magnet);
    magnetNDone = false;
  }
  if (magnetPB && !magnetPDone) {
    magnet = new AttractionBehavior2D(mousePos, 100, 0.1);
    physics.addBehavior(magnet);
    magnetPDone = true;
  } else if (magnetNB && !magnetNDone) {
    magnet = new AttractionBehavior2D(mousePos, 100, -0.5);
    physics.addBehavior(magnet);
    magnetNDone = true;
  }
  
}

function strongNuclear() {
  mousePos.set(mouseX, mouseY);
  if (!strongB && strongDone) {
    physics.removeBehavior(strong);
    strongDone = false;
  }
  if (strongB && !strongDone) {
    strong = new AttractionBehavior2D(mousePos, 300, 0.25);
    physics.addBehavior(strong);
    strongDone = true;
  }
  if (strongB) {
    for (let i = 0; i < particlesNum; i++) {
      var p = physics.particles[i];
      if (dist(p.x, p.y, mouseX, mouseY) < 300) {
        if (!strongPar[i]) {
          collision[i].setStrength(0);
          strongPar[i] = true;
        }
      } else if (strongPar[i]) {
        collision[i].setStrength(-0.25);
        strongPar [i] = false;
      }
    }
  } else {
    for (let i = 0; i < particlesNum; i++) {434
      collision[i].setStrength(-0.25);
    }
    strongDone = false;
  }
}

function weakNuclear() {
  if (weakB) {
    len += 5;
    if (len>20)
      len = 20;
    for (let i=0; i<particlesNum; i++) {
      var s = physics.springs[i];
      s.setRestLength(len);
      s.setStrength(0.5);
    }
  } else {
    len -= 2;
    if (len < 0)
      len = 0;
    for (let i=0; i<particlesNum; i++) {
      var s = physics.springs[i];
      s.setRestLength(len);
      s.setStrength(1);
    }
  }
}

function gravityFunc() {
  if(gravityB){
    gForce = map(mouseY, height/4, 3*height/4, -0.01, 0.01);
    if (gravityB){
      gravity.setForce(new Vec2D (0,gForce));
    }
  }
}

function keyPressed() {
  switch (key) {
  case '1':
    if (!magnetPB) {
      magnetPB = true;
      magnetNB = false;
      strongB = false;
    } else {
      magnetPB = false;
      magnetNB = false;
      strongB = false;
    }
    break;
  case '2':
    if (!magnetNB) {
      magnetNB = true;
      magnetPB = false;
      strongB = false;
    } else {
      magnetPB = false;
      magnetNB = false;
      strongB = false;
    }
    break;
  case '3':
    if (!strongB) {
      strongB = true;
      magnetNB = false;
      magnetPB = false;
    } else {
      magnetPB = false;
      magnetNB = false;
      strongB = false;
    }
    break;
  case '4':
    if (!weakB) {
      weakB = true;
      strongB = false;
      magnetNB = false;
      magnetPB = false;
      //gravityB = false;
    } else {
      magnetPB = false;
      magnetNB = false;
      strongB = false;
      weakB = false;
      //gravityB = false;
    }
    break;
  case '5':
    if (!gravityB) {
      gravityB = true;
      //weakB = false;
      strongB = false;
      magnetNB = false;
      magnetPB = false;
    } else {
      magnetPB = false;
      magnetNB = false;
      strongB = false;
      //weakB = false;
      gravityB = false;
      gForce = 0;
    }
    break;
  case 'i':
      instructions = !instructions;
      break;
  case 'I':
      instructions = !instructions;
      break;
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  setup();
}