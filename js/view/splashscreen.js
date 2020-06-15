class SplashScreen extends mnWidget {
    constructor(x,y,w,h) {
        super(x,y,w,h);
        this.loading = 0;
    }
    onClick() {
        return true;
    }
    draw(ctx) {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.fillStyle = "#fff";
        ctx.font = "144px Arial";
        
        let m = ctx.measureText("Shipyard");
        ctx.fillText("Shipyard", (this.width/2 - m.width/2), this.height/2);

        ctx.fillStyle = "#fff";
        ctx.font = "30px Arial";
        
        m = ctx.measureText("BETA VERSION");
        ctx.fillText("BETA VERSION", (this.width/2 - m.width/2), this.height/2 + 60);

        ctx.strokeStyle = "#fff";
        ctx.strokeRect(this.width/2 - 200, this.height/2 + 100, 400, 30);
        ctx.fillRect(this.width/2 - 200, this.height/2 + 100, 400*(this.loading/100), 30);
    }
}