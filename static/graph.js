const SPACE = 20;

const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

const rotate = (x, y, rad) => {
  const nx = Math.cos(rad * x) - Math.sin(rad * y);
  const ny = Math.sin(rad * x) - Math.cos(rad * y);
  return (nx, ny);
}

// Draws a triangle with an active port at (x, y).
// when rot == 0, triangle points down.
// when rot == 0.5, triangle points up.
const triangle = (is_white, x, y, turn) => {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + SPACE * 0.5, y - SPACE);
  ctx.lineTo(x - SPACE * 0.5, y - SPACE);
  ctx.lineTo(x, y);
  if (is_white) {
    ctx.stroke();
  } else {
      ctx.fill();  
  }
}

const draw = now => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const rot = now / 1000.0 % 1.0;
  triangle(true, 100, 100, rot);
  window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);

