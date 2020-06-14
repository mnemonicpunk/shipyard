class SpritePlaceholder extends SpriteNode {
    constructor() {
        super();
        this.label = "";
    }
    draw(ctx) {
        ctx.fillStyle = "#ffa500";
        let m = ctx.measureText(this.label);
        ctx.fillText(this.label, -m.width/2, 0);
    }
}