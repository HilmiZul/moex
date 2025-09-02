// Created at: 16 December 2022, Bandara Kertajati, Majalengka
// Updated at: 5 April 2025
// Created by: Zul Hilmi
// Repo: hilmizul/moex

let video;
let handPose;
let hands = [];
let pose;
let leftWrist;
let rightWrist;
let radiusWrist = 50
let coins = [];
let n_obs = 2;
let skorKuning = 0;
let soundDing;

let timer = 120
let obstacleImg;
let obstacle;
let gameOver = false

function preload() {
  handPose = ml5.handPose({ flipped: false });
  soundDing = loadSound("assets/audio/ding.mp3");
  obstacleImg = loadImage("assets/img/virus.jpg")
}

function setup() {
  createCanvas(960, 720);

  for (let i = 0; i < n_obs; i++) {
    coins.push(new Coin());
  }
  obstacle = new Obstacle()

  video = createCapture(VIDEO, { flipped: false });
  video.size(width, height);
  video.hide();
  handPose.detectStart(video, modelReady);
}

function modelReady(results) {
  hands = results;
  select("#status").html("<h2>🕺🏻 MORNING EXERCISE 💃🏻</h2>");
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

  // game over while lengan kena virus
  if(gameOver) {
    noLoop()
    push()
    background(0, 0, 0, 200)
    translate(width, 0)
    scale(-1, 1)
    textSize(60)
    text("Yaah Kena Virus 😭", width / 2 - 270, height / 2)
    textSize(50)
    text("Tekan 'p' untuk Bermain lagi", width / 2 - 290, height / 2 + 100)
    pop()
  }

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
  translate(width + 20, 0)
  scale(-1, 1)
  fill(255, 215, 0);
  stroke(0);
  textSize(50);
  text(skorKuning, width - 50, 50);
  pop();
  // end score

  // deteksi titik pergelangan tangan dari handPose
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      fill(213, 0, 143);
      if(hand.handedness == "Left") {
        leftWrist = hand.keypoints[0];
        stroke(0);
        strokeWeight(5);
        circle(leftWrist.x, leftWrist.y, radiusWrist);
      } else if(hand.handedness == "Right") {
        rightWrist = hand.keypoints[0];
        stroke(0);
        strokeWeight(5)
        circle(rightWrist.x, rightWrist.y, radiusWrist);
      }
    }
  }

  // draw coins saat tangan muncul.
  // cek collision masing-masing tangan dengan coins.
  if(hands.length > 0) {
    // tampilkan obstacle saat tangan muncul ke layar
    obstacle.update()
    obstacle.show()
    obstacle.checkEdge()

    for (let i = 0; i < n_obs; i++) {
      // i == 0 ? fill(213, 0, 143) : fill(255, 215, 0);
      fill(255, 215, 0);
      coins[i].show();
      if(rightWrist) {
        if(obstacle.collision(rightWrist.x, rightWrist.y, radiusWrist)) {
          console.log('RIGHT HAND HIT VIRUS!!!')
          gameOver = true
        }
        if (coins[i].collisionWrist(rightWrist.x, rightWrist.y, i, radiusWrist)) {
          coins.splice(i, 1);
          soundDing.play();
          skorKuning++;
          coins.push(new Coin());
        }
      }
      if(leftWrist) {
        if(obstacle.collision(leftWrist.x, leftWrist.y, radiusWrist)) {
          console.log('ELFT HAND HIT VIRUS!!!')
          gameOver = true
        }
        if (coins[i].collisionWrist(leftWrist.x, leftWrist.y, i, radiusWrist)) {
          coins.splice(i, 1);
          soundDing.play();
          skorKuning++;
          coins.push(new Coin());
        }
      }
    }
  }
}


function keyPressed() {
  // reset saat gameplay
  if (key === 'r') {
    gameOver = false
    skorKuning = 0
    // coins[0].reset()
    coins[1].reset()
    playAgain()
  }
  if (key === 'p') {
    // play again saat game berakhir
    gameOver = false
    skorKuning = 0
    coins[1].reset()
    playAgain()
    loop()
  }
}
