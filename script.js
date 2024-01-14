const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const randomizeButton = document.getElementById('randomizeButton');
randomizeButton.addEventListener('click', randomizeBlueBalls);

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
const ballRadius = 20;

const blueBallsCount = 2;

const blueBalls = [];

let startTime;
let elapsedTime = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];

function createFirework(x, y) {
  return {
    x,
    y,
    radius: 2,
    speedX: Math.random() * 8 - 4,
    speedY: -Math.random() * 15 - 5,
    color: 'hsl(' + Math.random() * 360 + ', 100%, 50%)',
    lifespan: Math.random() * 2 + 1,
  };
}

let fireworkStartTime = null;
let fireworksCount = 0;

function animateFireworks() {
  if (!fireworkStartTime) {
    fireworkStartTime = performance.now();
    requestAnimationFrame(animateFireworks);
  } else {
    const elapsedTime = (performance.now() - fireworkStartTime) / 1000;

    if (elapsedTime < 10) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
      drawTimer();
      drawYouWin();

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const firework = fireworks[i];
        firework.x += firework.speedX;
        firework.y += firework.speedY;
        firework.radius += 0.5;
        firework.lifespan -= 0.025;

        ctx.beginPath();
        ctx.arc(firework.x, firework.y, firework.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = firework.color;
        ctx.fill();

        if (firework.lifespan <= 0) {
          fireworks.splice(i, 1);
        }
      }

      requestAnimationFrame(animateFireworks);
    }
  }
}

function drawBall() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw red ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    //change color back to blue for default values
    ctx.fillStyle = 'blue';
  
    // Draw blue balls
    // ctx.fillStyle = 'blue';
    for (const blueBall of blueBalls) {
        ctx.fillStyle = blueBall.color;
        ctx.beginPath();
        ctx.arc(blueBall.x, blueBall.y, blueBall.radius, 0, Math.PI * 2, false);
        ctx.fill();
    }
}

function drawTimer() {
  ctx.clearRect(0, 0, canvas.width, 40); // Clear previous time display
  ctx.font = '24px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText(`Time: ${elapsedTime.toFixed(2)}s`, canvas.width / 2, 20);
}

function drawYouWin() {

  if (fireworksCount === 0) {
    for (let i = 0; i < 20; i++) {
      fireworks.push(createFirework(Math.random() * canvas.width, canvas.height));
    }

    animateFireworks();
    fireworksCount++;
  }

  
  ctx.font = '48px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText(`YOU WIN!`, canvas.width / 2, canvas.height / 2);
}

// Generate blue balls at random positions
for (let i = 0; i < blueBallsCount; i++) {
    blueBalls.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 10,
    });
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

drawBall();
drawTimer(); // Draw timer initially

// drawTimer();
if (blueBalls.length === 0) {
  drawYouWin();
}

window.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case 37: // Left arrow
            ballX -= 5;
            break;
        case 38: // Up arrow
            ballY -= 5;
            break;
        case 39: // Right arrow
            ballX += 5;
            break;
        case 40: // Down arrow
            ballY += 5;
            break;
    }

    if (!startTime && event.keyCode >= 37 && event.keyCode <= 40) {
      startTime = performance.now();
    }

    // Check for collisions and update timer
    for (let i = 0; i < blueBalls.length; i++) {
        const blueBall = blueBalls[i];
        if (distance(ballX, ballY, blueBall.x, blueBall.y) < ballRadius + blueBall.radius) {
            blueBalls.splice(i, 1);
            blueBall.x = canvas.width + blueBall.radius; // move off-screen
        }
    }

    if (blueBalls.length === 0) {
        // Game over, stop the timer
        startTime = null;
    } else {
        elapsedTime = (performance.now() - startTime) / 1000;
    }

    drawBall();
    drawTimer();
    if (blueBalls.length === 0) {
      drawYouWin();
    }
});

// Update timer constantly
setInterval(function() {
    if (startTime) { // Only update if the game is in progress
        elapsedTime = (performance.now() - startTime) / 1000;
        drawTimer();
    }
}, 10); // Update every 10 milliseconds



function randomizeBlueBalls() {
    for (const blueBall of blueBalls) {
        blueBall.radius = Math.random() * 20 + 5; // Random radius between 5 and 25
        blueBall.color = 'hsl(' + Math.random() * 360 + ', 100%, 50%)'; // Random hue, full saturation, 50% lightness

    }
    drawBall(); // Redraw the balls with the new colors and sizes
}
// Sources:
// 1. https://medium.com/samsung-internet-dev/making-an-ar-game-with-aframe-529e03ae90cb