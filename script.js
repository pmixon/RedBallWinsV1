const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
const ballRadius = 20;

const blueBalls = [];

let startTime;
let elapsedTime = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawBall() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw red ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, false);
    ctx.fillStyle = 'red';
    ctx.fill();

    // Draw blue balls
    ctx.fillStyle = 'blue';
    for (const blueBall of blueBalls) {
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
  ctx.font = '48px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText(`YOU WIN!`, canvas.width / 2, canvas.height / 2);
}

// Generate blue balls at random positions
for (let i = 0; i < 10; i++) {
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

function createFirework(x, y) {
  const particles = [];
  for (let i = 0; i < 100; i++) {
    // Create a particle with random speed, direction, and lifespan
    const particle = {
      x,
      y,
      speed: Math.random() * 10 + 5, // adjust speed range as needed
      angle: Math.random() * Math.PI * 2,
      lifespan: Math.random() * 2 + 1, // adjust lifespan range as needed
      size: Math.random() * 5 + 2, // adjust size range as needed
      color: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
    };
    particles.push(particle);
  }
  return particles;
}

function drawWinMessage() {
  ctx.font = '60px Arial';
  ctx.fillStyle = 'green';
  ctx.textAlign = 'center';
  ctx.fillText('YOU WIN!', canvas.width / 2, canvas.height / 2);

  // Create and store fireworks particles
  const fireworks = createFirework(canvas.width / 2, canvas.height / 2);

  // Draw and update fireworks in setInterval
  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWinMessage(); // redraw message for persistence

    // Update and draw particles
    for (let i = fireworks.length - 1; i >= 0; i--) {
      const particle = fireworks[i];
      particle.x += Math.cos(particle.angle) * particle.speed;
      particle.y += Math.sin(particle.angle) * particle.speed;
      particle.lifespan -= 10

      if (particle.lifespan <= 0) {
        fireworks.splice(i, 1); // remove dead particles
      } else {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, 10); // update every 10 milliseconds
}
// Sources:
// 1. https://medium.com/samsung-internet-dev/making-an-ar-game-with-aframe-529e03ae90cb