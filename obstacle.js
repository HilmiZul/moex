class Obstacle {
  constructor() {
    this.pos = createVector(
      random(50, width),
      random(50,height / 2)
    )
    this.r = 60
  }

  reset() {
    this.pos = createVector(
      random(50, width),
      random(50, height / 2)
    )
  }

  show() {
    noStroke()
    ellipse(this.pos.x, this.pos.y, this.r)
  }

  collisionWrist(wristX, wristY, i) {
    let hit = collideCircleCircle(
      wristX, wristY, 20,
      obstacles[i].pos.x, obstacles[i].pos.y, this.r
    )
    return hit
  }
}
