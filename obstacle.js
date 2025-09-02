class Obstacle {
  constructor() {
    this.pos = createVector(0, 0)
    this.speedX = random(3,5)
    this.speedY = random(4,6)
  }

  show() {
    image(obstacleImg, this.pos.x, this.pos.y)
  }

  update() {
    this.pos.x += this.speedX
    this.pos.y += this.speedY
  }

  checkEdge() {
    if(this.pos.x > width || this.pos.x < 0) this.speedX *= -1
    if(this.pos.y > height || this.pos.y < 0) this.speedY *= -1
  }

  collision(wristX, wristY, radiusWrist) {
    let hit = collideRectCircle(
      this.pos.x, this.pos.y, obstacleImg.width, obstacleImg.height,
      wristX, wristY, radiusWrist,
    )
    return hit
  }
}
