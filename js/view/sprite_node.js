class SpriteNode {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.scale_x = 1;
        this.scale_y = 1;
        this.rotation = 0;
        this.clear();
    }
    clear() {
        this.image_data = {
            sheet: null,
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            x_off: 0,
            y_off: 0
        }
        this.children = [];
    }
    addChild(child) {
        this.children.push(child);
    }
    setImage(sheet, x, y, w, h, x_off, y_off) {
        this.image_data.sheet = sheet;
        this.image_data.x = x;
        this.image_data.y = y;
        this.image_data.w = w;
        this.image_data.h = h;
        this.image_data.x_off = x_off;
        this.image_data.y_off = y_off;
    }
    setTexture(tex) {
        let td = tex.data;
        this.setImage(tex.sheet, td.xy[0], td.xy[1], td.size[0], td.size[1], td.offset[0], td.offset[1], td.size[0], td.size[1]);
    }
    addPart(file, name, x, y) {
        let a = shipyard.atlas;
        let t = a.getTexture(file, name);

        let n = new SpriteNode();
        n.setTexture(t);
        n.x = x;
        n.y = y;

        this.addChild(n);
        return n;
    }
    _draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * (Math.PI / 180));
        ctx.scale(this.scale_x, this.scale_y);

        this.draw(ctx);
        this.drawChildren(ctx);

        ctx.restore();
    }
    draw(ctx) {
        if (this.image_data.sheet != null) {
            let sheet = document.getElementById(this.image_data.sheet);
            ctx.drawImage(sheet, this.image_data.x, this.image_data.y, this.image_data.w, this.image_data.h, this.image_data.x_off, this.image_data.y_off, this.image_data.w, this.image_data.h);
        }
    }
    drawChildren(ctx, x, y) {
        for (let i=0; i<this.children.length; i++) {
            this.children[i]._draw(ctx);
        }
    }
}