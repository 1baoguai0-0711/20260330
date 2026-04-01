let upperPoints = [];
let lowerPoints = [];
let isGameOver = false;
let numPoints = 5;

function setup() {
  createCanvas(400, 400);
  resetGame();
}

function resetGame() {
  upperPoints = [];
  lowerPoints = [];
  isGameOver = false;
  
  // 產生 5 個頂點
  for (let i = 0; i < numPoints; i++) {
    let x = i * (width / (numPoints - 1));
    let y = random(100, 300);
    let gap = random(30, 60); // 空間距離為 30 到 60 之間
    
    upperPoints.push(createVector(x, y));
    lowerPoints.push(createVector(x, y + gap));
  }
}

function draw() {
  background(50); // 背景代表「以外的空間」

  // 繪製安全區域（通道）
  fill(200);
  noStroke();
  beginShape();
  // 串接上方頂點
  for (let p of upperPoints) {
    vertex(p.x, p.y);
  }
  // 串接下方頂點（反向串回以封閉形狀）
  for (let i = lowerPoints.length - 1; i >= 0; i--) {
    vertex(lowerPoints[i].x, lowerPoints[i].y);
  }
  endShape(CLOSE);

  // 繪製邊界線
  stroke(255, 200, 0); // 電流棒邊界顏色
  strokeWeight(3);
  noFill();
  // 上方線條
  beginShape();
  for (let p of upperPoints) vertex(p.x, p.y);
  endShape();
  // 下方線條
  beginShape();
  for (let p of lowerPoints) vertex(p.x, p.y);
  endShape();

  if (isGameOver) {
    showGameOver();
  } else {
    checkCollision();
    // 繪製玩家位置
    fill(0, 255, 0);
    noStroke();
    ellipse(mouseX, mouseY, 8, 8);
  }
}

function checkCollision() {
  // 找出滑鼠目前在哪兩個頂點之間
  for (let i = 0; i < upperPoints.length - 1; i++) {
    let p1 = upperPoints[i];
    let p2 = upperPoints[i+1];
    
    if (mouseX >= p1.x && mouseX <= p2.x) {
      let t = (mouseX - p1.x) / (p2.x - p1.x);
      let currentTopY = lerp(p1.y, p2.y, t);
      let currentBottomY = lerp(lowerPoints[i].y, lowerPoints[i+1].y, t);
      
      // 如果滑鼠 Y 座標不在上下界之間，則失敗
      if (mouseY <= currentTopY || mouseY >= currentBottomY) {
        isGameOver = true;
      }
      return;
    }
  }
  // 如果滑鼠超出畫布左右邊界，也視為失敗
  if (mouseX < 0 || mouseX > width) isGameOver = true;
}

function showGameOver() {
  fill(255, 0, 0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(32);
  text("遊戲失敗！", width / 2, height / 2);
  textSize(16);
  text("點擊滑鼠重新開始", width / 2, height / 2 + 40);
}

function mousePressed() {
  if (isGameOver) {
    resetGame();
  }
}
