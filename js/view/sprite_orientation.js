class SpriteOrientation extends SpriteNode {
    draw(ctx) {
        ctx.fillStyle = "#ffa500";
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(30, -20);
        ctx.lineTo(50, 0);
        ctx.lineTo(30, 20);
        ctx.fill();
    }
}