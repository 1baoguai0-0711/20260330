let upperPoints = [];
let lowerPoints = [];
let isGameOver = false;
let isGameSuccess = false; // 新增：追蹤遊戲是否成功
let gameStarted = false; // 新增：追蹤玩家是否已經進入路徑啟動遊戲
let numPoints = 5;

function setup() {
  createCanvas(windowWidth, windowHeight); // 使用視窗的寬度和高度
  resetGame();
}

function resetGame() {
  upperPoints = [];
  lowerPoints = [];
  isGameOver = false;
  isGameSuccess = false;
  gameStarted = false; // 重置啟動狀態
  
  // 產生 5 個頂點
  for (let i = 0; i < numPoints; i++) {
    let x = i * (width / (numPoints - 1));
    let y = random(height * 0.25, height * 0.75); // 調整 Y 座標範圍以適應不同高度
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

  // 加入開始與結束的文字
  push();
  noStroke();
  textSize(16);

  // --- 繪製「開始」的圓圈和文字 ---
  let startText = "開始";
  let startTextX = upperPoints[0].x + 10;
  let startTextY = (upperPoints[0].y + lowerPoints[0].y) / 2;
  let startTextWidth = textWidth(startText);
  let startCircleDiameter = max(startTextWidth + 15, 35); // 圓圈直徑，確保足夠大

  fill(255); // 白色圓圈
  ellipse(startTextX + startTextWidth / 2, startTextY, startCircleDiameter, startCircleDiameter);

  fill(50); // 深灰色文字
  textAlign(LEFT, CENTER);
  text(startText, startTextX, startTextY);

  // --- 繪製「結束」的圓圈和文字 ---
  let endText = "結束";
  let endTextX = upperPoints[numPoints - 1].x - 10;
  let endTextY = (upperPoints[numPoints - 1].y + lowerPoints[numPoints - 1].y) / 2;
  let endTextWidth = textWidth(endText);
  let endCircleDiameter = max(endTextWidth + 15, 35); // 圓圈直徑，確保足夠大

  fill(255); // 白色圓圈
  ellipse(endTextX - endTextWidth / 2, endTextY, endCircleDiameter, endCircleDiameter);

  fill(50); // 深灰色文字
  textAlign(RIGHT, CENTER);
  text(endText, endTextX, endTextY);
  pop();

  if (isGameOver) {
    showGameOver();
  } else if (isGameSuccess) {
    showGameSuccess();
  } else {
    checkCollision();
    // 繪製玩家位置
    if (!gameStarted) {
      fill(255, 255, 0); // 未啟動時顯示黃色
      push();
      textAlign(CENTER);
      textSize(20);
      fill(255);
      text("請將滑鼠移至「開始」處以啟動", width / 2, 50);
      pop();
    } else {
      fill(0, 255, 0); // 啟動後顯示綠色
    }
    noStroke();
    ellipse(mouseX, mouseY, 8, 8);
  }
}

function checkCollision() {
  let isInside = false;

  // 找出滑鼠目前在哪兩個頂點之間
  for (let i = 0; i < upperPoints.length - 1; i++) {
    let p1 = upperPoints[i];
    let p2 = upperPoints[i+1];
    
    if (mouseX >= p1.x && mouseX <= p2.x) {
      let t = (mouseX - p1.x) / (p2.x - p1.x);
      let currentTopY = lerp(p1.y, p2.y, t);
      let currentBottomY = lerp(lowerPoints[i].y, lowerPoints[i+1].y, t);
      
      if (mouseY > currentTopY && mouseY < currentBottomY) {
        isInside = true;
      }
      break;
    }
  }

  if (isInside) {
    // 一旦進入路徑，遊戲正式啟動
    gameStarted = true;

    // 檢查是否觸碰到結束區域（最後一個點附近）
    // 因為「結束」字樣繪製在最後一個點左方 10 像素處，這裡偵測是否接近該位置
    if (mouseX >= upperPoints[numPoints - 1].x - 15) {
      isGameSuccess = true;
    }
  } else {
    // 如果滑鼠在路徑外，且遊戲已經啟動，則判斷為失敗
    if (gameStarted) {
      isGameOver = true;
    }
  }
  
  // 如果遊戲已啟動且滑鼠超出左邊界，視為失敗
  if (gameStarted && mouseX < 0) isGameOver = true;
  // 右邊界已由上方的「成功判定」邏輯處理
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

function showGameSuccess() {
  fill(0, 255, 0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(32);
  text("恭喜過關！", width / 2, height / 2);
  textSize(16);
  text("點擊滑鼠挑戰下一關", width / 2, height / 2 + 40);
}

function mousePressed() {
  if (isGameOver || isGameSuccess) {
    resetGame();
  }
}

// 當視窗大小改變時，重新調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resetGame(); // 重新生成路徑以適應新尺寸
}
