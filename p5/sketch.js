// Nature of Code
// Assignment 5: Genetic Algorithms

let rocket;
let genPop;
let lifespan = 150;
let target;
let count = 0;
let genCounter = 1;
let change; 

function setup() {
  createCanvas(windowWidth,windowHeight);
  rocket = new Rocket();
  genPop = new Population();
  target = createVector(width/2,100);
  change = map(count,0,100,0,255);
}
//------------------------------------------- DRAW
function draw() {
  background(225);
  genPop.run();
  noFill();
  stroke(0);
  ellipse(width/2, height-100, 10);
  noStroke();
  fill(31,42,31,random(220,225));
  ellipse(target.x,target.y,16 + random(3));
  count++;
  fill(31);
  textSize(20);
  text("Generation: " + genCounter,33,33);
  if(count == lifespan){
    genPop.evaluate();
    genPop.selection();
    genCounter++;
    count = 0;
  }
}
//------------------------------------------- POP
function Population(){
  this.rockets = [];
  this.matingPool = [];
  this.popSize = 42;
  for(let i=0;i<this.popSize;i++){
    this.rockets[i] = new Rocket();
  }
  this.evaluate = function(){
    let maxFit = 0;
    for(let i =0;i<this.popSize;i++){
      this.rockets[i].calcFitness();
      if(this.rockets[i].fitness > maxFit){
        maxFit = this.rockets[i].fitness;
      }
    } // Normalize the fitness values
    for(let i=0;i< this.popSize;i++){
      this.rockets[i].fitness /= maxFit;
    }
    
    this.matingPool = []; // Clears for each gen
   
    for(let i =0;i<this.popSize;i++){
      // Determine the the fittest
      let n = this.rockets[i].fitness * 100;
      for(let j = 0; j < n; j++){
        // Use fitness to decide next gen
        this.matingPool.push(this.rockets[i]);
      }
    }
  } // Random selection
  this.selection = function(){
    let newRockets = [];
    for(let i = 0; i < this.rockets.length; i++){
      let parentA = random(this.matingPool).dna;
      let parentB = random(this.matingPool).dna;
      let child = parentA.crossover(parentB);
      newRockets[i] = new Rocket(child);
    }
    this.rockets = newRockets;
  }
  this.run = function(){
    for(let i =0;i<this.popSize;i++){
      this.rockets[i].appearance();
      this.rockets[i].firstLaw();
      this.rockets[i].secondLaw();
      //this.rockets[i].thirdLaw();
      this.rockets[i].calcFitness();
    }
  }
}
//------------------------------------------- DNA
function DNA(genes){
  if(genes){
    this.genes = genes;
  } else {
    this.genes = [];
    for(let i=0;i<lifespan;i++){
      this.genes[i] = p5.Vector.random2D();
      //this.genes[i].setMag(0.6);
    }
  }
   // Moosh those genes together
  this.crossover = function(partner){
    let newGenes = [];
    let mid = floor(random(this.genes.length));
    for(let i = 0; i < this.genes.length; i++){
      if(i > mid){
        newGenes[i] = this.genes[i];
      } else {
        newGenes[i] = partner.genes[i];
      }
    }
    return new DNA(newGenes);
  }
}
//------------------------------------------- ROCKET
function Rocket(dna){
  this.pos = createVector(width/2,height-100);
  this.vel = createVector();
  this.acc = createVector();
  this.mass = 3;
  this.count = 1;
  this.fitness = 0;
  if(dna){
    this.dna = dna;
  } else {
    this.dna = new DNA();
  }
  this.appearance = function(){
    push();
    fill(31,42+genCounter,31,150);
    noStroke();
    translate(this.pos.x,this.pos.y);
    rotate(this.vel.heading());
    rectMode(CENTER);
    rect(0,0,8,3,10);
    pop();
  } // An object in motion stays in motion
  this.firstLaw = function(){
    this.secondLaw(this.dna.genes[this.count]);
    this.count++;
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  } // Force = mass * acceleration
  this.secondLaw = function(force){
    // let forceCopy = force.copy();
    // take the force and div by mass
    // this.mass.div(forceCopy);
    // Add the force to acceleration
    this.acc.add(force);
  } // Forces happen in pairs
  this.thirdLaw = function(){
    // Set the boundaries for the rocket
    this.acc.mult(0.9);
    if(this.pos.x>width){
      this.pos.x = width;
      this.vel.x *= -1;
    }
    if(this.pos.y>height){
      this.pos.y = height;
      this.vel.y *= -1;
    }
  } // Calculate the fitness for the next generation
  this.calcFitness = function(){
    let d = dist(this.pos.x,this.pos.y,target.x,target.y);
    this.fitness = map(d, 0, width, width, 0);
  }
}