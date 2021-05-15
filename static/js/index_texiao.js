var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2
}
window.addEventListener("mousemove", function(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener("resize", function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function getDistanceBetweenTwoPoints(x1, y1, x2, y2) {
  var distance = {
    x: x2 - x1,
    y: y2 - y1
  }
  var hypotenuse = Math.sqrt(Math.pow(distance.x, 2) + Math.pow(distance.y, 2));
  return hypotenuse;
}
var colors = [{
  r: 176,
  g: 218,
  b: 255
}, {
  r: 100,
  g: 183,
  b: 255
}, {
  r: 0,
  g: 86,
  b: 127
}, {
  r: 0,
  g: 50,
  b: 83
}, ];

function Particle(x, y, dx, dy, radius) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.gravity = .3;
  this.timeToLive = 2;
  this.opacity = 1;
  this.randomColor = Math.floor(Math.random() * colors.length);
  this.update = function() {
    var distanceFromMouse = getDistanceBetweenTwoPoints(this.x, this.y, mouse.x, mouse.y)
    if (this.y + this.radius + this.dy > canvas.height / 1.08) {
      this.dy = -this.dy * .8;
    } else {
      this.dy += this.gravity;
    }
    if (this.x + this.radius + this.dx > canvas.width) {
      this.dx = -this.dx * .4;
    }
    if (distanceFromMouse < 100) {
      this.dx += 5;
    }
    // if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius + this.dx < 0) {
    // 	this.dx = -this.dx;
    // }
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
    this.timeToLive -= 0.01;
    this.opacity -= 1 / (this.timeToLive / 0.01);
    this.radius -= radius / (this.timeToLive / 0.01);
  }
  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, Math.abs(this.radius), 10, 0, Math.PI * 2, false);
    c.strokeStyle = 'rgba(' + colors[this.randomColor].r + ',' + colors[this.randomColor].g + ',' + colors[this.randomColor].b + ',' + this.opacity + ')';
    c.stroke();
    c.closePath();
  }
}

function Moon() {
  this.y = canvas.height / 1.2;
  this.dy = 0.1;
  this.radius = 50;
  var moon = new Image(100, 100);
  moon.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/448917/moon.png";
  moon.style.opacity = 0.5;
  this.update = function() {
    if (this.y + this.radius > 170) {
      this.y -= this.dy;
    }
    this.draw();
  }
  this.draw = function() {
    c.save();
    c.beginPath();
    c.arc(canvas.width / 1.35, this.y, 50, Math.PI * 2, false);
    c.fillStyle = "#fdfaa7";
    c.shadowColor = '#fdfaa7';
    c.shadowBlur = 50;
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 0;
    c.fill();
    c.restore();
    c.save();
    c.globalAlpha = 0.3;
    c.translate(-50, -50);
    c.drawImage(moon, canvas.width / 1.35, this.y);
    c.restore();
  }
}

function MiniStar() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height;
  this.radius = Math.random() * 3;
  this.update = function() {
    this.y -= 0.03;
    if (this.y - this.radius < 0) {
      this.y = canvas.height + this.radius;
    }
    this.draw();
  }
  this.draw = function() {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.shadowColor = '#E3EAEF';
    c.shadowBlur = (Math.random() * 10) + 10;
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 0;
    c.fillStyle = "#6c9fc3";
    c.fill();
    c.closePath();
    c.restore();
  }
}
var particles = [];
var backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height);
backgroundGradient.addColorStop(0, "rgba(0, 42, 80, 1.0)");
backgroundGradient.addColorStop(1, "rgba(44, 72, 91, 1.0)");
var miniStars = [];
for (var i = 0; i < 100; i++) {
  miniStars.push(new MiniStar());
}
var moon = new Moon();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = backgroundGradient;
  c.fillRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < miniStars.length; i++) {
    miniStars[i].update();
  }
  moon.update();
  var oceanGradient = c.createLinearGradient(0, canvas.height / 1.5, 0, canvas.height);
  oceanGradient.addColorStop(0, "#224158");
  oceanGradient.addColorStop(1, "rgba(0, 42, 80, 1.0)");
  var grassGradient = c.createLinearGradient(0, canvas.height / 1.08, 0, canvas.height);
  grassGradient.addColorStop(0, "#10451a");
  grassGradient.addColorStop(1, "#9DA574");
  c.fillStyle = grassGradient;
  c.fillRect(0, canvas.height / 1.08, canvas.width, canvas.height / 10.0);
  c.fillStyle = oceanGradient;
  c.fillRect(0, canvas.height / 1.34, canvas.width, canvas.height / 5.5);
  for (var i = 0; i < 7; i++) {
    var radius = 10;
    // Prevent balls from being spawned off screen
    var position = {
      // x: radius + (canvas.width - radius * 2) * Math.random(),
      x: -radius,
      y: 50 + (Math.random() * 100),
    }
    var velocity = {
      x: Math.random() * 5,
      // x: 0,
      y: Math.random(),
    }
    //Do something
    particles.push(new Particle(position.x, position.y, velocity.x, velocity.y, radius));
  }
  for (var i = 0; i < particles.length; i++) {
    particles[i].update();
    if (particles[i].timeToLive < 0) {
      particles.splice(i, 1);
    }
  }
}
animate();