export default function draw(points, topLeft, offsetY = 0) {
    const canvas = document.getElementById('screen');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'deeppink';
    points.forEach(({ x, y }) => drawBeam(x, y, ctx, offsetY));
    drawGrid(ctx);
    drawSquare(topLeft, ctx, offsetY);
}

function drawGrid(ctx) {
    ctx.beginPath();
    ctx.lineWidth = '1';
    ctx.strokeStyle = 'grey';
    for (var x = 0; x < 5; x++) {
        for (var y = 0; y < 3; y++) {
            ctx.rect(x * 100, y * 100, 100, 100);
            ctx.stroke();
        }
    }
    ctx.fillStyle = 'cyan';
    ctx.font = '14px monospace';
    ctx.fillText(`X=100`, 102, 12);
    ctx.fillText(`200`, 202, 12);
    ctx.fillText(`300`, 302, 12);
    ctx.fillText(`400`, 402, 12);

    ctx.fillText(`Y=900`, 3, 98);
    ctx.fillText(`1000`, 3, 198);
    ctx.fillText(`1100`, 3, 298);
}

function drawSquare({ x, y }, ctx, offsetY = 0) {
    ctx.beginPath();
    ctx.lineWidth = '1';
    ctx.strokeStyle = 'cyan';
    ctx.rect(x, y - offsetY, 100, 100);
    ctx.stroke();
    ctx.fillStyle = 'cyan';
    ctx.font = '14px monospace';
    ctx.fillText(`(${x},${y})`, x - 35, y - 5 - offsetY);
    ctx.fillRect(x-1, y-1 - offsetY, 3, 3);
 }

function drawBeam(x, y, ctx, offsetY = 0) {
    ctx.fillRect(x, y - offsetY, 1, 1);
}