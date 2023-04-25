const SPACE = 20;

const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

const ROPE = 0;
const PRT1 = 1;
const PRT2 = 2;
const NCON = 3;
const NDUP = 4;
const FREE = 5;

// kind, x, y, connections
let graph = [
  [ROPE, 100, 100, [2, 1]],
  [ROPE, 100, 200, [0, 2]],
  [ROPE, 200, 100, [1, 0]], 
];

let reuse = [];
let inser = [];
let fresh = [];

const neighbors = cons => {
  cons.map(index => graph[index]);
}

const is_node = kind => {
  return (kind == NCON || kind == NDUP); 
}

const alloc = node => {
  if reuse.length === 0 {
    fresh.push(node);
    return graph.length + fresh.length;
  } else {
    const index = reuse.pop();
    inser.push([index, node]);
    return index;
  }
}

const update = (i, n) => {
  [k, x, y, c] = n;
  if (k === FREE) { return node; }
  const cons = neighbors(c);

  if (k === ROPE) { 
    let [[k1, x1, y1, _], 
         [k2, x2, y2, _]] = cons;
    if (is_node(k1) || is_node(k2)) {
      reuse.push(
      // TODO
    }
  }

  if (k === PRT1) { }
  if (k === PRT2) { }
  if (k === NCON) { }
  if (k === NDUP) { }
}

const update_all = now => {
  let new_graph = [];
  let i = 0;
  for (const [index, node] in graph.entries()) {
    new_node = update(index, node);
    new_graph.push(new_node);
  }
  graph = new_graph;
};

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
  update_all(now);

  // triangle(true, 100, 100, rot);
  window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);

