class ControlButton extends mnWidget {
    constructor(x,y,w,h) {
        super(x,y,w,h);
        this.title = "";
        this.selected = false;
    }
    draw(ctx) {
        ctx.globalAlpha = 0.75;
        ctx.fillStyle = this.selected?"#333":"#666";
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "#000";
        ctx.strokeRect(0, 0, this.width, this.height);

        ctx.fillStyle = "#aaa";
        ctx.font = "16px Arial";
        ctx.fillText(this.title, (this.width/2-ctx.measureText(this.title).width/2), 4 + this.height/2);
    }
    onClick() {
        this.fireEvent("click", null);
        return true;
    }
}