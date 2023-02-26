let video;
let poseNet;
let poses = [];
let pose;
let leftWrist;
let rightWrist;

let rWrist = 30
let obstacles = [];
let nObs = 2;
let hit = false;
let skorKuning = 0;
let skorMerah = 0;

function setup() {
  createCanvas(900, 640);

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
}

function modelReady() {
  select("#status").html("<h1>MORNING EXERCISE</h1>");
}

function draw() {
  background(0)
  translate(width,0);
  scale(-1,1); // flip video biar ga susah mainnya
  image(video, 0, 0, width, height);
  strokeWeight(2);

  push();
  translate(width,0)
  scale(-1,1)
  fill(213, 0, 143);
  stroke(0);
  textSize(50);
  text(skorKuning, 10, 50);
  pop();

  push();
  translate(width,0)
  scale(-1,1)
  fill(255, 215, 0);
  stroke(0);
  textSize(50);
  text(skorMerah, width - 50, 50);
  pop();

  if (poses.length > 0) {
    pose = poses[0].pose;

    fill(213, 0, 143);
    leftWrist = pose.leftWrist;
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
  if(key === 'r') {
    skorKuning = 0
    skorMerah = 0
  }
}


