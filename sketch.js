let video;
let poseNet;
let poses = [];
let pose;
let leftWrist;
let rightWrist;

let rWrist = 50
let obstacles = [];
let nObs = 2;
let hit = false;
let skorKuning = 0;
let skorMerah = 0;

let timer = 120

function setup() {
  createCanvas(1360, 900);

  for (let i = 0; i < nObs; i++) {
    obstacles.push(new Obstacle());
  }

  video = createCapture(VIDEO);
  video.size(width, height);

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", function (results) {
    poses = results;
  });

  video.hide();
  // poseNet.flipHorizontal = true
  // frameRate(1)
}

function modelReady() {
  select("#status").html("<h2>MORNING EXERCISE</h2>");
}

function playAgain() {
  timer = 120
}

function draw() {
  background(0)
  translate(width, 0);
  scale(-1, 1); // flip video biar ga susah mainnya
  image(video, 0, 0, width, height);
  strokeWeight(2);

  // timer
  if (frameCount % 60 == 0 && timer > 0) {
    timer--
  }
  if (timer == 0) {
    push()
    background(0, 0, 0, 200)
    translate(width, 0)
    scale(-1, 1)
    textSize(60)
    text("Yaah Waktunya Habis", width / 2 - 270, height / 2)
    textSize(50)
    text("Tekan 'p' untuk Bermain lagi", width / 2 - 290, height / 2 + 100)
    pop()
    noLoop()
  }
  push()
  translate(width, 0)
  scale(-1, 1)
  fill(100, 100, 200)
  stroke(0)
  textSize(50)
  text(timer, width / 2, 50)
  pop()
  // end timer

  push();
  translate(width - 20, 0)
  scale(-1, 1)
  fill(213, 0, 143);
  stroke(0);
  textSize(50);
  text(skorKuning, 10, 50);
  pop();

  push();
  translate(width + 20, 0)
  scale(-1, 1)
  fill(255, 215, 0);
  stroke(0);
  textSize(50);
  text(skorMerah, width - 50, 50);
  pop();

  if (poses.length > 0) {
    pose = poses[0].pose;

    fill(213, 0, 143);
    leftWrist = pose.leftWrist;
    strokeWeight(5)
    stroke(0)
    ellipse(leftWrist.x, leftWrist.y, rWrist);
    // rect(width-50, leftWrist.y, 50, 100);


    fill(255, 215, 0);
    rightWrist = pose.rightWrist;
    ellipse(rightWrist.x, rightWrist.y, rWrist);
    // rect(0, rightWrist.y, 50, 100);

    for (let i = 0; i < nObs; i++) {
      i == 0 ? fill(213, 0, 143) : fill(255, 215, 0);
      obstacles[i].show();
      if (obstacles[i].hitLeft(leftWrist, i)) {
        obstacles.splice(i, 1);
        skorKuning++;
        obstacles.push(new Obstacle());
      }
      if (obstacles[i].hitRight(rightWrist, i)) {
        obstacles.splice(i, 1);
        skorMerah++;
        obstacles.push(new Obstacle());
      }
    }
  }
}


function keyPressed() {
  if (key === 'r') {
    skorKuning = 0
    skorMerah = 0
  }
  if (key === 'p') {
    playAgain()
    loop()
  }
}


